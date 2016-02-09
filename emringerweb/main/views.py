from datetime import datetime
from os.path import abspath
import json
import os

from flask import render_template, session, redirect, request, url_for, current_app, abort
from flask.views import MethodView
from werkzeug import secure_filename

from emringerweb.main import main_blueprint
# from emringerweb.models import Job, Residue, Angle
from emringerweb.tasks import run_emringer, handle_delete




#################

def allowed_file(filename, type):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS[type]


def gen_file_name(filename):
    """
    If file was exist already, rename it and return a new name
    """

    i = 1
    while os.path.exists(os.path.join(main_blueprint.config['UPLOAD_DIRECTORY'], filename)):
        name, extension = os.path.splitext(filename)
        filename = '%s_%s%s' % (name, str(i), extension)
        i = i + 1

    return filename

# Utils
##################
def make_response(status=200, content=None):
    """ Construct a response to an upload request.
    Success is indicated by a status of 200 and { "success": true }
    contained in the content.

    Also, content-type is text/plain by default since IE9 and below chokes
    on application/json. For CORS environments and IE9 and below, the
    content-type needs to be text/html.
    """
    return current_app.response_class(json.dumps(content,
        indent=None if request.is_xhr else 2), mimetype='text/plain')


def validate(attrs):
    """ No-op function which will validate the client-side data.
    Werkzeug will throw an exception if you try to access an
    attribute that does not have a key for a MultiDict.
    """
    try:
        required_attributes = ('qquuid', 'qqfile')
        [attrs.get(k) for k in required_attributes]
        return True
    except Exception, e:
        return False




def handle_upload(f, attrs):
    """ Handle a chunked or non-chunked upload.
    """

    chunked = False
    dest_folder = os.path.join(current_app.config['UPLOAD_DIRECTORY'], secure_filename(attrs['qquuid']))
    dest = os.path.join(dest_folder, secure_filename(attrs['qqfilename']))
    

    # Chunked
    if attrs.has_key('qqtotalparts') and int(attrs['qqtotalparts']) > 1:
        chunked = True
        dest_folder = os.path.join(current_app.config['CHUNKS_DIRECTORY'], secure_filename(attrs['qquuid']))
        dest = os.path.join(dest_folder, attrs['qqfilename'], secure_filename(str(attrs['qqpartindex'])))

    save_upload(f, dest)
    current_app.logger.info("Saved file %s to %s", attrs['qqfilename'], dest)

    if chunked and (int(attrs['qqtotalparts']) - 1 == int(attrs['qqpartindex'])):

        combine_chunks(attrs['qqtotalparts'],
            attrs['qqtotalfilesize'],
            source_folder=os.path.dirname(dest),
            dest=os.path.join(current_app.config['UPLOAD_DIRECTORY'], secure_filename(attrs['qquuid']),
                secure_filename(attrs['qqfilename'])))

        shutil.rmtree(os.path.dirname(os.path.dirname(dest)))


def save_upload(f, path):
    """ Save an upload.
    Uploads are stored in media/uploads
    """
    if not os.path.exists(os.path.dirname(path)):
        os.makedirs(os.path.dirname(path))
    with open(path, 'wb+') as destination:
        destination.write(f.read())



def combine_chunks(total_parts, total_size, source_folder, dest):
    """ Combine a chunked file into a whole file again. Goes through each part
    , in order, and appends that part's bytes to another destination file.

    Chunks are stored in media/chunks
    Uploads are saved in media/uploads
    """

    if not os.path.exists(os.path.dirname(dest)):
        os.makedirs(os.path.dirname(dest))

    with open(dest, 'wb+') as destination:
        for i in xrange(int(total_parts)):
            part = os.path.join(source_folder, str(i))
            with open(part, 'rb') as source:
                destination.write(source.read())





@main_blueprint.route('/')
def index():
    """The homepage for the app"""
    # This page is not 
    return render_template('index.html')#, form=form)



@main_blueprint.route('/submit')

def submit():
    """The submission page for the app"""
    return render_template('submit.html')#, form=form)


@main_blueprint.route('/start_job', methods=['POST',])
def start_job():
    job_request = request.get_json()
    
    
    map_folder = os.path.join(current_app.config['UPLOAD_DIRECTORY'], secure_filename(job_request[u'map']))
    map_file = os.listdir(map_folder)
    assert len(map_file) == 1
    map_filename = os.path.join(map_folder, map_file[0])

    
    model_folder = os.path.join(current_app.config['UPLOAD_DIRECTORY'], secure_filename(job_request[u'model']))
    model_file = os.listdir(model_folder)
    assert len(model_file) == 1
    model_filename = os.path.join(model_folder, model_file[0])

    current_app.logger.info("Running emringer on %s and %s", map_file, model_file)
    task = run_emringer.apply_async(args=[model_filename, map_filename, secure_filename(job_request[u'model']), 
                                          secure_filename(job_request[u'map']), job_request[u"user_email"] or None])
    

    return make_response(200, {'waiting_page': render_template('waiting_page.html', job_id=task.id, pdb_name=model_file[0], 
                                                                map_name=map_file[0], status="SUBMITTED")})

@main_blueprint.route('/check_status', methods=['POST'])
def check_job():
    job_id = request.get_json()[u'job_id']
    task = run_emringer.AsyncResult(job_id)
    if task.state == "SUCCESS":
        return make_response(200, {'status': task.state, 'redirect': url_for("main.display_result", job_id=job_id)})
    # elif task.state == "FAILED":
    #     return make_response(200, {'status': task.state, 'redirect': url_for(".job_failed",job_id=job_id)})
    else:
        if task.state == "FAILED":
            current_app.logger.error("Job Failed: %s", job_id)
        return make_response(200, {'status': task.state})

@main_blueprint.route('/show_result/<job_id>')
def display_result(job_id):
    task = run_emringer.AsyncResult(job_id)
    if task.status=="SUCCESS":
        data, pdbfile, mapfile = task.result
        statistics = data[u"Final Statistics"]
        return render_template('results.html', statistics=statistics, pdbfile=pdbfile, mapfile=mapfile, job_id=job_id)
    elif task.status == "REVOKED":
        current_app.logger.warning("User attempted to load expired result: %s", job_id)
        return abort(410)
    else:
        current_app.logger.warning("User attempted to load result that doesn't exist: %s", job_id)
        return abort(404)


@main_blueprint.route('/get_result', methods=['POST',])
def get_result():
    job_id = request.get_json()[u'job_id']
    current_app.logger.info("Request for results from job %s", job_id)
    task = run_emringer.AsyncResult(job_id)
    data,_,_ = task.result
    if task.status == "SUCCESS":
        current_app.logger.info("Delivered data: %s", job_id)
        return make_response(200, data)
    else:
        current_app.logger.warning("User attempted to request data that is not available: %s", job_id)
        return make_response(500, {"status": task.status})



class UploadAPI(MethodView):
    """ View which will handle all upload requests sent by Fine Uploader.

    Handles POST and DELETE requests.
    """

    def post(self):
        """A POST request. Validate the form and then handle the upload
        based ont the POSTed data. Does not handle extra parameters yet.
        """
        if validate(request.form): 
            current_app.logger.info("Uploading Files: %s", request.files['qqfile'])
            handle_upload(request.files['qqfile'], request.form)
            return make_response(200, { "success": True, "form": request.form})
        else:
            return make_response(400, { "error", "Invalid request" })

    def delete(self, uuid):
        """A DELETE request. If found, deletes a file with the corresponding
        UUID from the server's filesystem.
        """
        try:
            handle_delete(uuid)
            current_app.logger.warning("User deleted data: %s", uuid)
            return make_response(200, { "success": True })
        except Exception, e:
            current_app.logger.warning("Deletion failed: %s", uuid)
            return make_response(400, { "success": False, "error": e.message })

upload_view = UploadAPI.as_view('upload_view')
main_blueprint.add_url_rule('/upload', view_func=upload_view, methods=['POST',])
main_blueprint.add_url_rule('/upload/<uuid>', view_func=upload_view, methods=['DELETE',])

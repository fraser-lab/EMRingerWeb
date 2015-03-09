from . import main
from flask import render_template, session, redirect, request, url_for, current_app 
from flask.views import MethodView
from datetime import datetime
from .. import db
from ..models import Job, Residue, Angle
from werkzeug import secure_filename
import os
import json

# Asynch Calling
##################
import threading
import subprocess

def popenAndCall(onExit, popenArgs):
    """
    Runs the given args in a subprocess.Popen, and then calls the function
    onExit when the subprocess completes.
    onExit is a callable object, and popenArgs is a list/tuple of args that 
    would give to subprocess.Popen.
    """
    def runInThread(onExit, popenArgs):
        proc = subprocess.Popen(*popenArgs)
        proc.wait()
        onExit()
        return
    thread = threading.Thread(target=runInThread, args=(onExit, popenArgs))
    thread.start()
    # returns immediately after the thread starts
    return thread


#################

def allowed_file(filename, type):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS[type]


def gen_file_name(filename):
    """
    If file was exist already, rename it and return a new name
    """

    i = 1
    while os.path.exists(os.path.join(main.config['UPLOAD_DIRECTORY'], filename)):
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
        #required_attributes = ('qquuid', 'qqfilename')
        #[attrs.get(k) for k,v in attrs.items()]
        return True
    except Exception, e:
        return False


def handle_delete(uuid):
    """ Handles a filesystem delete based on UUID."""
    location = os.path.join(current_app.config['UPLOAD_DIRECTORY'], uuid)
    print(uuid)
    print(location)
    shutil.rmtree(location)

def handle_upload(f, attrs):
    """ Handle a chunked or non-chunked upload.
    """

    chunked = False
    dest_folder = os.path.join(current_app.config['UPLOAD_DIRECTORY'], attrs['qquuid'])
    dest = os.path.join(dest_folder, attrs['qqfilename'])
    print "made destination"

    # Chunked
    if attrs.has_key('qqtotalparts') and int(attrs['qqtotalparts']) > 1:
        chunked = True
        dest_folder = os.path.join(current_app.config['CHUNKS_DIRECTORY'], attrs['qquuid'])
        dest = os.path.join(dest_folder, attrs['qqfilename'], str(attrs['qqpartindex']))

    save_upload(f, dest)
    print "saved upload"

    if chunked and (int(attrs['qqtotalparts']) - 1 == int(attrs['qqpartindex'])):

        combine_chunks(attrs['qqtotalparts'],
            attrs['qqtotalfilesize'],
            source_folder=os.path.dirname(dest),
            dest=os.path.join(current_app.config['UPLOAD_DIRECTORY'], attrs['qquuid'],
                attrs['qqfilename']))

        shutil.rmtree(os.path.dirname(os.path.dirname(dest)))


def save_upload(f, path):
    """ Save an upload.
    Uploads are stored in media/uploads
    """
    if not os.path.exists(os.path.dirname(path)):
        os.makedirs(os.path.dirname(path))
    with open(path, 'wb+') as destination:
        print "path open"
        destination.write(f.read())
        print "path written"


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





@main.route('/')
# """The homepage for the app"""
def index():
	# form = JobForm()
	# if form.validate_on_submit():
	# 	return redirect(url_for('index'))
	return render_template('index.html')#, form=form)


@main.route('/start_job', methods=['POST',])
def run_emringer():
    print request.get_json()[u'map']
    return make_response(200, {'waiting_page': render_template('waiting_page.html', job_id=254)})

@main.route('/check_job', methods=['POST',])
def check_job():
    print request.get_json()[u'job_id']
    return make_response(200, {'status': False})

class UploadAPI(MethodView):
    """ View which will handle all upload requests sent by Fine Uploader.

    Handles POST and DELETE requests.
    """

    def post(self):
        """A POST request. Validate the form and then handle the upload
        based ont the POSTed data. Does not handle extra parameters yet.
        """
        if validate(request.form):
            print request.files['qqfile']
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
            return make_response(200, { "success": True })
        except Exception, e:
            return make_response(400, { "success": False, "error": e.message })

upload_view = UploadAPI.as_view('upload_view')
main.add_url_rule('/upload', view_func=upload_view, methods=['POST',])
main.add_url_rule('/upload/<uuid>', view_func=upload_view, methods=['DELETE',])

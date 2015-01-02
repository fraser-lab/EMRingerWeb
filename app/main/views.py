from . import main
from flask import render_template, session, redirect, url_for 
from datetime import datetime
from .forms import JobForm, EmailForm
from .. import db
from ..models import Job, Residue, Angle
from werkzeug import secure_filename

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def gen_file_name(filename):
    """
    If file was exist already, rename it and return a new name
    """

    i = 1
    while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        name, extension = os.path.splitext(filename)
        filename = '%s_%s%s' % (name, str(i), extension)
        i = i + 1

    return filename

@main.route('/', methods= ['GET', 'POST'])
# """The homepage for the app"""
def index():
	form = JobForm()
	if form.validate_on_submit():
		return redirect(url_for('index'))
	return render_template('index.html', form=form)

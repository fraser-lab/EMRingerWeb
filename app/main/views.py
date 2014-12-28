from . import main
from flask import render_template, session, redirect, url_for 
from datetime import datetime
from .forms import JobForm, EmailForm
from .. import db
from ..models import Job, Residue, Angle
from werkzeug import secure_filename

@main.route('/', methods= ['GET', 'POST'])
# """The homepage for the app"""
def index():
	form = JobForm()
	if form.validate_on_submit():
		return redirect(url_for('index'))
	return render_template('index.html', form=form)

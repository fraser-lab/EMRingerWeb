from . import main
from flask import render_template, session, redirect, url_for 
from datetime import datetime
from .forms import JobForm, EmailForm
from .. import db
from ..models import Job, Residue, Angle

@main.route('/')
# """The homepage for the app"""
def index():
	return render_template('index.html')

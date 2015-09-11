#tasks.py
import subprocess
import json
import os
import shutil


from celery import Celery
from flask import current_app, render_template
from flask.ext.mail import Message
from werkzeug import secure_filename

from emringerweb.app import make_celery_app
from emringerweb.email import send_email


celery = make_celery_app(current_app)


@celery.task
def run_emringer(pdbfile, mapfile, pdbuuid=None, mapuuid=None, user_email=None):
  output = subprocess.Popen(["/usr/local/phenix-1.10pre-2124/build/bin/phenix.python", 
                              "emringerweb/main/emringer_analysis.py", pdbfile, mapfile], 
                              stdout=subprocess.PIPE).communicate()
  # Print warnings/errors
  print output[1]
  with open(output[0].strip("\n"), 'r') as file:
    data = json.loads(file.read())

  if user_email:
    task_id = run_emringer.request.id
    email_task = send_asynchronous_email.apply_async(args=[data, user_email, os.path.basename(pdbfile), os.path.basename(mapfile), task_id])
  if pdbuuid:
    handle_delete.apply_async(args=[pdbuuid])
  if mapuuid:
    handle_delete.apply_async(args=[mapuuid])
  return data

@celery.task
def send_asynchronous_email(results, email, pdbfile, mapfile, task_id):
  if send_email(results, email, pdbfile, mapfile, task_id):
    print "Success email sent to %s" % email
  else:
    print "Sending mail to %s failed" % email


@celery.task
def handle_delete(uuid):
    """ Handles a filesystem delete based on UUID."""
    location = os.path.join(current_app.config['UPLOAD_DIRECTORY'], secure_filename(uuid))
    print(uuid)
    print(location)
    shutil.rmtree(location)
    return "removed"

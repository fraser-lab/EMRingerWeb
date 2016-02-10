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
  output = subprocess.Popen([os.getenv("CCTBX_PYTHON"), 
                              "emringerweb/main/emringer_analysis.py", pdbfile, mapfile], 
                              stdout=subprocess.PIPE).communicate()
  # Print result
  current_app.logger.info("EMRinger performed and saved to %s", output[0].strip('\n'))
  # print warnings
  if output[1]:
    current_app.logger.warning(output[1])
  with open(output[0].strip("\n"), 'r') as file:
    data = json.loads(file.read())

  if user_email:
    task_id = run_emringer.request.id
    email_task = send_asynchronous_email.apply_async(args=[data, user_email, os.path.basename(pdbfile), os.path.basename(mapfile), task_id], expires=60*60*24)
  if pdbuuid:
    handle_delete.apply_async(args=[pdbuuid], expires=60*60*24)
  if mapuuid:
    handle_delete.apply_async(args=[mapuuid], expires=60*60*24)
  return data, os.path.basename(pdbfile), os.path.basename(mapfile)

@celery.task
def send_asynchronous_email(results, email, pdbfile, mapfile, task_id):
  if send_email(results, email, pdbfile, mapfile, task_id):
    current_app.logger.info("Success email sent to %s for job %s", email, task_id)
  else:
    current_app.logger.error("Sending mail to %s failed for job %s" % email, task_id)


@celery.task
def handle_delete(uuid):
    """ Handles a filesystem delete based on UUID."""
    location = os.path.join(current_app.config['UPLOAD_DIRECTORY'], secure_filename(uuid))
    current_app.logger.info("Deletion Task Started for %s", uuid)
    shutil.rmtree(location)
    return "removed"

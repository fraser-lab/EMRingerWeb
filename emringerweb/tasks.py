#tasks.py
import subprocess
import json
import os
import shutil


from celery import Celery
from flask import current_app, render_template
from flask.ext.mail import Message
from werkzeug import secure_filename

from emringerweb.app import mail, make_celery_app


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
    email_task = send_email.apply_async(args=[data, user_email, pdbfile, mapfile, task_id])
  if pdbuuid:
    handle_delete.apply_async(args=[pdbuuid])
  if mapuuid:
    handle_delete.apply_async(args=[mapuuid])
  return data

@celery.task
def send_email(results, email, pdbfile, mapfile, task_id):
  msg = Message('[EMRinger] Results for %s and %s' % (pdbfile, mapfile), 
                sender=current_app.config["ADMINS"][0], recipients=[email])
  statistics = results["Final Statistics"]
  url = url_for()
  msg.body=render_template("email/success.txt", pdbfile=pdbfile, 
                            mapfile=mapfile, statistics=statistics, 
                            task_id=task_id)
  mail.send(msg)
  print "Success email sent to %s" % email


@celery.task
def handle_delete(uuid):
    """ Handles a filesystem delete based on UUID."""
    location = os.path.join(current_app.config['UPLOAD_DIRECTORY'], secure_filename(uuid))
    print(uuid)
    print(location)
    shutil.rmtree(location)
    return "removed"

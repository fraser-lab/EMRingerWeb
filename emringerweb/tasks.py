#tasks.py
import subprocess
import json

from celery import Celery
from flask import current_app


from emringerweb.app import make_celery_app

celery = make_celery_app(current_app)


@celery.task
def run_emringer(pdbfile, mapfile):
  output = subprocess.Popen(["/usr/local/phenix-1.10pre-2124/build/bin/phenix.python", "emringerweb/main/emringer_analysis.py", pdbfile, mapfile], stdout=subprocess.PIPE).communicate()

  with open(output[0].strip("\n"), 'r') as file:
    data = json.loads(file.read())
  return data

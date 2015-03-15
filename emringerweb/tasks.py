#tasks.py
from subprocess import check_output

from emringerweb.app import make_celery_app


celery = make_celery_app()


@celery.task
def run_emringer(pdbfile, mapfile):
    output = check_output(["/Applications/phenix-dev-1938/build/bin/cctbx.python", "emringerweb/main/emringer_analysis.py", pdbfile, mapfile])
    print output

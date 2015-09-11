from flask import current_app, render_template, url_for
from flask.ext.mail import Message

from emringerweb.app import mail


def send_email(results, email, pdbfile, mapfile, task_id):
  msg = Message('[EMRinger] Results for %s and %s' % (pdbfile, mapfile), 
                sender=current_app.config["MAIL_DEFAULT_SENDER"], recipients=[email])
  statistics = results["Final Statistics"]
  url = current_app.config["SERVER_NAME"]+"/show_result/" +task_id
  msg.body=render_template("email/success.txt", pdbfile=pdbfile, 
                            mapfile=mapfile, statistics=statistics, 
                            url=url)
  msg.html=render_template("email/success.html", statistics=statistics, url=url, pdbfile=pdbfile, mapfile=mapfile)
  mail.send(msg)
  return True
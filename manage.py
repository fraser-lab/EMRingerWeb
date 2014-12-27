#!/usr/bin/env cctbx.python
import os
from app import create_app, db
from app.models import Job, Residue, Angle
from flask.ext.script import Manager, Shell
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.markdown import Markdown

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app,db)
markdown = Markdown(app)

def make_shell_context():
	return dict(app=app,db=db,Residue=Residue, Angle=Angle)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command("db", MigrateCommand)

if __name__=='__main__':
	manager.run()
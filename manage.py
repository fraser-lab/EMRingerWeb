import os
from emringerweb.app import create_app
# from emringerweb.models import Job, Residue, Angle
from flask.ext.script import Manager, Shell


app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)




# from  flask_debugtoolbar import DebugToolbarExtension
# toolbar = DebugToolbarExtension(app)

def make_shell_context():
	return dict(app=app)#,Residue=Residue, Angle=Angle)

manager.add_command("shell", Shell(make_context=make_shell_context))

if __name__=='__main__':
	manager.run()
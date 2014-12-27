from flask.ext.uploads import UploadSet
from flask.ext.wtf import Form
from wtforms.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, SubmitField
from wtforms.validators import Required, Optional, Email
model = UploadSet()


class JobForm(Form):
	model = FileField('PDB Model', validators=[FileAllowed(pdb_type, "EMRinger doesn't recognize these files. Try using a pdb or ent file", FileRequired()])
	map = FileField('CCP4 Map', validators=[FileRequired()])
	email = StringField('Email for Results Link', validators=[Optional(), Email()])
	submit = SubmitField('Send Job')

class EmailForm(Form):
	email = FileField('Email for Results Link', validators=[Required()])
	submit = SubmitField('Send Job')
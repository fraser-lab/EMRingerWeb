from flask.ext.uploads import UploadSet
from flask_wtf import Form
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, SubmitField
from wtforms.validators import Required, Optional, Email

pdb_type = UploadSet('pdbfiles',extensions=('pdb','ent'))
map_type = UploadSet('mapfiles', extensions=('map','ccp4','mrc'))


class JobForm(Form):
	model = FileField('PDB Model', validators=[FileAllowed(pdb_type, "EMRinger doesn't recognize these files. Try using a pdb or ent file"), FileRequired()])
	map = FileField('CCP4 Map', validators=[FileAllowed(map_type, "EMRinger doesn't recognize this file. Please use a CCP4 formatted map."),FileRequired()])
	email = StringField('Email for Results Link', validators=[Optional(), Email()])
	submit = SubmitField('Send Job')

class EmailForm(Form):
	email = FileField('Email for Results Link', validators=[Required()])
	submit = SubmitField('Send Job')
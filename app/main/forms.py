from flask.ext.uploads import UploadSet
from flask.ext.wtf import Form
from wtforms import StringField, FileField, SubmitField
from wtforms.validators import Required, Optional, Email

class JobForm(Form):
	model = FileField('PDB Model', validators=[Required()])
	map = FileField('CCP4 Map', validators=[Required()])
	email = StringField('Email for Results Link', validators=[Optional(), Email()])
	
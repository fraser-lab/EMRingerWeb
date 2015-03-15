from emringerweb.db import db

class Job(db.Model):
	__tablename__ = 'jobs'
	id = db.Column(db.Integer, primary_key=True)
	uid = db.Column(db.String, unique=True, index=True)
	datetime = db.Column(db.DateTime)
	email = db.Column(db.String, nullable=True, index = True)
	map = db.Column(db.String)
	mapfilename = db.Column(db.String, unique=True)
	model = db.Column(db.String)
	modelfilename = db.Column(db.String, unique=True)
	success = db.Column(db.Boolean)
	residues = db.relationship('Residue', backref="job")

	def __repr__(self):
		if self.email:
			return "Job by %s, submitted at %s" % (self.email, self.datetime)
		else:
			return "Job %s without email, submitted at %s" % (self.uid, self.datetime)

class Residue(db.Model):
	__tablename__= 'residues'
	id = db.Column(db.Integer, primary_key=True)
	res_type = db.Column(db.String, index=True)
	res_id = db.Column(db.String, index=True)
	chain_id = db.Column(db.String, index=True)
	peak_angle = db.Column(db.Integer, index=True)
	peak_density = db.Column(db.Float, index=True)
	angles = db.relationship('Angle', backref = 'residue')
	job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), index=True)

	def __repr__(self):
		return "Residue %s %d of chain %s" % (self.res_type, self.res_id, self.chain_id)

class Angle(db.Model):
	__tablename__='angles'
	id = db.Column(db.Integer, primary_key=True)
	angle = db.Column(db.Integer)
	density = db.Column(db.Integer)
	residue_id = db.Column(db.Integer, db.ForeignKey('residues.id'), index=True)
	
	def __repr__(self):
		return "At angle %s, the electron potential density is %s" % (self.angle, self.density)
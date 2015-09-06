# from emringerweb.db import db

# class Job(db.Document):
# 	__tablename__ = 'jobs'
# 	id = db.Column(db.Integer, primary_key=True)
# 	uuid = db.Column(db.String, unique=True, index=True)
# 	datetime = db.Column(db.DateTime)
# 	email = db.Column(db.String, nullable=True, index = True)
# 	map = db.Column(db.String)
# 	mapfilename = db.Column(db.String, unique=True)
# 	model = db.Column(db.String)
# 	modelfilename = db.Column(db.String, unique=True)
# 	success = db.Column(db.Boolean)
# 	# aa_groups = db.relationship('AA_Group', backref="job")
# 	residues = db.relationship('Residue', backref="job")


# 	def __repr__(self):
# 		if self.email:
# 			return "Job by %s, submitted at %s" % (self.email, self.datetime)
# 		else:
# 			return "Job %s without email, submitted at %s" % (self.uuid, self.datetime)


# # class AA_Group(db.Model):
# # 	__tablename__='aa_groups'
# # 	resname = db.Column(db.String, index=True)
# # 	total_size = db.Column(db.Integer)
# # 	job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), index=True)

# class Residue(db.Model):
# 	__tablename__= 'residues'
# 	id = db.Column(db.Integer, primary_key=True)
# 	res_type = db.Column(db.String, index=True)
# 	res_id = db.Column(db.String, index=True)
# 	chain_id = db.Column(db.String, index=True)
# 	peak_angle = db.Column(db.Integer, index=True)
# 	peak_density = db.Column(db.Float, index=True)
# 	angles = db.relationship('Angle', backref = 'residue')
# 	job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), index=True)

# 	def __repr__(self):
# 		return "Residue %s %d of chain %s" % (self.res_type, self.res_id, self.chain_id)


# class Count(db.Model):
# 	__tablename__='counts'
# 	id = db.Column(db.Integer, primary_key=True)
# 	chi_angle = db.Column(db.Integer)
# 	count = db.Column(db.Integer)
# 	residue_id=db.Column(db.Integer, db.ForeignKey('residues.id'), index=True)




# class Angle(db.Model):
# 	__tablename__='angles'
# 	id = db.Column(db.Integer, primary_key=True)
# 	angle = db.Column(db.Integer)
# 	density = db.Column(db.Float)
# 	residue_id = db.Column(db.Integer, db.ForeignKey('residues.id'), index=True)
	
# 	def __repr__(self):
# 		return "At angle %s, the electron potential density is %s" % (self.angle, self.density)
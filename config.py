import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
	SECRET_KEY = os.environ.get('SECRET_KEY')
	SQLALCHEMY_COMMIT_ON_TEARDOWN = True
	EMRINGER_MAIL_SUBJECT_PREFIX = '[EMRinger]'
	EMRINGER_MAIL_SENDER = 'EMRinger Server <donotreply@emringer.com>'
	EMRINGER_ADMIN = os.environ.get('EMRINGER_ADMIN')
	ALLOWED_EXTENSIONS={'MAP':set(['ccp4','map','mrc']),'PDB':set(['pdb','ent'])}
	IGNORED_FILES = set(['.gitignore'])
	MEDIA_ROOT = os.path.join(basedir, 'data')
	UPLOAD_DIRECTORY = os.path.join(MEDIA_ROOT, 'upload')
	CHUNKS_DIRECTORY = os.path.join(MEDIA_ROOT, 'chunks')

	@staticmethod
	def init_app(app):
		pass

class DevelopmentConfig(Config):
	DEBUG = True
	MAIL_SERVER = 'smtp.googlemail.com'
	MAIL_PORT = 587
	MAIL_USE_TLS = True
	MAIL_USERNAME = os.environ.get('GMAIL_USER')
	MAIL_PASSWORD = os.environ.get('GMAIL_PASSWORD')
	UPLOAD_FOLDER = os.path.join(basedir,'data_dev/')
	SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
		'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')
	MAX_CONTENT_LENGTH = 2000 * 1024 * 1024 


class TestingConfig(Config):
 	TESTING = True
 	UPLOAD_FOLDER = os.path.join(basedir,'data_test/')
 	SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
 		'sqlite:///' + os.path.join(basedir, 'data-test.sqlite')
	MAX_CONTENT_LENGTH = 200 * 1024 * 1024


class ProductionConfig(Config):
	UPLOAD_FOLDER = os.environ.get('EMRINGER_UPLOAD_FOLDER') or os.path.join(basedir,'data/')
 	SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
 		'sqlite:///' + os.path.join(basedir, 'data.sqlite')
 	MAX_CONTENT_LENGTH = 200 * 1024 * 1024


config = {
	'development': DevelopmentConfig,
 	'testing': TestingConfig,
 	'production': ProductionConfig,
 	'default': DevelopmentConfig
}
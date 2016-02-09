import os
from datetime import timedelta
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
	SECRET_KEY = os.environ.get('SECRET_KEY')
	ALLOWED_EXTENSIONS={'MAP':set(['ccp4','map','mrc']),'PDB':set(['pdb','ent'])}
	IGNORED_FILES = set(['.gitignore'])
	MEDIA_ROOT = os.path.join(basedir, 'data')
	UPLOAD_DIRECTORY = os.path.join(MEDIA_ROOT, 'upload')
	CHUNKS_DIRECTORY = os.path.join(MEDIA_ROOT, 'chunks')
	# Celery settings
	CELERY_BROKER_URL = 'redis://localhost:6379/0'
	CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
	CELERY_TASK_RESULT_EXPIRES = timedelta(days=7)
	# FLASK MAIL
	EMRINGER_MAIL_SUBJECT_PREFIX = '[EMRinger]'
	MAIL_DEFAULT_SENDER = 'EMRinger Web Server <emringer@fraserlab.com>'
	ADMINS = ['emringer@fraserlab.com']
	MAIL_SERVER='smtp.gmail.com'
	MAIL_PORT=587
	MAIL_USE_SSL=False
	MAIL_USE_TLS=True
	MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
	MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")

	LOG_LOCATION = "logs/app.log"

	@staticmethod
	def init_app(app):
		pass

class DevelopmentConfig(Config):
	DEBUG = True
	SERVER_NAME = "emringer.ngrok.com"
	MAX_CONTENT_LENGTH = 2000 * 1024 * 1024 


class TestingConfig(Config):
 	TESTING = True
 	UPLOAD_FOLDER = os.path.join(basedir,'data_test/')
	MAX_CONTENT_LENGTH = 200 * 1024 * 1024


class ProductionConfig(Config):
	SERVER_NAME = "emringer.ngrok.com"
	UPLOAD_FOLDER = os.environ.get('EMRINGER_UPLOAD_FOLDER') or os.path.join(basedir,'data/')
 	MAX_CONTENT_LENGTH = 200 * 1024 * 1024


config = {
	'development': DevelopmentConfig,
 	'testing': TestingConfig,
 	'production': ProductionConfig,
 	'default': DevelopmentConfig
}

import logging
from logging import Formatter
from logging.handlers import SMTPHandler, RotatingFileHandler

from celery import Celery
from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask.ext.mail import Mail
from flask.ext.markdown import Markdown
from flask.ext.moment import Moment

from emringerweb.config import config
from emringerweb.main import main_blueprint

bootstrap = Bootstrap()
mail = Mail()
moment = Moment()

def create_app(config_name):

    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    bootstrap.init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    markdown = Markdown(app)
    app.register_blueprint(main_blueprint)

    # Mail me if there is an error in the app.
    mail_handler = SMTPHandler((app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
                                app.config['MAIL_DEFAULT_SENDER'],
                                app.config['ADMINS'], 
                                'EMRinger Job Failed', 
                                credentials=(app.config['MAIL_USERNAME'], 
                                            app.config['MAIL_PASSWORD']),
                                secure=())
    mail_handler.setFormatter(Formatter('''
                                Message type:       %(levelname)s
                                Location:           %(pathname)s:%(lineno)d
                                Module:             %(module)s
                                Function:           %(funcName)s
                                Time:               %(asctime)s

                                Message:

                                %(message)s
                                '''))
    mail_handler.setLevel(logging.ERROR)
    app.logger.addHandler(mail_handler)

    # Log all warnings to a file.
    file_handler = RotatingFileHandler(app.config['LOG_LOCATION'], 
                                        maxBytes=10*1024, backupCount=5)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
    ))
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)

    return app


def make_celery_app(app=None):
    app = app or create_app("default")
    celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery

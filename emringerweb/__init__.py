
from emringerweb.config import config
from emringerweb.main import main_blueprint


# def hello_world():
#     print 'hello world'


# def create_app(config_name):
# 	bootstrap = Bootstrap()
# 	mail = Mail()
# 	moment = Moment()
# 	app = Flask(__name__)
# 	app.config.from_object(config[config_name])
# 	config[config_name].init_app(app)

# 	bootstrap.init_app(app)
# 	mail.init_app(app)
# 	moment.init_app(app)
# 	db.init_app(app)

# 	app.register_blueprint(main_blueprint)

# 	return app


# def create_celery_app(app=None):
#     app = app or create_app("default")
#     celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
#     celery.conf.update(app.config)
#     TaskBase = celery.Task

#     class ContextTask(TaskBase):
#         abstract = True

#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return TaskBase.__call__(self, *args, **kwargs)

#     celery.Task = ContextTask
#     return celery


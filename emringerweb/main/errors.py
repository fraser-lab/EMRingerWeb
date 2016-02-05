from flask import render_template, current_app

from emringerweb.main import main_blueprint


@main_blueprint.app_errorhandler(404)
def page_not_found(e):
  current_app.logger.info("404 page encountered")
  return render_template('404.html'), 404

@main_blueprint.app_errorhandler(410)
def page_not_found(e):
  current_app.logger.info("410 page encountered")
  return render_template('410.html'), 410

@main_blueprint.app_errorhandler(500)
def internal_error(e):
  current_app.logger.info("500 page encountered")
  return render_template('500.html'), 500

from flask import render_template

from emringerweb.main import main_blueprint


@main_blueprint.app_errorhandler(404)
def page_not_found(e):
	return render_template('404.html'), 404

@main_blueprint.app_errorhandler(500)
def internal_error(e):
	return render_template('500.html'), 500
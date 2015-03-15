from flask import render_template

from emringerweb.main import main_blueprint

# The permanent pages, like contact...

@main_blueprint.route('/about')
def about():
	# """The general about page for EMRingerWeb"""
	return render_template('markdown.html', markdown_content='about.md')

@main_blueprint.route('/contact')
def contact():
	# """The contact page for EMRingerWeb"""
	return render_template('markdown.html', markdown_content='contact.md')


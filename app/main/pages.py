from . import main
from flask import render_template
# The permanent pages, like contact...

@main.route('/about')
def about():
	# """The general about page for EMRingerWeb"""
	return render_template('markdown.html', markdown_content='about.md')

@main.route('/contact')
def contact():
	# """The contact page for EMRingerWeb"""
	return render_template('markdown.html', markdown_content='contact.md')


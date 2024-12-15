# routes/user_routes.py
from flask import Blueprint, request, current_app, render_template
from controller.user_controller import UserController

user_bp = Blueprint('user_bp', __name__)

@user_bp.before_app_request
def before_request():
    global user_controller
    user_controller = UserController(current_app)

@user_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    return user_controller.create_user(data)

@user_bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    return user_controller.login(data)

@user_bp.route('/logout', methods=['POST'])
def logout():
    return user_controller.logout()
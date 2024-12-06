from flask import Blueprint, request, current_app
from controller.log_controller import LogController
log_bp = Blueprint('log_bp', __name__)
@log_bp.before_app_request
def before_request():
    global log_controller
    log_controller = LogController(current_app)

@log_bp.route('/log/save', methods=['POST'])
def save_log():
    data = request.get_json()
    return log_controller.save_log(data)
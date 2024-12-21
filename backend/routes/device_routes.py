# routes/device_routes.py
from flask import request, jsonify, Blueprint, current_app
from flask_login import login_required
from controller.device_controller import DeviceController

device_bp = Blueprint('device_bp', __name__)

@device_bp.before_app_request
def before_request():
    global device_controller
    device_controller = DeviceController(current_app)

@device_bp.route('/device/<int:device_id>/logs', methods=['GET'])
# @login_required
def get_device_logs(device_id):
    logs = device_controller.get_device_logs(device_id)
    return logs, 200, {'Content-Type': 'application/json'}

@device_bp.route('/devices', methods=['GET'])
@login_required
def get_devices():
    return device_controller.get_devices()

@device_bp.route('/devices', methods=['POST'])
@login_required
def add_device():
    data = request.get_json()
    return device_controller.add_device(data)
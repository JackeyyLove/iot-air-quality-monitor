# routes/subscription_routes.py
from flask import Blueprint, request, current_app
from flask_login import login_required, current_user
from controller.subscription_controller import SubscriptionController
from flask_cors import CORS

subscription_bp = Blueprint('subscription_bp', __name__)
CORS(subscription_bp, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

@subscription_bp.before_app_request
def before_request():
    global subscription_controller
    subscription_controller = SubscriptionController(current_app)

@subscription_bp.route('/subscriptions', methods=['GET'])
@login_required
def get_subscriptions():
    return subscription_controller.get_subscriptions(current_user.id)

@subscription_bp.route('/subscriptions', methods=['POST'])
@login_required
def add_subscription():
    data = request.get_json()
    return subscription_controller.add_subscription(current_user.id, data['device_id'])

@subscription_bp.route('/subscriptions', methods=['DELETE'])
@login_required
def delete_subscription():
    data = request.get_json()
    return subscription_controller.delete_subscription(current_user.id, data['device_id'])
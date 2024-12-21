# controller/subscription_controller.py
from flask_pymongo import PyMongo
from flask import jsonify
from bson.objectid import ObjectId

class SubscriptionController:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def get_subscriptions(self, user_id):
        subscriptions = list(self.mongo.db.subscriptions.find({'user_id': user_id}))
        device_ids = [sub['device_id'] for sub in subscriptions]
        devices_cursor = self.mongo.db.devices.find({'device_id': {'$in': [str(did) for did in device_ids]}})
        
        serialized_devices = []
        for device in devices_cursor:
            device['_id'] = str(device['_id']) 
            serialized_devices.append(device)
        
        return jsonify(serialized_devices)

    def add_subscription(self, user_id, device_id):
        subscription = {
            "user_id": user_id,
            "device_id": device_id
        }
        self.mongo.db.subscriptions.insert_one(subscription)
        return jsonify({"message": "Subscription added successfully"}), 201

    def delete_subscription(self, user_id, device_id):
        self.mongo.db.subscriptions.delete_one({"user_id": user_id, "device_id": device_id})
        return jsonify({"message": "Subscription deleted successfully"}), 200
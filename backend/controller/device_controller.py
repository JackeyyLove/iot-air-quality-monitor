from flask_pymongo import PyMongo
from flask import jsonify
from bson.json_util import dumps

class DeviceController: 
    def __init__(self, app):
        self.mongo = PyMongo(app)
        self.app = app
    def get_device_logs(self, device_id):
        logs = self.mongo.db.logs.find({'device_id': device_id}).sort('senttime', -1).limit(20)
        return dumps(logs)
    def get_devices(self):
        devices = self.mongo.db.devices.find()
        return dumps(devices)

    def add_device(self, device_data):
        self.mongo.db.devices.insert_one(device_data)
        return jsonify({"message": "Device added successfully"}), 201
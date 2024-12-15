from flask_pymongo import PyMongo
from flask import jsonify
from bson.json_util import dumps

class DeviceController: 
    def __init__(self, app):
        self.mongo = PyMongo(app)
        self.app = app
    def get_device_logs(self, device_id):
        logs = self.mongo.db.logs.find({'device_id': device_id}).sort('timestamp', -1).limit(20)
        return dumps(logs)
    
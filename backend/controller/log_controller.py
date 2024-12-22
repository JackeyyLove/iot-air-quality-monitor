# controller/log_controller.py
from flask_pymongo import PyMongo
from flask import jsonify
from datetime import datetime

class LogController:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def save_log(self, data):
        log = {
            "device_id": float(data["device_id"]),
            "temperature": float(data["temperature"]),
            "humidity": float(data["humidity"]),
            "co": float(data["ppm"]["co"]),
            "co2": float(data["ppm"]["co2"]),
            "nh3": float(data["ppm"]["nh3"]),
            "pm25": float(data["ppm"]["pm25"]),
            "senttime": datetime.now().isoformat()
        }
        self.mongo.db.logs.insert_one(log)
        return jsonify({"message": "Log saved successfully"}), 201
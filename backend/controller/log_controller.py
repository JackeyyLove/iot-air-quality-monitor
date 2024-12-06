# controller/log_controller.py
from flask_pymongo import PyMongo
from flask import jsonify

class LogController:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def save_log(self, data):
        log = {
            "device_id": data["device_id"],
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "co": data["ppm"]["co"],
            "co2": data["ppm"]["co2"],
            "nh3": data["ppm"]["nh3"],
            "pm25": data["ppm"]["pm25"],
            "pm10": data["ppm"]["pm10"],
            "senttime": data["senttime"]
        }
        self.mongo.db.logs.insert_one(log)
        return jsonify({"message": "Log saved successfully"}), 201
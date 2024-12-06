# app/services/mqtt_service.py
import paho.mqtt.client as paho
import json
from flask import current_app
from controller.log_controller import LogController

mqtt_client = paho.Client()

def message_handling(client, userdata, msg):
    try:
        log_data = json.loads(msg.payload.decode())
        with current_app.app_context():
            log_controller = LogController(current_app)
            log_controller.save_log(log_data)
        print(f"Message received on topic {msg.topic}: {log_data}")
    except Exception as e:
        print(f"Error processing message: {e}")
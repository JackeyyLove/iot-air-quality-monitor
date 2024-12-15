import sys
import time
import paho.mqtt.client as paho
import json
import random
from datetime import datetime

client = paho.Client()

if client.connect("localhost", 1883, 60) != 0:
    print("Couldn't connect to the mqtt broker")
    sys.exit(1)

count = 0
while count != 50:
    message = {
        "device_id": 20,
        "temperature": round(random.uniform(20.0, 30.0), 2),
        "humidity": round(random.uniform(30.0, 70.0), 2),
        "ppm": {
            "co": round(random.uniform(0.0, 10.0), 2),
            "co2": round(random.uniform(300.0, 500.0), 2),
            "nh3": round(random.uniform(0.0, 5.0), 2),
            "pm25": round(random.uniform(0.0, 50.0), 2),
            "pm10": round(random.uniform(0.0, 100.0), 2)
        },
        "senttime": datetime.now().isoformat()
    }
    client.publish("test_topic", json.dumps(message), 0)
    time.sleep(5)
    count += 1

client.disconnect()
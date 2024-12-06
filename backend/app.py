from flask import Flask, session
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from routes.user_routes import user_bp
from services.mqtt_service import mqtt_client, message_handling
import threading

# Initialize the app
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://admin:pass@localhost:27017/airDB?authSource=admin"
app.config["SECRET_KEY"] = "secret"  # secret key for session management
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

# Register blueprints
app.register_blueprint(user_bp)

# MQTT Client
mqtt_client.on_message = message_handling
if mqtt_client.connect("localhost", 1883, 60) != 0:
    print("Couldn't connect to the mqtt broker")
    sys.exit(1)

mqtt_client.subscribe("test_topic")

def run_mqtt():
    with app.app_context():
        try:
            print("Press CTRL+C to exit MQTT client...")
            mqtt_client.loop_forever()
        except Exception as e:
            print(f"Caught an Exception, something went wrong: {e}")
        finally:
            print("Disconnecting from the MQTT broker")
            mqtt_client.disconnect()

# Run the server
if __name__ == '__main__':
    mqtt_thread = threading.Thread(target=run_mqtt)
    mqtt_thread.start()
    
    app.run(debug=True)
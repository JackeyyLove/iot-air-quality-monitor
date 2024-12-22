from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin
import threading
from services.mqtt_service import mqtt_client, message_handling
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

mongo = PyMongo()
bcrypt = Bcrypt()
login_manager = LoginManager()

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id):
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            return User(str(user['_id']))
    except Exception:
        return None
    return None

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = "mongodb://admin:pass@localhost:27017/airDB?authSource=admin"
    app.config["SECRET_KEY"] = "secret"  # secret key for session management

    mongo.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'user_bp.signin'

    # Thêm CORS vào đây
    # CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})
    CORS(app, 
         resources={r"/*": {"origins": ["http://127.0.0.1:5500"]}}, 
         supports_credentials=True,  # Để xử lý cookie/session
         expose_headers=["Content-Type", "X-CSRFToken"], 
         always_send=True  # Đảm bảo gửi CORS header mọi lúc
    )

    # Custom handler for unauthorized access
    @login_manager.unauthorized_handler
    def unauthorized():
        response = jsonify({"error": "Unauthorized access. Please log in."})
        response.status_code = 401
        return response

    from routes.user_routes import user_bp
    from routes.device_routes import device_bp
    from routes.log_routes import log_bp
    from routes.subscription_routes import subscription_bp
    app.register_blueprint(user_bp)
    app.register_blueprint(device_bp)
    app.register_blueprint(log_bp)
    app.register_blueprint(subscription_bp)
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

    mqtt_thread = threading.Thread(target=run_mqtt)
    mqtt_thread.start()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

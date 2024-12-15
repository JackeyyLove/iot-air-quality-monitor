# controller/user_controller.py
from flask import jsonify
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from flask_login import UserMixin, login_user, logout_user
from app import mongo, bcrypt

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

class UserController:
    def __init__(self, app):
        self.bcrypt = Bcrypt(app)
        self.mongo = PyMongo(app)

    def create_user(self, data):
        hashed_password = self.bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = {
            "username": data['username'],
            "password": hashed_password,
            "type": data['type']
        }
        user_id = self.mongo.db.users.insert_one(user).inserted_id
        return jsonify({"message": "User created", "user": str(user_id)}), 201

    def login(self, data):
        user = self.mongo.db.users.find_one({"username": data['username']})
        if user and self.bcrypt.check_password_hash(user['password'], data['password']):
            user_obj = User(str(user['_id']))
            login_user(user_obj, remember=True)
            return jsonify({"message": "Login successful"}), 200
        return jsonify({"message": "Invalid username or password"}), 401

    def logout(self):
        logout_user()
        return jsonify({"message": "Logout successful"}), 200
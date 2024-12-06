# controller/user_controller.py
from flask import jsonify, session
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo

class UserController:
    def __init__(self, app):
        self.bcrypt = Bcrypt(app)
        self.mongo = PyMongo(app)

    def serialize_doc(self, doc):
        doc['_id'] = str(doc['_id'])
        return doc

    def create_user(self, data):
        hashed_password = self.bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = {
            "username": data['username'],
            "password": hashed_password,
            "type": data['type']
        }
        user_id = self.mongo.db.users.insert_one(user).inserted_id
        return jsonify({"message": "User created", "user": self.serialize_doc(self.mongo.db.users.find_one({"_id": user_id}))}), 201

    def login(self, data):
        user = self.mongo.db.users.find_one({"username": data['username']})
        if user and self.bcrypt.check_password_hash(user['password'], data['password']):
            session['user_id'] = str(user['_id'])
            return jsonify({"message": "Login successful"}), 200
        return jsonify({"message": "Invalid username or password"}), 401

    def logout(self):
        session.pop('user_id', None)
        return jsonify({"message": "Logout successful"}), 200
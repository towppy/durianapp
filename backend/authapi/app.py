from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import signup_user, login_user, hash_password  # <-- need hash_password for updating password
from db import users_collection
from bson.objectid import ObjectId
import datetime

app = Flask(__name__)
CORS(app)  # allow requests from React Native

# ---------------------------
# Signup endpoint
# ---------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    required_fields = ["name", "email", "password", "confirm_password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing fields"}), 400
    
    result = signup_user(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        confirm_password=data["confirm_password"]
    )
    status_code = 200 if "success" in result else 400
    return jsonify(result), status_code

# ---------------------------
# Login endpoint
# ---------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    required_fields = ["email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing fields"}), 400
    
    result = login_user(
        email=data["email"],
        password=data["password"]
    )
    status_code = 200 if "success" in result else 401
    return jsonify(result), status_code

# ---------------------------
# GET profile
@app.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"error": "User not found"}, 404
        return {
            "name": user["name"],
            "email": user["email"],
            "photoUri": user.get("photoProfile", "https://via.placeholder.com/120")
        }
    except Exception as e:
        return {"error": str(e)}, 500

# ---------------------------
# UPDATE profile
@app.route("/profile/<user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.json
    try:
        update_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "photoProfile": data.get("photoUri")
        }
        if data.get("password"):
            update_data["password"] = hash_password(data["password"])

        users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        return {"success": True}
    except Exception as e:
        return {"error": str(e)}, 500

# ---------------------------
# Test endpoint
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Auth API is running!"})

# ---------------------------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import signup_user, login_user

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
# Test endpoint
# ---------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Auth API is running!"})

# ---------------------------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


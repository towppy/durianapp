# backend/authapi/auth.py

from db import users_collection
from passlib.context import CryptContext
from jose import jwt
import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ---------------------------
# JWT config
# ---------------------------
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")  # put your own in .env
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 24))

# ---------------------------
# Password hashing with Argon2 (with bcrypt fallback)
# ---------------------------
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto"
)

# ---------------------------
# Helper functions
# ---------------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(password, hashed)
    except Exception as e:
        print(f"Password verification error: {e}")
        # Fallback: direct comparison for plain text (temporary debug)
        return password == hashed

# ---------------------------
# Signup
# ---------------------------
def signup_user(name: str, email: str, password: str, confirm_password: str):
    if password != confirm_password:
        return {"error": "Passwords do not match"}
    
    if users_collection.find_one({"email": email}):
        return {"error": "User already exists"}
    
    hashed = hash_password(password)
    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed,
        "createdAt": datetime.datetime.utcnow()
    })
    return {"success": True, "message": "User registered successfully"}

# ---------------------------
# Login
# ---------------------------
def login_user(email: str, password: str):
    user = users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return {"error": "Invalid credentials"}
    
    # Generate JWT token
    payload = {
        "sub": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {
        "success": True,
        "token": token,
        "user": {"name": user["name"], "email": user["email"]}
    }

# backend/authapi/auth.py

from db import users_collection
from passlib.context import CryptContext
from jose import jwt
import datetime
from bson.objectid import ObjectId

# Password hashing
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# JWT config
JWT_SECRET = "supersecretkey"  # replace with .env
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# ---------------------------
# Helper functions
# ---------------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(password, hashed)
    except:
        return password == hashed

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
        "isLoggedIn": False,
        "photoProfile": "https://via.placeholder.com/120",
        "createdAt": datetime.datetime.utcnow()
    })
    return {"success": True, "message": "User registered successfully"}

def login_user(email: str, password: str):
    user = users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return {"error": "Invalid credentials"}

    # Set isLoggedIn True
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"isLoggedIn": True, "lastLogin": datetime.datetime.utcnow()}}
    )

    # JWT payload
    payload = {
        "sub": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return {
        "success": True,
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "photoProfile": user.get("photoProfile", "https://via.placeholder.com/120")
        }
    }

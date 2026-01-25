from dotenv import load_dotenv
import os
from pymongo import MongoClient
from datetime import datetime

# Load .env
load_dotenv()

# ---------------------------
# MongoDB setup
# ---------------------------
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["durianapp"]
users_collection = db["users"]

# ---------------------------
# JWT config
# ---------------------------
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 24))

# ---------------------------
# Helper functions
# ---------------------------

def set_logged_in(user_id: str, is_logged_in: bool):
    """Update the user's login status."""
    users_collection.update_one(
        {"_id": user_id},
        {"$set": {"isLoggedIn": is_logged_in, "lastLogin": datetime.utcnow()}},
        upsert=False
    )

def update_photo_profile(user_id: str, photo_url: str):
    """Update the user's profile photo."""
    users_collection.update_one(
        {"_id": user_id},
        {"$set": {"photoProfile": photo_url}},
        upsert=False
    )

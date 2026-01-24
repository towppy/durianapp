from db import users_collection

# Delete all users to start fresh
result = users_collection.delete_many({})
print(f"Deleted {result.deleted_count} users")
print("Database is now ready for fresh signups with proper password hashing!")

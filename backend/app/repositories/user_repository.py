from app.database.mongo_client import mongo_db
from app.models.user_model import UserInDB

class UserRepository:
    def __init__(self):
        self.collection = mongo_db.get_collection("usuarios")

    def get_user_by_username(self, username: str) -> dict:
        return self.collection.find_one({"username": username})

    def create_user(self, user_data: dict):
        # Verifica si existe antes de crearlo
        if not self.get_user_by_username(user_data["username"]):
            self.collection.insert_one(user_data)
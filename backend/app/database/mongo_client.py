from pymongo import MongoClient
import os

class MongoDBConnection:
    _instance = None

    def __new__(cls):

        if cls._instance is None:
            cls._instance = super(MongoDBConnection, cls).__new__(cls)
            mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
            cls._instance.client = MongoClient(mongo_uri)
            cls._instance.db = cls._instance.client["db_siniestralidad_vial"]
            print(" [Singleton] Conexión establecida con MongoDB.")
        return cls._instance

    def get_collection(self, collection_name: str):
        return self.db[collection_name]


mongo_db = MongoDBConnection()
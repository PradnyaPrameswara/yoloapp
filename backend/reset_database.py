"""
Database setup and migration script
Recreates the database tables based on the current models
"""
import os
import sys
import pymysql

from database import engine, Base
from models.user import User
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_database():
    try:
        # Drop all tables
        Base.metadata.drop_all(bind=engine)
        logger.info("Dropped all existing tables")
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Created all tables")
        
        print("Database reset successful!")
        return True
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        return False

if __name__ == "__main__":
    reset_database()

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base
from passlib.context import CryptContext
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    @classmethod
    def get_by_username(cls, db, username):
        try:
            return db.query(cls).filter(cls.username == username).first()
        except Exception as e:
            logger.error(f"Error getting user by username: {e}")
            return None
    
    @classmethod
    def get_by_email(cls, db, email):
        try:
            return db.query(cls).filter(cls.email == email).first()
        except Exception as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    @classmethod
    def create(cls, db, username, email, password):
        try:
            # Hash the password
            hashed_password = pwd_context.hash(password)
            
            # Create a new user object
            user = cls(username=username, email=email, password=hashed_password)
            
            # Add and commit the user to the database
            db.add(user)
            db.commit()
            db.refresh(user)
            
            logger.info(f"User created successfully: {username}")
            return user
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating user: {e}")
            raise
    
    @staticmethod
    def verify_password(plain_password, hashed_password):
        try:
            # Log info for debugging
            print(f"Verifying password (length: {len(plain_password)})")
            print(f"Stored hash: {hashed_password[:10]}...")
            
            # Verify the password
            result = pwd_context.verify(plain_password, hashed_password)
            
            # Log result
            print(f"Password verification result: {result}")
            return result
        except Exception as e:
            logger.error(f"Error verifying password: {e}")
            print(f"Password verification error: {str(e)}")
            return False

import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_database():
    try:
        # Connect to MySQL server (without specifying a database)
        connection = pymysql.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("Connected to MySQL server successfully!")
        
        with connection.cursor() as cursor:
            # Create database if it doesn't exist
            cursor.execute("CREATE DATABASE IF NOT EXISTS yolo_web")
            print("Database 'yolo_web' created or already exists")
            
            # Use the database
            cursor.execute("USE yolo_web")
            
            # Create users table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)
            print("Table 'users' created or already exists")
            
        # Commit changes
        connection.commit()
        print("Database setup completed successfully!")
        
    except Exception as e:
        print(f"Error setting up database: {e}")
    
    finally:
        if connection:
            connection.close()
            print("Database connection closed")

if __name__ == "__main__":
    setup_database()

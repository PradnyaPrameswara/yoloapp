"""
Test script to verify login functionality directly
"""
import requests
import json

# Test credentials from the MySQL database
TEST_USERNAME = "gunxame"  # Use a username that exists in your database
TEST_PASSWORD = "password123"  # Replace with the actual password

def test_login():
    print(f"Testing login with username: {TEST_USERNAME}")
    
    # Prepare login data
    login_data = {
        "username": TEST_USERNAME,
        "password": TEST_PASSWORD
    }
    
    # Convert to form data for OAuth2
    form_data = {
        "username": login_data["username"],
        "password": login_data["password"]
    }
    
    try:
        # Make the request
        response = requests.post(
            "http://localhost:8001/api/auth/login",
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            print("Login successful!")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            return response.json()
        else:
            print("Login failed!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    test_login()

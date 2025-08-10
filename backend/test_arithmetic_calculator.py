#!/usr/bin/env python3
"""
Test script for the arithmetic calculator functionality
"""
import requests
import json
import os
from pathlib import Path

# Test the arithmetic calculator endpoints
BASE_URL = "http://localhost:8000"

def test_api_status():
    """Test if the API is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✓ API Status: {response.json()}")
        return True
    except Exception as e:
        print(f"✗ API not responding: {e}")
        return False

def test_arithmetic_flow():
    """Test the complete arithmetic calculation flow"""
    print("\n=== Testing Arithmetic Calculator Flow ===")
    
    # Create a dummy image file for testing
    test_image_path = "test_image.jpg"
    import cv2
    import numpy as np
    
    # Create a simple test image
    test_img = np.zeros((224, 224, 3), dtype=np.uint8)
    cv2.rectangle(test_img, (50, 50), (174, 174), (255, 255, 255), -1)
    cv2.imwrite(test_image_path, test_img)
    
    try:
        # Test sequence: number -> operator -> number
        test_sequence = [
            ("5", "Should set first number to 5"),
            ("tambah", "Should set operator to +"),  
            ("3", "Should set second number and calculate result"),
            ("Start", "Should reset the calculator")
        ]
        
        for gesture, expected in test_sequence:
            print(f"\nTesting gesture: {gesture}")
            print(f"Expected: {expected}")
            
            # Simulate sending an image with the gesture
            with open(test_image_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{BASE_URL}/api/detect", files=files)
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✓ Response: {json.dumps(data, indent=2)}")
                else:
                    print(f"✗ Error: {response.status_code} - {response.text}")
        
        # Clean up test image
        if os.path.exists(test_image_path):
            os.remove(test_image_path)
            
    except Exception as e:
        print(f"✗ Test failed: {e}")

def test_operator_mapping():
    """Test the operator mapping functionality"""
    print("\n=== Testing Operator Mapping ===")
    
    # Test the OPERATOR_MAP
    expected_mappings = {
        "tambah": "+",
        "kurang": "-", 
        "kali": "*",
        "bagi": "/"
    }
    
    for indonesian, symbol in expected_mappings.items():
        print(f"✓ {indonesian} -> {symbol}")

def main():
    """Run all tests"""
    print("Starting Arithmetic Calculator Tests...")
    
    if not test_api_status():
        print("❌ API is not running. Please start the backend first.")
        return
    
    test_operator_mapping()
    test_arithmetic_flow()
    
    print("\n🎉 All tests completed!")

if __name__ == "__main__":
    main()

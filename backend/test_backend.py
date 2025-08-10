#!/usr/bin/env python3
"""
Test script to debug backend issues
"""
import os
import sys
import logging
import numpy as np
import cv2

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_imports():
    """Test if all required packages can be imported"""
    logger.info("Testing imports...")
    
    try:
        import fastapi
        logger.info("✓ FastAPI imported successfully")
    except ImportError as e:
        logger.error(f"✗ FastAPI import failed: {e}")
        return False
    
    try:
        import ultralytics
        logger.info("✓ Ultralytics imported successfully")
    except ImportError as e:
        logger.error(f"✗ Ultralytics import failed: {e}")
        return False
    
    try:
        import torch
        logger.info(f"✓ PyTorch imported successfully (version: {torch.__version__})")
    except ImportError as e:
        logger.error(f"✗ PyTorch import failed: {e}")
        return False
    
    try:
        import cv2
        logger.info(f"✓ OpenCV imported successfully (version: {cv2.__version__})")
    except ImportError as e:
        logger.error(f"✗ OpenCV import failed: {e}")
        return False
    
    return True

def test_model_loading():
    """Test if the model can be loaded"""
    logger.info("Testing model loading...")
    
    try:
        from ultralytics import YOLO
        
        # Check if model file exists
        model_path = os.path.join(os.path.dirname(__file__), "models", "best.pt")
        if not os.path.exists(model_path):
            logger.error(f"✗ Model file not found: {model_path}")
            return False
        
        logger.info(f"✓ Model file found: {model_path}")
        
        # Try to load the model
        model = YOLO(model_path)
        logger.info("✓ Model loaded successfully")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ Model loading failed: {e}")
        return False

def test_yolo_pose_model():
    """Test the custom YOLOv11PoseModel class"""
    logger.info("Testing YOLOv11PoseModel...")
    
    try:
        from models.yolov11_pose import YOLOv11PoseModel
        
        model_path = os.path.join(os.path.dirname(__file__), "models", "best.pt")
        model = YOLOv11PoseModel(model_path)
        logger.info("✓ YOLOv11PoseModel initialized successfully")
        
        # Create a test image
        test_image = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
        logger.info(f"✓ Created test image with shape: {test_image.shape}")
        
        # Test pose detection
        detections = model.detect_pose(test_image)
        logger.info(f"✓ Pose detection completed, got {len(detections)} detections")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ YOLOv11PoseModel test failed: {e}")
        return False

def test_file_operations():
    """Test file operations"""
    logger.info("Testing file operations...")
    
    try:
        # Test directory creation
        test_dir = "test_uploadedFile"
        if not os.path.exists(test_dir):
            os.makedirs(test_dir)
            logger.info(f"✓ Created test directory: {test_dir}")
        
        # Test image creation and saving
        test_image = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
        test_path = os.path.join(test_dir, "test.jpg")
        cv2.imwrite(test_path, test_image)
        
        if os.path.exists(test_path):
            logger.info(f"✓ Test image saved successfully: {test_path}")
            
            # Test reading the image
            read_image = cv2.imread(test_path)
            if read_image is not None:
                logger.info(f"✓ Test image read successfully, shape: {read_image.shape}")
            else:
                logger.error("✗ Failed to read test image")
                return False
        else:
            logger.error(f"✗ Failed to save test image: {test_path}")
            return False
        
        # Clean up
        os.remove(test_path)
        os.rmdir(test_dir)
        logger.info("✓ Cleaned up test files")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ File operations test failed: {e}")
        return False

def main():
    """Run all tests"""
    logger.info("Starting backend tests...")
    
    tests = [
        ("Import Test", test_imports),
        ("Model Loading Test", test_model_loading),
        ("YOLOv11PoseModel Test", test_yolo_pose_model),
        ("File Operations Test", test_file_operations),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        logger.info(f"\n{'='*50}")
        logger.info(f"Running: {test_name}")
        logger.info(f"{'='*50}")
        
        try:
            if test_func():
                logger.info(f"✓ {test_name} PASSED")
                passed += 1
            else:
                logger.error(f"✗ {test_name} FAILED")
        except Exception as e:
            logger.error(f"✗ {test_name} FAILED with exception: {e}")
    
    logger.info(f"\n{'='*50}")
    logger.info(f"Test Results: {passed}/{total} tests passed")
    logger.info(f"{'='*50}")
    
    if passed == total:
        logger.info("🎉 All tests passed! Backend should work correctly.")
    else:
        logger.error("❌ Some tests failed. Please check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 
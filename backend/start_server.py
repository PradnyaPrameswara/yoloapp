#!/usr/bin/env python3
"""
Startup script for the FastAPI backend server
"""
import os
import sys
import logging
import uvicorn
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('backend.log')
    ]
)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed"""
    # Map package names to their import names
    required_packages = {
        'fastapi': 'fastapi',
        'uvicorn': 'uvicorn',
        'ultralytics': 'ultralytics',
        'torch': 'torch',
        'opencv-python': 'cv2',
        'numpy': 'numpy',
        'python-multipart': 'multipart'
    }
    
    missing_packages = []
    
    for package_name, import_name in required_packages.items():
        try:
            __import__(import_name)
            logger.info(f"✓ {package_name} is installed")
        except ImportError:
            missing_packages.append(package_name)
            logger.error(f"✗ {package_name} is missing")
    
    if missing_packages:
        logger.error(f"Missing packages: {', '.join(missing_packages)}")
        logger.error("Please install missing packages with: pip install -r requirements.txt")
        return False
    
    return True

def check_model_file():
    """Check if the model file exists"""
    model_path = Path(__file__).parent / "models" / "best.pt"
    
    if not model_path.exists():
        logger.error(f"Model file not found: {model_path}")
        logger.error("Please ensure the model file 'best.pt' is in the models/ directory")
        return False
    
    logger.info(f"✓ Model file found: {model_path}")
    return True

def main():
    """Main startup function"""
    logger.info("Starting FastAPI backend server...")
    
    # Check dependencies
    if not check_dependencies():
        logger.error("Dependency check failed. Exiting.")
        sys.exit(1)
    
    # Check model file
    if not check_model_file():
        logger.error("Model file check failed. Exiting.")
        sys.exit(1)
    
    # Create upload directory if it doesn't exist
    upload_dir = Path(__file__).parent / "uploadedFile"
    upload_dir.mkdir(exist_ok=True)
    logger.info(f"✓ Upload directory ready: {upload_dir}")
    
    try:
        # Import and start the FastAPI app
        from app import app
        
        # Changed port from 8000 to 8001
        port = 8001
        
        logger.info("✓ FastAPI app imported successfully")
        logger.info(f"Starting server on http://127.0.0.1:{port}")
        logger.info("Press Ctrl+C to stop the server")
        
        # Start the server with the modified port
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=port,  # Changed from 8000 to 8001
            log_level="info",
            reload=False  # Set to True for development
        )
        
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
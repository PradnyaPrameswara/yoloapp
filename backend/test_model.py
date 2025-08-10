import sys
import os
sys.path.append(os.path.dirname(__file__))

from ultralytics import YOLO
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    model_path = os.path.join("models", "best.pt")
    print(f"Loading model from: {model_path}")
    
    model = YOLO(model_path)
    print(f"Model loaded successfully")
    print(f"Model type: {type(model)}")
    print(f"Model names: {model.names}")
    print(f"Model task: {getattr(model, 'task', 'unknown')}")
    
    # Test with a simple image
    import numpy as np
    import cv2
    
    # Create a test image (black image with white rectangle to simulate a person)
    test_img = np.zeros((640, 640, 3), dtype=np.uint8)
    cv2.rectangle(test_img, (200, 100), (400, 500), (255, 255, 255), -1)
    
    print(f"Running inference on test image...")
    results = model(test_img)
    print(f"Results: {len(results)} detected")
    
    for i, result in enumerate(results):
        print(f"Result {i}:")
        if hasattr(result, 'boxes') and result.boxes is not None:
            print(f"  Boxes: {len(result.boxes)}")
            if hasattr(result.boxes, 'cls'):
                class_ids = result.boxes.cls.cpu().numpy()
                print(f"  Classes: {class_ids}")
        if hasattr(result, 'keypoints') and result.keypoints is not None:
            print(f"  Keypoints: {result.keypoints.shape if hasattr(result.keypoints, 'shape') else 'available'}")
            
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

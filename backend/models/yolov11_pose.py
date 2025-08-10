from ultralytics import YOLO
import cv2
import numpy as np
import logging

logger = logging.getLogger(__name__)

class YOLOv11PoseModel:
    def __init__(self, model_path: str):
        try:
            logger.info(f"Initializing YOLOv11PoseModel with path: {model_path}")
            self.model = YOLO(model_path)
            logger.info("YOLOv11PoseModel initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize YOLOv11PoseModel: {e}")
            raise

    def infer(self, image: np.ndarray):
        try:
            logger.info(f"Running inference on image with shape: {image.shape}")
            # Ultralytics YOLO models accept numpy arrays directly
            results = self.model(image)
            logger.info(f"Inference completed, got {len(results)} results")
            return results
        except Exception as e:
            logger.error(f"Error during inference: {e}")
            raise

    def postprocess(self, results):
        # Extract pose keypoints and bounding boxes, handle empty/None results safely
        detections = []
        if not results:
            logger.warning("No results from inference")
            return detections
            
        try:
            for i, result in enumerate(results):
                logger.info(f"Processing result {i}")
                # Defensive: handle missing boxes/keypoints attributes
                boxes = []
                keypoints = []
                
                if hasattr(result, 'boxes') and result.boxes is not None and hasattr(result.boxes, 'xyxy'):
                    try:
                        boxes = result.boxes.xyxy.cpu().numpy()
                        logger.info(f"Found {len(boxes)} boxes")
                    except Exception as e:
                        logger.warning(f"Error processing boxes: {e}")
                        boxes = []
                        
                if hasattr(result, 'keypoints') and result.keypoints is not None and hasattr(result.keypoints, 'xy'):
                    try:
                        keypoints = result.keypoints.xy.cpu().numpy()
                        logger.info(f"Found {len(keypoints)} keypoints")
                    except Exception as e:
                        logger.warning(f"Error processing keypoints: {e}")
                        keypoints = []
                        
                detections.append({
                    "boxes": boxes.tolist() if len(boxes) > 0 else [],
                    "keypoints": keypoints.tolist() if len(keypoints) > 0 else []
                })
                
            logger.info(f"Postprocessing completed, returning {len(detections)} detections")
            return detections
            
        except Exception as e:
            logger.error(f"Error during postprocessing: {e}")
            return detections

    def detect_pose(self, image: np.ndarray):
        try:
            logger.info("Starting pose detection")
            results = self.infer(image)
            detections = self.postprocess(results)
            logger.info(f"Pose detection completed, found {len(detections)} detections")
            return detections
        except Exception as e:
            logger.error(f"Error in detect_pose: {e}")
            raise

# Example usage:
# model = YOLOv11PoseModel('path/to/yolov11_pose.pt')
# image = cv2.imread('path/to/image.jpg')
# detections = model.detect_pose(image)
from fastapi import APIRouter, UploadFile, File
from collections import defaultdict
import cv2
import numpy as np
from ultralytics import YOLO
import time

# --- Setup ---
router = APIRouter()

# 1. Load your trained YOLOv11 model
# Make sure the path to your model is correct
try:
    model = YOLO('models/best.pt')
    print("YOLOv11 model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# 2. In-memory state management for the application
# This dictionary will hold the state for different users (using 'default_user' for now)
def get_initial_state():
    return {
        "current_state": "WAIT_FIRST_NUM",
        "number_1": None,
        "operator": None,
        "number_2": None,
        "result": None
    }

user_states = defaultdict(get_initial_state)
USER_ID = "default_user"

# 3. Map for converting class names to mathematical symbols
OPERATOR_MAP = {
    "tambah": "+",
    "kurang": "-",
    "kali": "*",
    "bagi": "/",
    # Also include direct symbol mappings if your model predicts them
    "+": "+",
    "-": "-",
    "x": "*",
    "/": "/"
}

# --- API Endpoint ---
@router.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    if not model:
        return {"error": "Model not loaded"}

    # Read image bytes
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # --- Model Inference ---
    results = model(img)
    prediction = "Undefined" # Default prediction
    if results and len(results) > 0 and results[0].names:
        names = results[0].names
        for r in results:
            for c in r.boxes.cls:
                detected_class_name = names[int(c)]
                # Take the first valid prediction
                if detected_class_name:
                    prediction = detected_class_name
                    break
            if prediction != "Undefined":
                break

    # --- State Machine Logic ---
    state = user_states[USER_ID]

    # Handle 'Start' command to reset the state at any time
    if prediction == 'Start':
        state = user_states[USER_ID] = get_initial_state()
        return {"detected_class": "Start", "state": state}

    # Handle 'Undefined' gesture by returning current state without changes
    if prediction == 'Undefined':
        return {"detected_class": "Undefined", "state": state}

    is_operator = prediction in OPERATOR_MAP
    is_digit = prediction.isdigit()

    # Process input based on the current state
    if state["current_state"] == "WAIT_FIRST_NUM":
        if is_digit:
            state["number_1"] = int(prediction)
            state["current_state"] = "WAIT_OPERATOR"

    elif state["current_state"] == "WAIT_OPERATOR":
        if is_operator:
            state["operator"] = OPERATOR_MAP[prediction]
            state["current_state"] = "WAIT_SECOND_NUM"
        elif is_digit: # Allow user to overwrite the first number
            state["number_1"] = int(prediction)

    elif state["current_state"] == "WAIT_SECOND_NUM":
        if is_digit:
            state["number_2"] = int(prediction)
            # All components are present, perform calculation
            if all(k is not None for k in [state["number_1"], state["operator"], state["number_2"]]):
                try:
                    expression = f'{state["number_1"]} {state["operator"]} {state["number_2"]}'
                    # Use a safe evaluation method in a real app
                    state["result"] = eval(expression)
                except (ZeroDivisionError):
                    state["result"] = "Error"
                except Exception:
                    state["result"] = "Invalid"
                state["current_state"] = "SHOWING_RESULT"
        elif is_operator: # Allow user to overwrite the operator
             state["operator"] = OPERATOR_MAP[prediction]

    # Return the detected class and the updated state
    return {"detected_class": prediction, "state": state}
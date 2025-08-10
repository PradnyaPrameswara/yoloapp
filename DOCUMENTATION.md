# YOLOv11 Sign Language Arithmetic Calculator

## Project Overview

This is an interactive sign language arithmetic calculator web application that combines a **FastAPI backend** with a **React frontend**. The application captures webcam feed, processes it through a custom YOLOv11 sign language recognition model, and performs arithmetic calculations based on recognized hand gestures in real-time.

## Architecture

```
YOLOv11 Sign Language Calculator
├── Backend (FastAPI)
│   ├── YOLOv11 Model Integration (16 Classes)
│   ├── State Machine Logic
│   ├── Arithmetic Processing
│   └── REST API Endpoints
└── Frontend (React + Tailwind CSS)
    ├── Webcam Integration
    ├── Calculator Interface
    ├── Visual State Feedback
    └── Real-time Results Display
```

## Recognized Classes (16 Total)

The application recognizes the following sign language gestures:

### **Numbers (10 classes)**
- `0, 1, 2, 3, 4, 5, 6, 7, 8, 9` - Digit recognition for mathematical input

### **Operators (4 classes)**
- `tambah` → **+** (Addition)
- `kurang` → **-** (Subtraction) 
- `kali` → **×** (Multiplication)
- `bagi` → **÷** (Division)

### **Control Commands (2 classes)**
- `Start` - Reset calculator and begin new calculation
- `Undefined` - Unrecognized gesture (ignored, allows retry)

## Project Structure

```
yoloapp/
├── backend/
│   ├── app.py                    # Main FastAPI application
│   ├── start_server.py           # Server startup with dependency checks
│   ├── requirements.txt          # Python dependencies
│   ├── models/
│   │   ├── best.pt              # Custom YOLOv11 sign language model
│   │   ├── yolov11_pose.py      # Legacy model wrapper (for reference)
│   │   └── arithmetic_processor.py # Calculator logic processor
│   ├── routes/
│   │   └── pose.py              # API endpoints with state machine
│   ├── uploadedFile/            # Temporary storage for captured frames
│   ├── test_arithmetic_calculator.py # Test suite for calculator
│   ├── test_backend.py          # Backend functionality tests
│   ├── TROUBLESHOOTING.md       # Debugging guide
│   └── backend.log              # Application logs
├── frontend/
│   ├── public/
│   │   └── index.html           # Main HTML template
│   ├── src/
│   │   ├── App.js               # Calculator interface component
│   │   ├── index.js             # React app entry point
│   │   └── index.css            # Styles with active box effects
│   ├── package.json             # Node.js dependencies
│   └── tailwind.config.js       # Tailwind configuration
└── README.md                    # Project documentation
```

## How It Works

### 1. State Machine Logic

The calculator operates using a finite state machine with four main states:

#### **State Flow:**
```
WAIT_FIRST_NUM → WAIT_OPERATOR → WAIT_SECOND_NUM → SHOWING_RESULT
     ↑                                                     │
     └─────────────── "Start" command ────────────────────┘
```

#### **State Descriptions:**
1. **WAIT_FIRST_NUM**: Expects first number (0-9)
2. **WAIT_OPERATOR**: Expects operator (tambah/kurang/kali/bagi)  
3. **WAIT_SECOND_NUM**: Expects second number (0-9)
4. **SHOWING_RESULT**: Displays calculation result

#### **Special Behaviors:**
- **Start gesture**: Resets calculator at any state
- **Undefined gesture**: Ignored, allows user to retry
- **Input overwriting**: Users can change previous inputs by showing new gestures
- **Automatic calculation**: Result computed when all inputs are complete

### 2. Frontend (React Calculator Interface)

The frontend provides an intuitive calculator experience with:

#### **Camera Integration**
- Live webcam feed display
- Manual camera start/stop controls
- Frame capture for analysis
- Permission handling for camera access

#### **Visual Feedback System**
- **Active Input Highlighting**: Current expected input glows with blue border
- **Status Messages**: Clear guidance on what gesture to show next
- **Real-time Display**: Shows `number₁ operator number₂ = result`
- **State Indicators**: Current calculator state and last detected gesture

#### **User Interface Components**
- **Left Panel**: Camera feed and control buttons
- **Right Panel**: Calculation display and status information
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern UI with Tailwind CSS styling

### 3. Backend (FastAPI Application)

The backend handles sign language recognition and calculation logic:

#### **YOLOv11 Model Integration**
- Loads custom trained model (`best.pt`) for 16-class recognition
- Processes captured frames from frontend
- Extracts highest confidence predictions
- Maps Indonesian operator names to mathematical symbols

#### **State Management**
```python
# In-memory state per user
user_states = {
    "current_state": "WAIT_FIRST_NUM",
    "number_1": None,
    "operator": None, 
    "number_2": None,
    "result": None
}
```

#### **Arithmetic Processing Pipeline**
1. **Image Reception**: Receive frame from frontend
2. **Model Inference**: Run YOLOv11 prediction
3. **Class Extraction**: Get most confident prediction
4. **State Processing**: Update calculator state based on input
5. **Calculation**: Perform arithmetic when all inputs ready
6. **Response**: Return updated state to frontend

#### **Operator Mapping**
```python
OPERATOR_MAP = {
    "tambah": "+",    # Addition
    "kurang": "-",    # Subtraction  
    "kali": "*",      # Multiplication
    "bagi": "/"       # Division
}
```

The frontend is built with **React** and styled with **Tailwind CSS**. It provides:

#### Webcam Integration
- Uses `navigator.mediaDevices.getUserMedia()` to access the user's webcam
- Displays live video feed in a responsive layout
- Handles camera permissions and error states

#### Image Capture & Analysis
- Captures frames from the webcam when "Run Analysis" is clicked
- Converts video frames to JPEG blobs using HTML5 Canvas
- Sends images to the backend via HTTP POST requests

#### Real-time Results Display
- Shows detected objects/poses in real-time
- Displays confidence scores with animated progress bars
- Provides status updates during analysis

### 2. Backend (FastAPI Application)

The backend is built with **FastAPI** and handles:

#### Model Management
- Loads the custom `best.pt` YOLOv11 model on startup
- Wraps the model in a `YOLOv11PoseModel` class for easier management
- Handles model inference and error cases

#### Image Processing Pipeline
1. **Receive**: Accept image uploads via `/api/detect` endpoint
2. **Save**: Store uploaded images with unique timestamps
3. **Process**: Convert image bytes to OpenCV format
4. **Inference**: Run YOLOv11 pose detection
5. **Extract**: Parse results for objects, keypoints, and confidence scores
6. **Return**: Send structured JSON response to frontend

#### API Endpoints
- `GET /`: Welcome message and API status
- `POST /api/detect`: Main pose detection endpoint
- `GET /api/image/{filename}`: Serve processed images

### 3. YOLOv11 Model Integration

#### Model Loading
```python
from ultralytics import YOLO
model = YOLO('models/best.pt')
```

#### Inference Process
1. **Input**: OpenCV image array (BGR format)
2. **Processing**: YOLOv11 processes the image
3. **Output**: Results object containing:
   - Bounding boxes for detected objects
   - Keypoints for pose estimation
   - Confidence scores
   - Class labels

#### Data Flow
```
Webcam Frame → Canvas → Blob → FormData → FastAPI → OpenCV → YOLOv11 → Results → JSON → Frontend
```

## Technical Implementation

### Frontend Technologies
- **React 18**: Component-based UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **HTML5 Canvas**: For image capture from video
- **Fetch API**: For HTTP communication with backend

### Backend Technologies
- **FastAPI**: Modern Python web framework
- **Ultralytics YOLOv11**: State-of-the-art object detection
- **OpenCV**: Computer vision and image processing
- **Uvicorn**: ASGI server for FastAPI
- **CORS Middleware**: Cross-origin resource sharing

### Key Features

#### Real-time Processing
- Live webcam feed display
- On-demand frame capture and analysis
- Immediate results display

#### Pose Detection Capabilities
- Human pose estimation
- Object detection
- Confidence scoring
- Bounding box visualization

#### Responsive Design
- Mobile-friendly layout
- Dark/light mode support
- Adaptive UI components

## API Reference

### POST /api/detect

Analyzes an uploaded image for sign language recognition and processes it through the calculator state machine.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing captured frame

**Response:**
```json
{
  "detected_class": "5",
  "state": {
    "current_state": "WAIT_OPERATOR",
    "number_1": 5,
    "operator": null,
    "number_2": null,
    "result": null
  }
}
```

#### **Response Fields:**
- `detected_class`: The recognized sign language gesture
- `state.current_state`: Current calculator state
- `state.number_1`: First number in calculation
- `state.operator`: Mathematical operator (+, -, *, /)
- `state.number_2`: Second number in calculation  
- `state.result`: Calculated result (when complete)

#### **Example Response Sequence:**

**1. First Number Input:**
```json
{
  "detected_class": "7",
  "state": {
    "current_state": "WAIT_OPERATOR",
    "number_1": 7,
    "operator": null,
    "number_2": null,
    "result": null
  }
}
```

**2. Operator Input:**
```json
{
  "detected_class": "tambah",
  "state": {
    "current_state": "WAIT_SECOND_NUM",
    "number_1": 7,
    "operator": "+",
    "number_2": null,
    "result": null
  }
}
```

**3. Second Number & Result:**
```json
{
  "detected_class": "3",
  "state": {
    "current_state": "SHOWING_RESULT", 
    "number_1": 7,
    "operator": "+",
    "number_2": 3,
    "result": 10
  }
}
```

**4. Reset Command:**
```json
{
  "detected_class": "Start",
  "state": {
    "current_state": "WAIT_FIRST_NUM",
    "number_1": null,
    "operator": null,
    "number_2": null,
    "result": null
  }
}
```

### GET /

Returns welcome message and API status.

**Response:**
```json
{
  "message": "Welcome to the YOLOv11 Pose Detection API!"
}
```

## Setup and Installation

### Prerequisites
- Python 3.8+ with conda/pip
- Node.js 16+ with npm  
- Webcam access
- Modern web browser with camera permissions
- Custom YOLOv11 model trained for 16 sign language classes

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd yoloapp/backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure model file exists:**
   - Place your trained `best.pt` model in `models/` directory
   - Model should be trained to recognize 16 classes: 0-9, tambah, kurang, kali, bagi, Start, Undefined

4. **Start the FastAPI server:**
   ```bash
   python start_server.py
   ```
   Or alternatively:
   ```bash
   uvicorn app:app --reload
   ```
   
   Server runs on: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd yoloapp/frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   
   Application opens on: `http://localhost:3000`

## Usage

### Step-by-Step Calculator Operation

1. **Start the Application**
   - Ensure both backend (port 8000) and frontend (port 3000) are running
   - Open browser to `http://localhost:3000`

2. **Initialize Camera**
   - Click **"Start Camera"** button
   - Allow camera permissions when prompted
   - Verify webcam feed is displayed

3. **Perform Calculation**
   - **Step 1**: Show first number (0-9)
     - Current input field will glow blue
     - Status: "Please show the first number (0-9)"
   
   - **Step 2**: Show operator gesture
     - Status: "Got it: 5. Now show an operator"
     - Show `tambah` (+), `kurang` (-), `kali` (×), or `bagi` (÷)
   
   - **Step 3**: Show second number (0-9)  
     - Status: "OK: 5 + Now show the second number"
     - Calculator automatically computes result
   
   - **Step 4**: View result
     - Status: "Calculation complete! Show 'Start' to reset"
     - Result displayed in equation: `5 + 3 = 8`

4. **Reset Calculator**
   - Show **"Start"** gesture at any time to reset
   - Calculator returns to initial state

### Example Calculation Sequence

```
User shows: "7"     →  State: WAIT_OPERATOR    →  Display: 7 _ _ = _
User shows: "kali"  →  State: WAIT_SECOND_NUM  →  Display: 7 × _ = _  
User shows: "4"     →  State: SHOWING_RESULT   →  Display: 7 × 4 = 28
User shows: "Start" →  State: WAIT_FIRST_NUM   →  Display: _ _ _ = _
```

### Gesture Tips
- Ensure good lighting conditions
- Position hand clearly in camera view
- Hold gesture steady for recognition
- Wait for visual feedback before proceeding
- Use "Start" to reset if calculation goes wrong

## Configuration

### Environment Variables
- `CORS_ORIGINS`: Allowed frontend origins (default: "*")
- `MODEL_PATH`: Path to YOLOv11 model file (default: "models/best.pt")
- `UPLOAD_DIR`: Directory for temporary frame storage (default: "uploadedFile")

### Model Configuration
- **Model file**: `backend/models/best.pt`
- **Required classes**: 16 total (0-9, tambah, kurang, kali, bagi, Start, Undefined)
- **Supported formats**: PyTorch (.pt), ONNX (.onnx)
- **Input size**: Automatically handled by YOLOv11
- **Device**: Automatically detects CUDA/CPU

### Calculator Configuration
- **State machine**: In-memory per-user state management
- **Operator mapping**: Indonesian terms → Mathematical symbols
- **Error handling**: Division by zero, invalid operations
- **Auto-reset**: No timeout (manual reset with "Start" gesture)

## Troubleshooting

### Common Issues

1. **"Model not loaded properly"**
   - **Cause**: Missing or corrupted model file
   - **Solution**: 
     - Ensure `best.pt` exists in `backend/models/`
     - Verify model is trained for 16 sign language classes
     - Check model file integrity and size
     - Run: `python test_model.py` to test model loading

2. **"Could not access webcam"**
   - **Cause**: Camera permissions or hardware issues
   - **Solution**:
     - Grant camera permissions in browser settings
     - Close other applications using the camera
     - Try different browser (Chrome/Firefox/Edge)
     - Ensure HTTPS for some browsers (localhost works)

3. **"Analysis failed. Is the backend running?"**
   - **Cause**: Backend server not responding
   - **Solution**:
     - Check backend is running on `http://localhost:8000`
     - Verify no firewall blocking port 8000
     - Check backend logs for errors
     - Test API: `curl http://localhost:8000/`

4. **"Gesture not recognized" (Undefined)**
   - **Cause**: Poor gesture recognition
   - **Solution**:
     - Ensure good lighting conditions
     - Position hand clearly in camera center
     - Hold gesture steady for 1-2 seconds
     - Check if gesture is in trained classes
     - Adjust camera angle and distance

5. **Calculator stuck in wrong state**
   - **Cause**: State machine confusion
   - **Solution**:
     - Show "Start" gesture to reset calculator
     - Refresh browser page to reset frontend
     - Check status message for guidance
     - Allow 1-2 seconds between gestures

6. **Dependency errors on startup**
   - **Cause**: Missing Python packages
   - **Solution**:
     - Run: `pip install -r requirements.txt`
     - Check specific error in `backend.log`
     - Use: `python test_backend.py` for diagnosis
     - Ensure correct Python environment activated

### Testing and Debugging

#### **Run Test Suite**
```bash
cd backend
python test_arithmetic_calculator.py
```

#### **Test Individual Components**
```bash
# Test backend functionality
python test_backend.py

# Test model loading specifically  
python test_model.py

# Check server startup
python start_server.py
```

#### **Enable Debug Logging**
```bash
# Set environment variable for verbose logging
export LOG_LEVEL=DEBUG
python start_server.py
```

#### **Manual API Testing**
```bash
# Test API status
curl http://localhost:8000/

# Test with image file (if available)
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/api/detect
```

### Performance Optimization

#### **Inference Speed**
- **GPU Acceleration**: Install CUDA-compatible PyTorch for faster model inference
- **Model Optimization**: Consider ONNX export for production deployment
- **Frame Preprocessing**: Optimize image size and quality before processing

#### **Resource Management**
- **Memory Usage**: Monitor state management for multiple concurrent users
- **CPU Optimization**: Use threading for non-blocking inference
- **Network**: Optimize payload size for faster API responses

## Technical Specifications

### **Model Requirements**
- **Input**: RGB images (any resolution, auto-resized by YOLOv11)
- **Output**: Class predictions with confidence scores
- **Classes**: Exactly 16 classes as defined in model training
- **Framework**: PyTorch/Ultralytics YOLOv11

### **State Machine Specifications**
- **States**: 4 distinct states (WAIT_FIRST_NUM, WAIT_OPERATOR, WAIT_SECOND_NUM, SHOWING_RESULT)
- **Transitions**: Deterministic based on input class and current state
- **Memory**: In-memory storage per user session
- **Reset**: Available from any state via "Start" gesture

### **Calculation Engine**
- **Operations**: Addition (+), Subtraction (-), Multiplication (×), Division (÷)
- **Number Range**: Single digits (0-9)
- **Error Handling**: Division by zero → "Error", Invalid operations → "Invalid"
- **Precision**: Standard floating-point arithmetic

## Future Enhancements

### **Version 2.0 Roadmap**
- [ ] **Multi-digit numbers**: Support for 10, 20, 30, etc.
- [ ] **Advanced operations**: Square root, percentage, parentheses
- [ ] **Memory functions**: Store/recall previous results
- [ ] **History tracking**: View previous calculations
- [ ] **Voice feedback**: Audio confirmation of detected gestures

### **Technical Improvements**
- [ ] **Real-time streaming**: WebRTC for continuous video processing
- [ ] **Multi-user support**: Session management for multiple calculators
- [ ] **Model versioning**: A/B testing with different trained models
- [ ] **Gesture confidence**: Display prediction confidence scores
- [ ] **Custom training**: Interface for retraining model with new data

### **Platform Extensions**
- [ ] **Mobile app**: React Native version for smartphones
- [ ] **Desktop app**: Electron wrapper for offline usage
- [ ] **Cloud deployment**: Docker containerization and cloud hosting
- [ ] **API integration**: REST API for third-party applications

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Install development dependencies
4. Make your changes with appropriate tests
5. Run the test suite: `python test_arithmetic_calculator.py`
6. Submit a pull request with detailed description

### **Contribution Guidelines**
- **Code Style**: Follow PEP 8 for Python, ESLint for JavaScript
- **Testing**: Add tests for new features
- **Documentation**: Update docs for any API changes
- **Model Training**: Include training scripts and dataset info for model updates
## Support

### **Getting Help**
For issues and questions:

1. **Check Documentation**: Review this documentation and `README.md`
2. **Run Diagnostics**: Use `python test_backend.py` for troubleshooting
3. **Check Logs**: Review `backend/backend.log` for error details
4. **Troubleshooting Guide**: See `backend/TROUBLESHOOTING.md` for common issues
5. **Test Suite**: Run `python test_arithmetic_calculator.py` to verify functionality

### **Common Support Topics**
- **Model Training**: How to train custom YOLOv11 model for sign language
- **Gesture Recognition**: Improving accuracy and adding new gestures
- **State Machine**: Customizing calculator logic and operations
- **Deployment**: Setting up production environment
- **Performance**: Optimizing inference speed and resource usage

### **Contact Information**
- **Issues**: Open GitHub issues for bugs and feature requests
- **Documentation**: Suggest improvements to documentation
- **Model Sharing**: Share trained models and datasets with community

---

**Built with ❤️ using YOLOv11, FastAPI, and React**

*This project demonstrates the power of computer vision and machine learning in creating accessible interfaces for mathematical computation through sign language recognition.*

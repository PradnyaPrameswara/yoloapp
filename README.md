# YOLOv11 Sign Language Arithmetic Calculator

This project is a web application that utilizes FastAPI for the backend to implement a custom YOLOv11 model for sign language recognition, specifically designed to function as an interactive arithmetic calculator.

## Project Overview

The application recognizes 16 specific classes:
- **Numbers**: 0-9 (digits)
- **Operators**: tambah (+), kurang (-), kali (*), bagi (/)
- **Control**: Start (reset), Undefined (unrecognized gesture)

## Features

- Real-time sign language recognition using YOLOv11
- Interactive arithmetic calculator with state management
- Visual feedback showing current input expectations
- Complete calculation display with step-by-step progression
- Automatic result computation when all inputs are provided

## Project Structure

```
yoloapp/
├── backend/
│   ├── app.py                    # Main FastAPI application
│   ├── requirements.txt          # Python dependencies
│   ├── models/
│   │   ├── best.pt              # Custom YOLOv11 sign language model
│   │   ├── yolov11_pose.py      # Original model wrapper (legacy)
│   │   └── arithmetic_processor.py # Calculator logic processor
│   ├── routes/
│   │   └── pose.py              # API endpoints with state machine
│   ├── uploadedFile/            # Temporary storage for uploaded images
│   └── test_arithmetic_calculator.py # Test suite for calculator
├── frontend/
│   ├── src/
│   │   ├── App.js               # React calculator interface
│   │   ├── index.js             # React app entry point
│   │   └── index.css            # Styles with active box effects
│   ├── package.json             # Node.js dependencies
│   └── tailwind.config.js       # Tailwind configuration
└── README.md                    # This file
```

## How It Works

### State Machine Logic
The calculator follows a simple state machine:
1. **WAIT_FIRST_NUM**: Expecting first number (0-9)
2. **WAIT_OPERATOR**: Expecting operator (tambah/kurang/kali/bagi)
3. **WAIT_SECOND_NUM**: Expecting second number (0-9)
4. **SHOWING_RESULT**: Displaying calculation result

### Special Commands
- **Start**: Resets the calculator at any time
- **Undefined**: Ignored, allows user to retry gesture

### Visual Feedback
- Active input field glows with blue border
- Status messages guide user through each step
- Real-time display of: number₁ operator number₂ = result

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure your custom model file `best.pt` is in the `models/` directory

4. Run the FastAPI application:
   ```bash
   python start_server.py
   ```
   Or alternatively:
   ```bash
   uvicorn app:app --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Open browser** to `http://localhost:3000`
3. **Click "Start Camera"** and allow webcam access
4. **Follow the on-screen prompts**:
   - Show first number (0-9)
   - Show operator (tambah/kurang/kali/bagi) 
   - Show second number (0-9)
   - View calculated result
5. **Show "Start" gesture** to reset and begin new calculation

## API Reference

### POST /api/detect
Analyzes uploaded image and processes it through the calculator state machine.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` field with image data

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

## Testing

Run the arithmetic calculator test suite:
```bash
cd backend
python test_arithmetic_calculator.py
```

## Troubleshooting

1. **Model not loaded**: Ensure `models/best.pt` exists and is trained for the 16 classes
2. **Camera access denied**: Allow browser permissions for webcam
3. **Backend connection failed**: Verify backend is running on port 8000
4. **Gestures not recognized**: Ensure good lighting and clear hand positioning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes with the provided test suite
4. Submit a pull request

## License

This project is licensed under the MIT License.
````
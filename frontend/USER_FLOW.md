# YOLOv11 Sign Language Arithmetic Calculator - User Flow

## 📱 Complete User Journey

### 1. **Landing Page** (Entry Point)
```
🏠 LANDING PAGE
├── Title: "YOLOv11 Sign Language Calculator"
├── Description: "An interactive way to learn and practice arithmetic using sign language"
└── Action: [Login as Guest] → Navigate to Home Page
    └── Note: "No account needed. Just start learning!"
```

### 2. **Home Page** (Main Navigation Hub)
```
🏡 HOME PAGE
├── Welcome Message: "Welcome! Choose an option to get started."
├── [Start Calculator] → Navigate to Calculator Page
├── [Help (View Signs)] → Navigate to Help Page
└── [Logout] → Navigate back to Landing Page
```

### 3. **Help Page** (Sign Language Reference)
```
📚 HELP PAGE
├── Title: "Sign Language Guide"
├── Grid Layout (4 columns on desktop, responsive):
│   ├── Numbers 0-9 (10 images)
│   ├── Operators: +, -, ×, ÷ (4 images)
│   └── Commands: Start, Undefined (2 images)
└── [Back to Home] → Navigate to Home Page
```

### 4. **Calculator Page** (Main Application)
```
🧮 CALCULATOR PAGE
├── Left Panel: Camera & Controls
│   ├── Header: "YOLOv11 Calculator" | [← Back to Home]
│   ├── Video Feed (black rectangle when camera off)
│   └── Controls:
│       ├── [Start Camera] / [Stop Camera]
│       ├── [Run Analysis] (disabled when camera off)
│       └── [Reset] (red button for manual reset)
│
└── Right Panel: Calculation Display
    ├── Title: "Calculation"
    ├── Status Message (dynamic feedback)
    ├── Calculation Display: [_] [_] [_] = [_]
    │   └── Active box highlights with blue glow
    └── Detection Info:
        ├── "Last Detected: [gesture name]"
        └── "Current State: [state name]"
```

## 🔄 Detailed Calculator Flow

### Phase 1: Setup
1. **Camera Initialization**
   - User clicks "Start Camera"
   - Browser requests camera permission
   - Video feed appears in interface
   - Status: "Please show the first number (0-9)"

### Phase 2: First Number Input
2. **Waiting for First Number** (`WAIT_FIRST_NUM`)
   - First calculation box glows blue (active state)
   - User shows number sign (0-9) to camera
   - User clicks "Run Analysis"
   - System detects and processes gesture
   - **Success**: Number appears in first box
   - **Status**: "Got it: [number]. Now show an operator."
   - **Failure**: "Gesture not recognized. Please try again."

### Phase 3: Operator Input
3. **Waiting for Operator** (`WAIT_OPERATOR`)
   - Operator box glows blue (active state)
   - User shows operator sign (+, -, ×, ÷)
   - User clicks "Run Analysis"
   - **Success**: Operator appears in second box
   - **Status**: "OK: [num1] [operator]. Now show the second number."

### Phase 4: Second Number Input
4. **Waiting for Second Number** (`WAIT_SECOND_NUM`)
   - Third calculation box glows blue (active state)
   - User shows second number sign (0-9)
   - User clicks "Run Analysis"
   - **Success**: Number appears in third box
   - **Automatic**: Backend calculates result immediately
   - **Status**: "Calculation complete! Result: [result]. Show 'Start' to reset."

### Phase 5: Result Display
5. **Showing Result** (`SHOWING_RESULT`)
   - Complete equation displayed: [num1] [operator] [num2] = [result]
   - All boxes filled with calculation data
   - **Next Actions**:
     - Show "Start" sign → Auto-reset after 1.5 seconds
     - Click "Reset" button → Immediate reset
     - Continue using other controls normally

### Phase 6: Reset Process
6. **System Reset**
   - **Via "Start" Sign**:
     - Status: "System reset! Starting fresh calculation..."
     - 1.5-second delay with feedback message
     - Auto-clear all values → Return to Phase 2
   - **Via Reset Button**:
     - Status: "Calculator reset. Please show the first number."
     - Immediate clear → Return to Phase 2

## 🎯 Key User Interactions

### Navigation Flow
```
Landing → Home → Calculator (main flow)
       ↘ Help ↗
```

### Camera Controls
- **Start Camera**: Activates video feed and enables analysis
- **Stop Camera**: Deactivates video feed and disables analysis
- **Run Analysis**: Captures frame and sends to AI backend

### Reset Options
- **Gesture Reset**: Show "Start" sign → Detected → Auto-reset
- **Manual Reset**: Click red "Reset" button → Immediate reset

## 🚨 Error Handling

### Camera Issues
- **Permission Denied**: "Camera access denied. Please allow camera permissions."
- **Camera Unavailable**: Error logged to console, status message updated

### Backend Issues  
- **Server Offline**: "Analysis failed. Is the backend running?"
- **Network Error**: Error logged, analysis button re-enabled

### Gesture Recognition
- **Unrecognized Gesture**: "Gesture not recognized. Please try again."
- **"Undefined" Class**: "Gesture not recognized. Please try again."

## 🔧 Technical States

### Application States
1. `WAIT_FIRST_NUM` - Waiting for first number (0-9)
2. `WAIT_OPERATOR` - Waiting for operator (+, -, ×, ÷)  
3. `WAIT_SECOND_NUM` - Waiting for second number (0-9)
4. `SHOWING_RESULT` - Displaying calculation result

### Camera States
- **Off**: Camera stopped, video feed black
- **On**: Camera active, live video feed
- **Analyzing**: Processing gesture (button shows "Analyzing...")

### UI States
- **Active Box**: Blue glow + scale effect on current input field
- **Filled Box**: Gray background with detected value
- **Result Box**: Always gray, shows final calculation result

## 💡 User Experience Features

### Visual Feedback
- ✅ Smooth page transitions with fade-in animations
- ✅ Hover effects on all buttons (scale + color change)
- ✅ Active state highlighting for current input field
- ✅ Responsive design (mobile/tablet/desktop)

### Status Communication
- ✅ Clear, step-by-step instructions
- ✅ Real-time feedback on gesture recognition
- ✅ Progress indication through calculation states
- ✅ Error messages with actionable guidance

### Accessibility
- ✅ Large, clear button text and icons
- ✅ High contrast color scheme (dark theme)
- ✅ Responsive button sizes for touch interfaces
- ✅ Clear visual hierarchy and layout

This user flow ensures a smooth, intuitive experience for learning sign language arithmetic with real-time AI feedback!

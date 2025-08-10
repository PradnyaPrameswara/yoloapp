# Troubleshooting Guide

## Common Issues and Solutions

### 1. 500 Internal Server Error

**Symptoms:**
- Frontend receives 500 error when uploading images
- No specific error message in browser console
- Images not being saved

**Possible Causes:**
- Missing dependencies
- Model file not found
- Incorrect file paths
- Permission issues

**Solutions:**

#### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Step 2: Run the Test Script
```bash
python test_backend.py
```

This will check:
- All required packages are installed
- Model file exists and can be loaded
- File operations work correctly
- YOLOv11PoseModel class works

#### Step 3: Check Model File
Ensure `models/best.pt` exists in the backend directory.

#### Step 4: Check File Permissions
Make sure the backend process has write permissions to:
- `uploadedFile/` directory
- Current working directory

### 2. Images Not Being Saved

**Symptoms:**
- Images uploaded but not found in `uploadedFile/` directory
- No error messages but images disappear

**Solutions:**

#### Check Directory Creation
The `uploadedFile/` directory should be created automatically. If not:
```bash
mkdir uploadedFile
```

#### Check File Paths
The code now uses relative paths instead of hardcoded absolute paths. Make sure you're running the server from the `backend/` directory.

### 3. Model Loading Issues

**Symptoms:**
- "Model not loaded properly" error
- CUDA/GPU related errors

**Solutions:**

#### Check Model File
```bash
ls -la models/best.pt
```

#### Test Model Loading
```python
from ultralytics import YOLO
model = YOLO("models/best.pt")
```

#### GPU Issues
If you have CUDA errors, try running on CPU:
```python
model = YOLO("models/best.pt")
model.to('cpu')  # Force CPU usage
```

### 4. CORS Issues

**Symptoms:**
- Frontend can't connect to backend
- CORS errors in browser console

**Solutions:**

The backend already includes CORS middleware. If you still have issues:

1. Make sure backend is running on `http://127.0.0.1:8000`
2. Make sure frontend is running on `http://localhost:3000`
3. Check that CORS middleware is properly configured in `app.py`

### 5. File Upload Issues

**Symptoms:**
- "Empty file uploaded" error
- "Uploaded file is not a valid image" error

**Solutions:**

#### Check Frontend Code
Make sure the frontend is sending the image correctly:
- Image should be converted to Blob
- FormData should be used
- Content-Type should be set correctly

#### Check Image Format
Supported formats: JPG, PNG, JPEG

### 6. Memory Issues

**Symptoms:**
- Server crashes when processing large images
- Out of memory errors

**Solutions:**

#### Resize Images
Add image resizing in the backend:
```python
# Resize image before processing
img = cv2.resize(img, (640, 640))
```

#### Use Smaller Model
If available, use a smaller/faster model variant.

## Debugging Steps

### 1. Enable Detailed Logging
The backend now includes detailed logging. Check the console output for:
- Model loading messages
- File processing messages
- Error details

### 2. Check Log Files
If using the startup script, check `backend.log` for detailed error information.

### 3. Test Individual Components
Use the test script to isolate issues:
```bash
python test_backend.py
```

### 4. Manual Testing
Test the API directly:
```bash
# Test the root endpoint
curl http://127.0.0.1:8000/

# Test pose detection (replace with actual image file)
curl -X POST -F "file=@test_image.jpg" http://127.0.0.1:8000/api/pose/detect
```

## Quick Fix Checklist

- [ ] Install all dependencies: `pip install -r requirements.txt`
- [ ] Ensure model file exists: `models/best.pt`
- [ ] Create upload directory: `mkdir uploadedFile`
- [ ] Run from correct directory: `cd backend`
- [ ] Check file permissions
- [ ] Test with the provided test script
- [ ] Check console logs for specific error messages

## Getting Help

If you're still having issues:

1. Run the test script and share the output
2. Check the console logs when the error occurs
3. Share the specific error message from the browser console
4. Check if the model file is valid and not corrupted 
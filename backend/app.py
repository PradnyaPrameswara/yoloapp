from fastapi import FastAPI, File, UploadFile, HTTPException
from routes.pose import router as pose_router
from routes.auth import router as auth_router
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import numpy as np
import cv2
from ultralytics import YOLO
import logging
from database import engine
from models.user import Base

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the YOLOv11 Pose Detection API!"}

# Register routers
app.include_router(pose_router)
app.include_router(auth_router)

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

imageDirectory = "uploadedFile"
if not os.path.exists(imageDirectory):
    os.makedirs(imageDirectory)
    logger.info(f"Created directory: {imageDirectory}")

if __name__ == "__main__":
    import uvicorn
    # Changed port from 8000 to 8001
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")
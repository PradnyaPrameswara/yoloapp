import React, { useState, useRef, useEffect } from 'react';

const PredictGesture = ({ onNavigate }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [statusMessage, setStatusMessage] = useState("Click 'Start Camera' to begin.");
    const [fps, setFps] = useState(0);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    // Function to update container size
    const updateContainerSize = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setContainerSize({ width, height });
        }
    };

    // Function to start the camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
                setStatusMessage("Camera ready. Click 'Start Prediction' to begin.");
                
                // Setup overlay canvas setelah video siap
                videoRef.current.onloadedmetadata = () => {
                    if (overlayCanvasRef.current) {
                        overlayCanvasRef.current.width = videoRef.current.videoWidth;
                        overlayCanvasRef.current.height = videoRef.current.videoHeight;
                    }
                    updateContainerSize();
                };
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setStatusMessage("Camera access denied. Please allow camera permissions.");
        }
    };

    // Function to stop the camera
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsCameraOn(false);
            setIsPredicting(false);
            setStatusMessage("Click 'Start Camera' to begin.");
            
            // Clear overlay canvas
            if (overlayCanvasRef.current) {
                const ctx = overlayCanvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
            }
        }
    };

    // Function to start prediction
    const startPrediction = () => {
        if (!isCameraOn) return;
        setIsPredicting(true);
        setStatusMessage("Predicting gestures in real-time...");
    };

    // Function to stop prediction
    const stopPrediction = () => {
        setIsPredicting(false);
        setStatusMessage("Prediction stopped. Click 'Start Prediction' to resume.");
        
        // Clear overlay canvas ketika prediction dihentikan
        if (overlayCanvasRef.current) {
            const ctx = overlayCanvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
        }
    };

    // Function to draw bounding boxes on overlay canvas
    const drawBoundingBoxes = (detections) => {
        if (!overlayCanvasRef.current || !detections || detections.length === 0) return;
        
        const ctx = overlayCanvasRef.current.getContext('2d');
        const canvas = overlayCanvasRef.current;
        
        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        detections.forEach(detection => {
            const { bbox, class: className, confidence } = detection;
            if (!bbox || bbox.length < 4) return;
            
            const [x1, y1, x2, y2] = bbox;
            const width = x2 - x1;
            const height = y2 - y1;
            
            // Draw bounding box
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(x1, y1, width, height);
            
            // Draw background for label
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            const text = `${className} (${(confidence * 100).toFixed(1)}%)`;
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(x1, y1 - 20, textWidth + 10, 20);
            
            // Draw label
            ctx.fillStyle = '#00ff00';
            ctx.font = '14px Arial';
            ctx.fillText(text, x1 + 5, y1 - 5);
        });
    };

    // Function to capture frame and send to backend for prediction
    const captureAndPredict = async () => {
        if (!videoRef.current || !videoRef.current.srcObject || !isPredicting) return;
        
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
            
            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            const response = await fetch('http://localhost:8001/api/predict', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                const data = await response.json();
                setPredictionResult(data);
                
                // Draw bounding boxes jika ada detections
                if (data.detections && data.detections.length > 0) {
                    drawBoundingBoxes(data.detections);
                } else {
                    // Clear overlay jika tidak ada detections
                    if (overlayCanvasRef.current) {
                        const ctx = overlayCanvasRef.current.getContext('2d');
                        ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
                    }
                }
            }
        } catch (error) {
            console.error("Prediction failed:", error);
        }
    };

    // FPS counter and prediction loop
    useEffect(() => {
        let frameCount = 0;
        let startTime = Date.now();
        let predictionInterval = null;

        if (isPredicting) {
            predictionInterval = setInterval(() => {
                captureAndPredict();
                frameCount++;
                
                // Calculate FPS every second
                const currentTime = Date.now();
                const elapsedTime = (currentTime - startTime) / 1000;
                
                if (elapsedTime >= 1) {
                    setFps(Math.round(frameCount / elapsedTime));
                    frameCount = 0;
                    startTime = currentTime;
                }
            }, 100); // Adjust interval for desired prediction rate
        } else {
            // Clear overlay canvas ketika prediction dihentikan
            if (overlayCanvasRef.current) {
                const ctx = overlayCanvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
            }
        }

        return () => {
            if (predictionInterval) {
                clearInterval(predictionInterval);
            }
        };
    }, [isPredicting]);

    // Update container size on window resize
    useEffect(() => {
        window.addEventListener('resize', updateContainerSize);
        return () => {
            window.removeEventListener('resize', updateContainerSize);
        };
    }, []);

    // Initial container size update
    useEffect(() => {
        updateContainerSize();
    }, []);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gesture Prediction</h1>
                <button 
                    onClick={() => onNavigate('home')} 
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                    &larr; Back to Home
                </button>
            </div>
            
            {/* Camera and Prediction Section */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Panel: Camera Feed - Flexible width */}
                <div className="flex-1 bg-gray-800 p-4 rounded-2xl shadow-lg">
                    <div 
                        ref={containerRef}
                        className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 relative"
                        style={{ minHeight: '450px' }}
                    >
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted
                            className="w-full h-full object-cover"
                        ></video>
                        {/* Overlay canvas untuk bounding boxes */}
                        <canvas 
                            ref={overlayCanvasRef}
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            style={{ zIndex: 10 }}
                        ></canvas>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        
                        {/* Loading indicator to prevent sudden size changes */}
                        {!isCameraOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                                    <p>Camera feed will appear here</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button 
                            onClick={isCameraOn ? stopCamera : startCamera} 
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                        >
                            {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                        </button>
                        
                        <button 
                            onClick={isPredicting ? stopPrediction : startPrediction} 
                            disabled={!isCameraOn}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:bg-gray-500"
                        >
                            {isPredicting ? 'Stop Prediction' : 'Start Prediction'}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Prediction Results - FIXED WIDTH to prevent resizing */}
                <div className="w-full lg:w-80 xl:w-96 bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col" style={{ minWidth: '320px', maxWidth: '400px' }}>
                    <h2 className="text-xl font-bold mb-4 text-center whitespace-nowrap overflow-hidden text-ellipsis">Prediction Results</h2>
                    
                    {/* Status message with fixed height */}
                    <div className="status-message bg-gray-700 p-3 rounded-lg mb-4 h-16 flex items-center justify-center">
                        <p className="text-center text-sm leading-tight break-words">{statusMessage}</p>
                    </div>
                    
                    {/* FPS counter with fixed height */}
                    {isPredicting && (
                        <div className="bg-blue-900 p-2 rounded-lg text-center mb-4 h-10 flex items-center justify-center">
                            <p className="font-mono text-sm">FPS: {fps}</p>
                        </div>
                    )}
                    
                    {/* Prediction results with fixed dimensions and scrollable content */}
                    <div className="prediction-results flex-1 overflow-hidden" style={{ minHeight: '400px' }}>
                        {predictionResult ? (
                            <div className="space-y-4 h-full overflow-y-auto">
                                {/* Detected Gesture - Fixed height container */}
                                <div className="bg-gray-700 p-3 rounded-lg">
                                    <h3 className="font-bold mb-2 text-sm">Detected Gesture:</h3>
                                    <div className="h-8 flex items-center justify-center">
                                        <p className="text-lg text-green-400 font-bold text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                            {predictionResult.detected_class || 'No gesture detected'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Confidence - Fixed height container */}
                                <div className="bg-gray-700 p-3 rounded-lg">
                                    <h3 className="font-bold mb-2 text-sm">Confidence:</h3>
                                    <div className="h-6 flex items-center justify-center">
                                        <p className="text-center font-mono">
                                            {predictionResult.confidence 
                                                ? `${(predictionResult.confidence * 100).toFixed(2)}%` 
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                {/* All Detections - Scrollable with fixed max height */}
                                {predictionResult.detections && predictionResult.detections.length > 0 && (
                                    <div className="bg-gray-700 p-3 rounded-lg flex flex-col">
                                        <h3 className="font-bold mb-2 text-sm">All Detections:</h3>
                                        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '200px' }}>
                                            <div className="space-y-2">
                                                {predictionResult.detections.map((detection, index) => (
                                                    <div key={index} className="flex justify-between items-center py-1 border-b border-gray-600">
                                                        <span className="font-medium text-xs truncate mr-2 flex-1">{detection.class}</span>
                                                        <span className="text-green-400 text-xs font-mono whitespace-nowrap">{(detection.confidence * 100).toFixed(1)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                <p className="text-center">No predictions yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictGesture;
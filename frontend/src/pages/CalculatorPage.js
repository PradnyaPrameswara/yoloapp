import React, { useState, useRef, useCallback, useEffect } from 'react';

const CalculatorPage = ({ onNavigate }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const analysisIntervalRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [analysisResult, setAnalysisResult] = useState({
        detected_class: null,
        state: {
            current_state: "WAIT_FIRST_NUM",
            number_1: null,
            operator: null,
            number_2: null,
            result: null,
        }
    });
    const [statusMessage, setStatusMessage] = useState("Click 'Start Camera' to begin.");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisTime, setAnalysisTime] = useState(0);

    // Function to start the camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
                setStatusMessage("Camera ready. Click 'Capture & Analyze' to begin.");
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
            setStatusMessage("Click 'Start Camera' to begin.");
        }
        
        // Clear any ongoing analysis
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
            analysisIntervalRef.current = null;
        }
        setIsAnalyzing(false);
        setAnalysisTime(0);
    };

    // Function to completely reset the calculator and clear all data
    const resetCalculator = async () => {
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
            analysisIntervalRef.current = null;
        }

        try {
            const response = await fetch('http://localhost:8001/api/reset', { method: 'POST' });
            const data = await response.json();

            setAnalysisResult({
                detected_class: null,
                state: data.state
            });

            setStatusMessage("Calculator completely reset. Please show the first number (0-9).");
        } catch (error) {
            console.error("Failed to reset backend:", error);
            setStatusMessage("Failed to reset backend calculator.");
        }

        setIsAnalyzing(false);
        setAnalysisTime(0);
    };

    // Function to capture a single frame
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !videoRef.current.srcObject) return null;
        
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        return canvas;
    }, []);

    // Function to analyze the captured image
    const analyzeImage = useCallback(async () => {
        const canvas = captureFrame();
        if (!canvas) return null;
        
        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
            
            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            const response = await fetch('http://localhost:8001/api/detect', {
                method: 'POST',
                body: formData,
            });
            
            return await response.json();
        } catch (error) {
            console.error("Analysis failed:", error);
            setStatusMessage("Analysis failed. Is the backend running?");
            return null;
        }
    }, [captureFrame]);

    // Function to start analysis with 3-second timeout
    const startAnalysis = useCallback(async () => {
        if (isAnalyzing || !isCameraOn) return;
        
        setIsAnalyzing(true);
        setAnalysisTime(0);
        setStatusMessage("Analyzing gesture... (0/3s)");
        
        let elapsedTime = 0;
        
        // Clear previous interval if exists
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
        }
        
        // Start analysis process
        analysisIntervalRef.current = setInterval(async () => {
            elapsedTime += 1;
            setAnalysisTime(elapsedTime);
            
            if (elapsedTime >= 3) {
                // Time's up - stop analysis
                clearInterval(analysisIntervalRef.current);
                analysisIntervalRef.current = null;
                setIsAnalyzing(false);
                setStatusMessage("Analysis complete. No gesture detected within 3 seconds.");
                return;
            }
            
            setStatusMessage(`Analyzing gesture... (${elapsedTime}/3s)`);
            
            // Perform analysis
            const data = await analyzeImage();
            if (!data) return;
            
            setAnalysisResult(data);
            
            // Check if a valid gesture was detected (not 'Undefined')
            if (data.detected_class && data.detected_class !== 'Undefined') {
                clearInterval(analysisIntervalRef.current);
                analysisIntervalRef.current = null;
                setIsAnalyzing(false);
                
                // Handle reset when Start is detected
                if (data.detected_class === 'Start') {
                    resetCalculator();
                    setStatusMessage("System reset! Starting fresh calculation...");
                } else {
                    setStatusMessage(`Gesture detected: ${data.detected_class}`);
                }
            }
        }, 1000); // Run every second
    }, [isAnalyzing, isCameraOn, analyzeImage, resetCalculator]);

    // Helper to update status message based on state
    const updateStatusMessage = useCallback(() => {
        const { state, detected_class } = analysisResult;
        if (!state) return;

        if (detected_class === 'Start') {
            setStatusMessage("System reset! Starting fresh calculation...");
            return;
        }
        if (detected_class === 'Undefined') {
            setStatusMessage("Gesture not recognized. Please try again.");
            return;
        }

        switch (state.current_state) {
            case "WAIT_FIRST_NUM":
                setStatusMessage("Please show the first number (0-9).");
                break;
            case "WAIT_OPERATOR":
                setStatusMessage(`Got it: ${state.number_1}. Now show an operator.`);
                break;
            case "WAIT_SECOND_NUM":
                setStatusMessage(`OK: ${state.number_1} ${state.operator}. Now show the second number.`);
                break;
            case "SHOWING_RESULT":
                setStatusMessage(`Calculation complete! Result: ${state.result}. Click 'Reset' to start over.`);
                break;
            default:
                setStatusMessage("Ready to start.");
        }
    }, [analysisResult]);

    useEffect(() => {
        updateStatusMessage();
    }, [analysisResult, updateStatusMessage]);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
            }
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Helper to get dynamic class for UI boxes
    const getBoxClass = (boxName) => {
        const currentState = analysisResult.state?.current_state;
        let isActive = false;
        if (boxName === 'number_1' && currentState === 'WAIT_FIRST_NUM') isActive = true;
        if (boxName === 'operator' && currentState === 'WAIT_OPERATOR') isActive = true;
        if (boxName === 'number_2' && currentState === 'WAIT_SECOND_NUM') isActive = true;
        return `p-4 rounded-lg transition-all text-center ${isActive ? 'bg-blue-700' : 'bg-gray-800'}`;
    };

    return (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            {/* Left Panel: Camera and Controls */}
            <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="w-full flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Gesture Calculator</h1>
                    <button onClick={() => onNavigate('home')} className="text-sm text-blue-400 hover:text-blue-300">
                        &larr; Back to Home
                    </button>
                </div>
                
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                    ></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                        onClick={isCameraOn ? stopCamera : startCamera} 
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                    >
                        {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                    </button>
                    
                    <button 
                        onClick={startAnalysis} 
                        disabled={!isCameraOn || isAnalyzing}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:bg-gray-500"
                    >
                        {isAnalyzing ? `Analyzing... (${analysisTime}s)` : 'Capture & Analyze'}
                    </button>
                    
                    <button 
                        onClick={resetCalculator} 
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                    >
                        Reset
                    </button>
                </div>
                
                {isAnalyzing && (
                    <div className="w-full mt-4 bg-gray-900 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${(analysisTime / 3) * 100}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Right Panel: Results */}
            <div className="flex flex-col justify-center bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Calculation</h2>
                
                <div className="status-message bg-gray-700 p-3 rounded-lg mb-6">
                    <p className="text-lg text-center font-mono">{statusMessage}</p>
                </div>
                
                <div className="calculation-display flex items-center justify-center space-x-2 md:space-x-4 text-3xl md:text-5xl font-mono mb-6">
                    <span className={getBoxClass('number_1')}>
                        {analysisResult.state?.number_1 ?? '_'}
                    </span>
                    <span className={getBoxClass('operator')}>
                        {analysisResult.state?.operator ?? '_'}
                    </span>
                    <span className={getBoxClass('number_2')}>
                        {analysisResult.state?.number_2 ?? '_'}
                    </span>
                    <span className="mx-2">=</span>
                    <span className="p-4 rounded-lg bg-gray-800 text-center">
                        {analysisResult.state?.result ?? '_'}
                    </span>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                    <p>Last Detected: <span className="font-bold text-green-400">
                        {analysisResult.detected_class ?? 'None'}
                    </span></p>
                    <p>Current State: <span className="font-bold text-yellow-400">
                        {analysisResult.state?.current_state ?? 'N/A'}
                    </span></p>
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
// Import sign language images
import signImage1 from '../assets/signs/number_1.png';
import signImage5 from '../assets/signs/number_5.png';
import operatorPlus from '../assets/signs/operator_tambah.png';
// Import the 3D hand image
import handImage3D from '../assets/img/3d_hand.png';

const HomePage = ({ onNavigate }) => {
    const [activeImage, setActiveImage] = useState(0);
    // Include the 3D hand image in the demo images array
    const demoImages = [handImage3D, signImage1, operatorPlus, signImage5];
    
    // Cycle through demo images every few seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % demoImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [demoImages]);
    
    return (
        <div className="min-h-screen h-full w-full bg-[#131b2e] text-white overflow-hidden flex flex-col">
            {/* Navigation Bar */}
            <Header onNavigate={onNavigate} />

            {/* Main Content - Using flex-grow to fill available space */}
            <div className="flex-grow flex flex-col md:flex-row w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
                {/* Left Content */}
                <div className="w-full md:w-1/2 md:pr-6 lg:pr-12 xl:pr-16 mb-8 md:mb-0 flex flex-col justify-center">
                    <div className="inline-flex items-center mb-3 sm:mb-4 text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm sm:text-base">AI-Powered Calculator</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                        SignEd Sign<br />
                        <span className="text-blue-400">Language</span><br />
                        Calculator
                    </h1>
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-6 sm:mb-8 max-w-xl">
                        Sebuah aplikasi web inovatif berbasis kecerdasan buatan (AI)
                        yang dirancang untuk membantu penyandang tunarungu
                        dalam mempelajari matematika dasar secara interaktif.
                        Aplikasi ini menggunakan model YOLOv11 untuk deteksi
                        gestur tangan yang merepresentasikan angka dan
                        operasi aritmatika.
                    </p>
                    <button 
                        onClick={() => onNavigate('calculator')}
                        className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300"
                    >
                        Coba Sekarang
                    </button>
                </div>
                
                {/* Right Content - Image Area */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="w-full max-w-lg">
                        {/* Main camera view with aspect ratio preservation */}
                        <div className="w-full aspect-video bg-[#1a2338] rounded-xl overflow-hidden flex items-center justify-center shadow-md relative">
                            {/* Display the demo images with a gradient background */}
                            <div className="w-full h-full bg-gradient-to-r from-[#1a2338] to-[#252e4a] flex items-center justify-center">
                                <img 
                                    src={demoImages[activeImage]}
                                    alt={`Sign Language Demo ${activeImage + 1}`} 
                                    className="h-3/4 object-contain"
                                />
                            </div>
                            
                            {/* Camera frame overlay */}
                            <div className="absolute inset-0 border border-blue-500/30 rounded-xl pointer-events-none"></div>
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center bg-[#131b2e]/70 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 mr-1 sm:mr-2 animate-pulse"></span>
                                <span className="text-white text-xs sm:text-sm">Recording</span>
                            </div>
                        </div>
                        
                        {/* Detection Status */}
                        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-4">
                            <div className="bg-[#1a2338] p-3 sm:p-4 rounded-xl">
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">Status</p>
                                <div className="flex items-center">
                                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-400 mr-1.5 sm:mr-2"></span>
                                    <p className="text-white text-sm sm:text-base">Deteksi Siap</p>
                                </div>
                            </div>
                            <div className="bg-[#1a2338] p-3 sm:p-4 rounded-xl">
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">Kamera</p>
                                <p className="text-white text-sm sm:text-base">Webcam Default</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - optional for proper spacing on very large screens */}
            <div className="py-4"></div>
        </div>
    );
};

export default HomePage;
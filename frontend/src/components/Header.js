import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/img/SignEd_logo.png';

const Header = ({ onNavigate }) => {
    const { logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const handleLogout = () => {
        logout();
        onNavigate('landing');
    };

    return (
        <nav className="w-full px-4 sm:px-8 md:px-12 py-4 sm:py-6 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logoImage} alt="SignEd Logo" className="h-8 sm:h-10 mr-2" />
                <span className="text-lg sm:text-xl font-bold text-yellow-400">SignEd.</span>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex ml-6 lg:ml-12 xl:ml-16 space-x-6 lg:space-x-8 xl:space-x-12">
                    <button 
                        onClick={() => onNavigate('help')} 
                        className="text-white hover:text-yellow-300 transition-colors text-base lg:text-lg"
                    >
                        Panduan
                    </button>
                    <button 
                        className="text-white hover:text-yellow-300 transition-colors text-base lg:text-lg"
                    >
                        Tentang
                    </button>
                    {/* Tombol Predict Gesture */}
                    <button 
                        onClick={() => onNavigate('predictGesture')} 
                        className="text-white hover:text-yellow-300 transition-colors text-base lg:text-lg"
                    >
                        Predict Gesture
                    </button>
                </div>
            </div>
            
            {/* Desktop Logout */}
            <div className="hidden md:block">
                <button 
                    onClick={handleLogout}
                    className="px-4 sm:px-6 py-2 text-white hover:text-yellow-300 transition-colors text-base lg:text-lg"
                >
                    Logout
                </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-[#131b2e] border-t border-gray-700 md:hidden z-50">
                    <div className="flex flex-col space-y-4 px-4 py-5">
                        <button 
                            onClick={() => {
                                onNavigate('help');
                                setMobileMenuOpen(false);
                            }} 
                            className="text-white hover:text-yellow-300 transition-colors text-lg text-left"
                        >
                            Panduan
                        </button>
                        <button 
                            className="text-white hover:text-yellow-300 transition-colors text-lg text-left"
                        >
                            Tentang
                        </button>
                        {/* Tombol Predict Gesture untuk mobile */}
                        <button 
                            onClick={() => {
                                onNavigate('predictGesture');
                                setMobileMenuOpen(false);
                            }} 
                            className="text-white hover:text-yellow-300 transition-colors text-lg text-left"
                        >
                            Predict Gesture
                        </button>
                        <button 
                            onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                            }}
                            className="text-white hover:text-yellow-300 transition-colors text-lg text-left"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
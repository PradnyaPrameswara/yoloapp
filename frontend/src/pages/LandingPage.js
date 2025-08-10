import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/img/SignEd_logo.png';

const LandingPage = ({ onNavigate }) => {
    const { login, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        
        try {
            setLoading(true);
            await login(username, password);
            onNavigate('home');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login initiated');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle mobile view state
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showMobileForm, setShowMobileForm] = useState(false);

    // Add resize listener for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setShowMobileForm(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen h-screen w-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left Side - Dark Background */}
            <div className={`${isMobileView && showMobileForm ? 'hidden' : 'flex'} w-full md:w-1/2 bg-gray-900 text-white flex-col items-center justify-center p-6 sm:p-8 md:p-12 h-full`}>
                <div className="w-full max-w-md lg:max-w-lg">
                    <div className="flex items-center mb-8 md:mb-12">
                        <div className="rounded-md overflow-hidden">
                            <img src={logoImage} alt="SignEd Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-white font-bold text-xl ml-2">SignEd.</span>
                        <span className="text-blue-500 ml-2">•</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4 sm:mb-6 animate-fade-in">
                        Welcome.
                    </h1>
                    <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-light leading-relaxed">
                        Start your journey<br />
                        with our sign language<br />
                        calculator system!
                    </p>
                    
                    <div className="mt-8 sm:mt-10 md:mt-12 space-y-4">
                        {isAuthenticated ? (
                            <button 
                                onClick={() => onNavigate('home')}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg"
                            >
                                Go to Dashboard
                            </button>
                        ) : (
                            <button 
                                onClick={() => isMobileView ? setShowMobileForm(true) : null}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg"
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - White Background with Sign In Form */}
            <div className={`${isMobileView && !showMobileForm ? 'hidden' : 'flex'} w-full md:w-1/2 bg-white flex-col items-center justify-center p-6 sm:p-8 md:p-12 h-full overflow-y-auto`}>
                {isMobileView && (
                    <button 
                        onClick={() => setShowMobileForm(false)}
                        className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
                
                <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
                        Sign In
                    </h2>
                    
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-800 rounded-lg text-sm">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Username  
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base text-black"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Password  
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base text-black"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors duration-300 hover:shadow-md text-sm sm:text-base"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="text-center pt-4">
                            <span className="text-sm text-gray-500">Don't have an account? </span>
                            <button
                                type="button"
                                onClick={() => onNavigate('register')}
                                className="text-sm text-blue-500 font-medium hover:text-blue-600"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="relative flex items-center justify-center my-5 sm:my-6">
                        <div className="absolute border-t border-gray-300 w-full"></div>
                        <div className="bg-white px-3 sm:px-4 relative text-xs sm:text-sm text-gray-500">or</div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white hover:bg-gray-50 text-gray-700 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-300 mb-6 sm:mb-8 border border-gray-300 text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/img/SignEd_logo.png';

const Login = ({ navigateTo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(username, password);
      
      // Navigate to home after successful login
      navigateTo('home');
    } catch (error) {
      setError('Failed to log in. ' + (error.message || 'Please check your credentials and try again.'));
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Logo - Responsive positioning */}
      <div className="fixed top-4 sm:top-6 left-4 sm:left-6 z-10">
        <div className="flex items-center">
          <div className="rounded-md overflow-hidden">
            <img src={logoImage} alt="SignEd Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
          </div>
          <span className="text-white font-bold text-lg sm:text-xl ml-2">SignEd.</span>
          <span className="text-blue-500 ml-2">•</span>
        </div>
      </div>

      {/* Main Content - Responsive centered layout */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6">
        <div 
          className="bg-[#1a212e] rounded-[20px] shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-[540px] min-h-[400px] sm:min-h-[430px] md:min-h-[456px] px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-[72px] lg:py-[48px]"
        >
          <div className="h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-white">
                Login to your account
              </h2>
            </div>
            
            {/* Form Section */}
            <div className="flex-1 flex flex-col justify-center py-4 sm:py-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-4 sm:mb-6 text-xs sm:text-sm" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none bg-white relative block w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-400">
                        Password
                      </label>
                      <button 
                        type="button"
                        className="text-xs sm:text-sm text-blue-500 hover:text-blue-400 transition-colors"
                        onClick={() => navigateTo('forgot-password')}
                      >
                        Forgot ?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="appearance-none bg-white relative block w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                            <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 sm:py-3.5 px-4 border border-transparent rounded-md shadow-sm text-white text-sm sm:text-base font-medium bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Signing in...' : 'Login now'}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-400 text-xs sm:text-base">
                Don't Have An Account?{' '}
                <button 
                  onClick={() => navigateTo('register')}
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                  type="button"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
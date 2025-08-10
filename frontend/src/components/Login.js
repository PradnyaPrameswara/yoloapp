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
      {/* Logo - Fixed at top left corner using fixed positioning */}
      <div className="fixed top-6 left-6">
        <div className="flex items-center">
          <div className="rounded-md overflow-hidden">
            <img src={logoImage} alt="SignEd Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-white font-bold text-xl ml-2">SignEd.</span>
          <span className="text-blue-500 ml-2">•</span>
        </div>
      </div>

      {/* Main Content - Centered on page */}
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="bg-[#1a212e] rounded-[20px] shadow-xl"
          style={{
            width: '540px',
            height: '456px',
            padding: '48px 72px'
          }}
        >
          <div className="h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-white">
                Login to your account
              </h2>
            </div>
            
            {/* Form Section */}
            <div className="flex-1 flex flex-col justify-center">
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-6" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none bg-white relative block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                        Password
                      </label>
                      <button 
                        type="button"
                        className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
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
                        className="appearance-none bg-white relative block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                            <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md shadow-sm text-white text-base font-medium bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Signing in...' : 'Login now'}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-400">
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
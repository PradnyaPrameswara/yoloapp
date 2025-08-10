import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/img/SignEd_logo.png';

const Register = ({ navigateTo }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    
    // Validate input fields
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    if (!validateUsername(username)) {
      setError('Username must be 3-20 characters and may only contain letters, numbers, and underscores');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register(username, email, password);
      
      // Navigate to login after successful registration
      navigateTo('login');
      
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Logo - Fixed at top left corner */}
      <div className="fixed top-6 left-6">
        <div className="flex items-center">
          <div className="rounded-md overflow-hidden">
            <img src={logoImage} alt="SignEd Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-white font-bold text-xl ml-2">SignEd.</span>
          <span className="text-blue-500 ml-2">•</span>
        </div>
      </div>

      {/* Main Content - Centered on page with wider and taller layout */}
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="bg-[#1a212e] rounded-[20px] shadow-xl"
          style={{
            width: '580px', // Layout lebih lebar
            height: '540px', // Layout lebih tinggi (dari 500px menjadi 540px)
            padding: '40px 70px'
          }}
        >
          <div className="h-full flex flex-col justify-between"> {/* Menambahkan justify-between */}
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-white">
                Create an account
              </h2>
            </div>
            
            {/* Content */}
            <div className="flex-1 flex flex-col">
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-300 px-3 py-2 rounded-md mb-3 text-sm" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              {/* Social Sign-in Buttons */}
              <div className="flex gap-3 mb-4">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-gray-100 text-gray-800 rounded-md transition-colors text-sm font-medium"
                  onClick={() => alert('Google sign in not implemented')}
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                  </svg>
                  Google
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-gray-100 text-gray-800 rounded-md transition-colors text-sm font-medium"
                  onClick={() => alert('Facebook sign in not implemented')}
                >
                  <svg className="w-4 h-4" fill="#1877F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                  </svg>
                  Facebook
                </button>
              </div>
              
              {/* Divider */}
              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute border-t border-gray-600 w-full"></div>
                <div className="relative bg-[#1a212e] px-3 text-sm text-gray-400">Or</div>
              </div>
              
              {/* Form */}
              <form className="flex-1 flex flex-col" onSubmit={handleSubmit}>
                <div className="space-y-3 mb-5 flex-1">
                  {/* Username field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none bg-white relative block w-full px-3 py-2.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none bg-white relative block w-full px-3 py-2.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  {/* Password field */}
                  <div className="relative">
                    <div className="mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="appearance-none bg-white relative block w-full px-3 py-2.5 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                            <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : 'Create account'}
                </button>
              </form>
            </div>
            
            {/* Footer - Dipisahkan dari form dan diletakkan di bagian bawah container */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already Have An Account?{' '}
                <button 
                  onClick={() => navigateTo('login')}
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                  type="button"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
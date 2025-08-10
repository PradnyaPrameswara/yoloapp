import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      // Check if token has expired
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
        console.log('Token has expired');
        logout();
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:8001/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
          // If token is invalid, logout
          console.log('Invalid token response:', response.status);
          logout();
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        logout();
      }

      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      // Return success but don't login automatically
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      // FormData is required for OAuth2 password flow
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const { access_token } = data;

      if (!access_token) {
        throw new Error('No access token received');
      }

      // Store token in local storage with expiration timestamp (1 hour)
      const expiresAt = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem('token', access_token);
      localStorage.setItem('tokenExpiry', expiresAt.toString());
      setToken(access_token);

      // Fetch user data
      const userResponse = await fetch('http://localhost:8001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUser(userData);
        return { success: true, user: userData };
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;

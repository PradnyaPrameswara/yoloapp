import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import pages
import LandingPage from '../pages/LandingPage';
import HomePage from '../pages/HomePage';
import HelpPage from '../pages/HelpPage';
import CalculatorPage from '../pages/CalculatorPage';
import Login from '../components/Login';
import Register from '../components/Register';

/**
 * Main app content component
 * Handles page navigation and auth state
 */
const AppContent = () => {
    const [page, setPage] = useState('landing'); // 'landing', 'home', 'help', 'calculator', 'login', 'register'
    const { loading, isAuthenticated } = useAuth();

    const navigateTo = (pageName) => {
        setPage(pageName);
    };

    useEffect(() => {
        // If user is authenticated and on a public page, redirect to home
        if (isAuthenticated && (page === 'landing' || page === 'login' || page === 'register')) {
            navigateTo('home');
        }
    }, [isAuthenticated, page]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="bg-gray-900 text-white min-h-screen w-full flex items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    const renderPage = () => {
        switch (page) {
            case 'login':
                return <Login navigateTo={navigateTo} />;
            case 'register':
                return <Register navigateTo={navigateTo} />;
            case 'home':
                // If not authenticated and trying to access protected page, redirect to login
                if (!isAuthenticated) {
                    return <Login navigateTo={navigateTo} />;
                }
                return <HomePage onNavigate={navigateTo} />;
            case 'help':
                if (!isAuthenticated) {
                    return <Login navigateTo={navigateTo} />;
                }
                return <HelpPage onNavigate={navigateTo} />;
            case 'calculator':
                if (!isAuthenticated) {
                    return <Login navigateTo={navigateTo} />;
                }
                return <CalculatorPage onNavigate={navigateTo} />;
            case 'landing':
            default:
                return <LandingPage onNavigate={navigateTo} />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen w-full flex flex-col items-center justify-center font-sans p-4">
            {renderPage()}
        </div>
    );
};

export default AppContent;

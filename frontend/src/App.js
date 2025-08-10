import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './components/AppContent';


/**
 * Main App component
 * Wraps the app with the authentication provider
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

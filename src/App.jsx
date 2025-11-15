import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import OnboardingPage from './components/OnboardingPage';
import SimulatorPage from './components/SimulatorPage';
import PaymentPage from './components/PaymentPage';
import FeedbackPage from './components/FeedbackPage';
import TavusConversationPage from './components/TavusConversationPage';
import { Toaster } from './components/ui/sonner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // For MVP, we'll use a simple mock user
        // In production, this would call the backend to verify the token
        setUser({
          id: 1,
          name: 'Usuario Demo',
          email: 'demo@salescoach.ai',
        });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <LandingPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              user ? <OnboardingPage user={user} /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/simulator" 
            element={
              user ? <SimulatorPage user={user} /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/conversation" 
            element={
              user ? <TavusConversationPage user={user} /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/payment" 
            element={
              user ? <PaymentPage user={user} /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/feedback" 
            element={
              user ? <FeedbackPage user={user} /> : <Navigate to="/" replace />
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;

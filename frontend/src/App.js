import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './config/supabase';
import HomePage from './components/Landing/HomePage';
import Pricing from './components/Auth/Pricing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import UpgradePage from './components/Dashboard/UpgradePage';
import SharedDashboard from './components/Dashboard/SharedDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!session ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/pricing" element={!session ? <Pricing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/pricing" />} />
        <Route path="/upgrade" element={session ? <UpgradePage /> : <Navigate to="/pricing" />} />
        <Route path="/shared/:shareId" element={<SharedDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

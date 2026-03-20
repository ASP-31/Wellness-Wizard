// client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProfileForm from './components/Onboarding/ProfileForm';
import Dashboard from './pages/Dashboard';
import History from './pages/HistoryPage';

import DailyProgress from './components/Dashboard/DailyProgress';
import ImageUpload from './components/Dashboard/ImageUpload';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));

  const handleAuth = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {user && <Navbar user={user} onLogout={() => { localStorage.removeItem('userInfo'); setUser(null); }} />}

        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={!user ? <Login onAuth={handleAuth} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup onAuth={handleAuth} /> : <Navigate to="/onboarding" />} />

          {/* Onboarding: Only if user has no goals/allergies set yet */}
          <Route path="/onboarding" element={user?.goals ? <Navigate to="/" /> : (user ? <ProfileForm user={user} onComplete={handleAuth} /> : <Navigate to="/login" />)} />

          {/* Protected Main Pages */}
          <Route path="/" element={user?.goals ? <Dashboard user={user} /> : <Navigate to="/onboarding" />} />
          <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProfileForm from './components/Onboarding/ProfileForm';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import History from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';

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
      <div className="relative min-h-screen font-sans text-slate-800 selection:bg-blue-200">
        {/* Premium Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/30 rounded-full blur-[120px]"></div>
          <div className="absolute top-[30%] left-[50%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px]"></div>
        </div>

        {user && <Navbar user={user} onLogout={() => { localStorage.removeItem('userInfo'); setUser(null); }} />}

        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={!user ? <Login onAuth={handleAuth} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup onAuth={handleAuth} /> : <Navigate to="/onboarding" />} />

          {/* Onboarding: Only if user has no goals/allergies set yet */}
          <Route path="/onboarding" element={user?.goals?.calories ? <Navigate to="/" /> : (user ? <ProfileForm user={user} onComplete={handleAuth} /> : <Navigate to="/login" />)} />

          {/* Protected Main Pages */}
          <Route path="/" element={user ? (user?.goals?.calories ? <Dashboard user={user} /> : <Navigate to="/onboarding" />) : <LandingPage />} />
          <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} onComplete={handleAuth} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
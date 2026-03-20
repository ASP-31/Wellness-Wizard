// client/src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wand2, History, LayoutDashboard, LogOut, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-6 z-50 mx-4 md:mx-auto max-w-6xl mb-10 mt-6 lg:mt-8">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-blue-900/5 h-20 px-6 md:px-8 rounded-[2rem] flex justify-between items-center transition-all duration-500 hover:bg-white/80 hover:shadow-blue-900/10">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
            <Wand2 className="text-white" size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            WELLNESS WIZARD
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/history" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition">
            <History size={18} /> History
          </Link>
          <Link to="/profile" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition">
            <User size={18} /> Profile
          </Link>
          
          <div className="hidden md:block h-8 w-[2px] bg-slate-200/50 mx-2"></div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pro Member</p>
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
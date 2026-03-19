// client/src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wand2, History, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-20 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Wand2 className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800">WELLNESS WIZARD</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-blue-600 transition">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/history" className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-blue-600 transition">
            <History size={18} /> History
          </Link>
          
          <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-slate-400 uppercase">Pro User</p>
              <p className="text-sm font-bold text-slate-700">{user.name}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
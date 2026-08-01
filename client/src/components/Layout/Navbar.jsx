import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wand2, History, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'History Vault', path: '/history', icon: History },
    { name: 'Profile Metrics', path: '/profile', icon: User },
  ];

  return (
    <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-6xl mb-6 mt-4 lg:mt-6">
      <div className="bg-white/80 backdrop-blur-3xl border border-white/60 shadow-2xl shadow-blue-900/10 h-20 px-6 md:px-8 rounded-[2.5rem] flex justify-between items-center transition-all duration-300">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
            <Wand2 className="text-white" size={22} />
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800">
            WELLNESS WIZARD
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} /> {link.name}
              </Link>
            );
          })}
        </div>

        {/* User Badge & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Pro Member</p>
            <p className="text-xs font-extrabold text-slate-800">{user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 text-slate-700 bg-slate-100 rounded-2xl"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 bg-white/95 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-slate-100 space-y-2"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} /> {link.name}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 py-1.5 px-3 bg-rose-50 rounded-xl"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
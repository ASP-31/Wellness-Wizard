import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = ({ onAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/user/login', formData);
      onAuth(data); // Stores token and goals in App.jsx state
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left split - Gradient Art */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="bg-white/20 p-4 rounded-2xl inline-block mb-6 backdrop-blur-sm border border-white/10 shadow-xl">
            <LogIn size={40} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-300">Wellness Wizard</span></h1>
          <p className="text-xl text-blue-100 font-medium leading-relaxed">
            Your personal AI nutritionist awaits. Log in to track your macros, analyze your meals, and crush your goals.
          </p>
        </motion.div>
      </div>

      {/* Right split - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
            <LogIn className="text-white" />
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Sign In</h2>
          <p className="text-slate-500 mb-8 font-medium">Continue your wellness journey today.</p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full p-4 mt-6 flex items-center justify-center gap-2 font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 group"
            >
              {isLoading ? 'Authenticating...' : 'Enter Vault'}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline underline-offset-4">
              Sign up 🚀
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
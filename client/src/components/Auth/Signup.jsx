import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = ({ onAuth }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/user/signup', formData);
      onAuth(data); // Passes user data + token to App.jsx
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 flex-row-reverse">
      {/* Right split - Gradient Art */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-10 right-20 w-96 h-96 bg-lime-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="bg-white/20 p-4 rounded-2xl inline-block mb-6 backdrop-blur-sm border border-white/10 shadow-xl">
            <UserPlus size={40} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-200 to-emerald-200">Transformation</span></h1>
          <p className="text-xl text-teal-100 font-medium leading-relaxed">
            Join thousands of users demystifying their nutrition with AI precision. Your personalized macro dashboard is just seconds away.
          </p>
        </motion.div>
      </div>

      {/* Left split - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden bg-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-teal-200">
            <UserPlus className="text-white" />
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mb-8 font-medium">Join us and snap your way to health.</p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username / Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-teal-500 focus:bg-white transition-all font-medium" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-teal-500 focus:bg-white transition-all font-medium" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-teal-500 focus:bg-white transition-all font-medium" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full p-4 mt-8 flex items-center justify-center gap-2 font-bold text-white bg-slate-900 hover:bg-teal-600 rounded-2xl shadow-xl hover:shadow-teal-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 group"
            >
              {isLoading ? 'Creating Magic...' : 'Sign Up 🚀'}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:underline underline-offset-4">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
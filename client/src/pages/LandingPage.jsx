import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Zap, Activity, Wand2, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Landing Page specific header */}
      <header className="px-6 md:px-12 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
            <Wand2 className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800">
            WELLNESS WIZARD
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="hidden sm:flex bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 text-center z-10 pt-10 pb-20">
        
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-blue-100 shadow-sm mb-8 text-blue-700 font-bold text-sm">
          <Sparkles size={16} className="text-blue-500" />
          <span>The Next Generation of Macro Tracking</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 max-w-4xl leading-tight">
          Don't Track Macros.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Let the AI See Them.
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl leading-relaxed">
          Snap a photo of your meal. The Wizard's vision AI instantly calculates calories, proteins, carbs, and fats. Reach your dietary goals effortlessly without manual entry.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/signup" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-black shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 group">
            Start Your Journey <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold shadow-lg border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all">
            I already have an account
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-white/50 py-24 relative z-10 w-full mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform">
              <Camera className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Vision AI Scanning</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Upload any meal photo. Our advanced models break down precise ingredient estimates and caloric density instantly.</p>
          </div>

          <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
              <Zap className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Dynamic Goals</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Set your diet preference (Keto, Balanced, etc.) and your activity level. The Wizard calculates tailored daily macros for you.</p>
          </div>

          <div className="bg-purple-50/50 p-8 rounded-3xl border border-purple-100 hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6">
              <Activity className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Journey Vault</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Save all your scans historically. Export your entire nutritional history to CSV with one click for coaches or doctors.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;

// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import DailyProgress from '../components/Dashboard/DailyProgress';
import ImageUpload from '../components/Dashboard/ImageUpload';
import { LayoutDashboard, Utensils, Sparkles } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayScans = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/user/${user._id}/history`, config);
        // Filter for today's date on the frontend for real-time UI
        const today = new Date().setHours(0,0,0,0);
        setScans(data.filter(s => new Date(s.createdAt) >= today));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTodayScans();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="max-w-6xl mx-auto p-4 md:p-8"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 p-3 rounded-2xl">
          <LayoutDashboard className="text-indigo-600" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Daily Overview</h1>
          <p className="text-slate-500 font-medium">Tracking your progress toward your AI goals.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Progress & Upload */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div variants={itemVariants}>
            <DailyProgress scans={scans} goals={user.goals} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10 text-slate-800">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <Utensils className="text-emerald-600" size={20} />
              </div>
              <h2 className="text-xl font-bold">Identify Meal</h2>
            </div>
            <ImageUpload userId={user._id} onAnalysisComplete={(newScan) => setScans([newScan, ...scans])} />
          </motion.div>
        </div>

        {/* Right Side: Quick Stats */}
        <motion.div variants={itemVariants} className="lg:col-span-5 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-blue-100">
              <Sparkles size={24} />
              <h3 className="text-xl font-black tracking-tight">Wizard Insight</h3>
            </div>
            <p className="text-lg font-medium leading-relaxed drop-shadow-sm">
              You are currently targeting a <strong className="text-white bg-white/20 px-2 py-1 rounded-lg">{user.preference}</strong> setup. 
              {user.preference === 'Keto' ? " Focus strictly on high-fat proteins today to stay deep in ketosis!" : " Try to spread your complex carbs evenly across meals for sustained energy!"}
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-inner">
            <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-2">Dietary Restrictions</p>
            <p className="text-2xl font-black drop-shadow-md">
              {user.allergies ? `Avoid: ${user.allergies}` : 'No Allergies Flagged ✨'}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
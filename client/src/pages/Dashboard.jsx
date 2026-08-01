import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import DailyProgress from '../components/Dashboard/DailyProgress';
import SmartScanner from '../components/Dashboard/SmartScanner';
import MacroAnalytics from '../components/Dashboard/MacroAnalytics';
import ScanDetailModal from '../components/Dashboard/ScanDetailModal';
import { LayoutDashboard, Sparkles, Utensils, History, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    const fetchTodayScans = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/user/${user._id}/history`, config);
        setScans(data);
      } catch (err) {
        console.error("Fetch Today Scans Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayScans();
  }, [user]);

  // Today's scans only for daily progress
  const todayStart = new Date().setHours(0,0,0,0);
  const todayScans = scans.filter(s => new Date(s.createdAt) >= todayStart);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 space-y-8"
    >
      {/* Top Banner */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3.5 rounded-2xl text-white shadow-lg shadow-blue-500/25">
            <LayoutDashboard size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Daily Dashboard</h1>
            <p className="text-slate-500 font-medium text-sm">Welcome back, {user.name}! Let's optimize your nutrition today.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">
            {user.preference || 'Balanced'} Mode
          </span>
        </div>
      </motion.div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Smart Scanner & Daily Progress */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div variants={itemVariants}>
            <SmartScanner userId={user._id} onAnalysisComplete={(newScan) => setScans([newScan, ...scans])} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DailyProgress scans={todayScans} goals={user.goals} />
          </motion.div>
        </div>

        {/* Right Column: AI Insight & Recent Meals */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          {/* AI Insight Card */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-blue-100">
                <Sparkles size={20} className="text-cyan-300 animate-pulse" />
                <h3 className="text-lg font-black tracking-tight drop-shadow-md">AI Nutritionist Insight</h3>
              </div>
              <p className="text-sm font-medium leading-relaxed drop-shadow-sm text-blue-50">
                {user.preference === 'Keto' 
                  ? "Targeting Keto: Aim for high healthy fats (avocados, olive oil) and stay under 5% net carbs today!"
                  : user.preference === 'High Protein'
                  ? "High Protein Focus: Keep your amino acid synthesis high by spreading lean proteins across 3-4 key meals."
                  : "Balanced Macros: Ensure complex carbohydrates and fiber are paired with quality proteins for steady blood glucose levels."}
              </p>
            </div>

            <div className="relative z-10 mt-6 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Dietary Safety Check</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {user.allergies ? `Flagged: ${user.allergies}` : 'No Allergen Restrictions'}
              </p>
            </div>
          </motion.div>

          {/* Today's Scanned Feed */}
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white/60 flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 text-base tracking-tight flex items-center gap-2">
                <Utensils size={18} className="text-blue-600" /> Today's Logged Meals
              </h3>
              <Link to="/history" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3 flex-grow overflow-y-auto max-h-72">
              {todayScans.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-2xl mb-1">🥑</p>
                  <p className="text-xs font-semibold">No meals logged yet today.</p>
                  <p className="text-[10px]">Use the scanner on the left to capture your meal!</p>
                </div>
              ) : (
                todayScans.map((scan) => (
                  <div
                    key={scan._id}
                    onClick={() => setSelectedScan(scan)}
                    className="p-3.5 bg-slate-50 hover:bg-blue-50/60 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
                        {scan.imageUrl ? (
                          <img src={scan.imageUrl} alt={scan.foodName} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        ) : '🥗'}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">{scan.foodName}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{scan.macros?.calories || 0} kcal • {scan.macros?.protein || 0}g protein</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      scan.isHealthy ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {scan.isHealthy ? 'PASSED' : 'CAUTION'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Analytics Section */}
      <motion.div variants={itemVariants}>
        <MacroAnalytics scans={scans} goals={user.goals} />
      </motion.div>

      {/* Scan Detail Modal Popup */}
      {selectedScan && (
        <ScanDetailModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
      )}
    </motion.div>
  );
};

export default Dashboard;
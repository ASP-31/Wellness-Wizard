import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ChevronRight, Activity, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryPage = ({ user }) => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/user/${user._id}/history`, config);
        setScans(data);
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, [user]);

  const exportData = () => {
    if (scans.length === 0) return;
    const header = "Date\\tFood Name\\tCalories\\tCarbs\\tProtein\\tFats\\tVerdict\\n";
    const rows = scans.map(scan => {
      const date = new Date(scan.createdAt).toLocaleDateString();
      const verdict = scan.isHealthy ? 'PASSED' : 'CAUTION';
      return `${date}\\t${scan.foodName}\\t${scan.macros?.calories || 0}\\t${scan.macros?.carbs || 0}\\t${scan.macros?.protein || 0}\\t${scan.macros?.fats || 0}\\t${verdict}`;
    }).join('\\n');
    
    const content = header + rows;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Nutrition_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto py-12 px-6">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-2xl border border-blue-200/50 shadow-inner">
            <Activity className="text-blue-600" size={28} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Scan Vault</h1>
        </div>
        
        {scans.length > 0 && (
          <button 
            onClick={exportData}
            className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95"
          >
            <Download size={18} /> Export Report
          </button>
        )}
      </motion.div>

      <div className="space-y-5">
        {scans.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold shadow-sm">
            <div className="text-4xl mb-4">🍽️</div>
            No meals scanned yet. Your journey begins today!
          </motion.div>
        ) : (
          scans.map((scan) => (
            <motion.div variants={itemVariants} key={scan._id} className="bg-white/80 backdrop-blur-3xl p-5 rounded-3xl shadow-sm border border-slate-100/60 flex gap-5 items-center hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300 group">
              {/* Image Preview */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 flex-shrink-0 relative shadow-inner">
                {scan.imageUrl ? (
                  <img src={scan.imageUrl} alt={scan.foodName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">🥗</div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-blue-900 transition-colors">{scan.foodName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-blue-600 font-black tracking-wide uppercase">{scan.macros.calories} kcal</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">{new Date(scan.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${scan.isHealthy ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-emerald-500/10' : 'bg-red-50 text-red-600 border border-red-100 shadow-red-500/10'} shadow-sm`}>
                {scan.isHealthy ? 'PASSED' : 'CAUTION'}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default HistoryPage;
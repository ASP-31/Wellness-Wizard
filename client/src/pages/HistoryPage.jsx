import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Download, Search, Trash2, Filter, Info, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScanDetailModal from '../components/Dashboard/ScanDetailModal';

const HistoryPage = ({ user }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'passed', 'caution', 'high-protein'
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [user._id]);

  const fetchHistory = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user/${user._id}/history`, config);
      setScans(data);
    } catch (err) {
      console.error("Fetch History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete single scan entry
  const handleDeleteScan = async (e, scanId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this meal record?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/user/${user._id}/history/${scanId}`, config);
      setScans(scans.filter(s => s._id !== scanId));
    } catch (err) {
      console.error("Delete Scan Error:", err);
    }
  };

  // Clear all scans
  const handleClearAll = async () => {
    if (!window.confirm("WARNING: This will permanently delete your entire scan vault history. Proceed?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/user/${user._id}/history/clear`, config);
      setScans([]);
    } catch (err) {
      console.error("Clear All History Error:", err);
    }
  };

  // CSV Export
  const exportCSV = () => {
    if (scans.length === 0) return;
    const headers = ["Date", "Food Name", "Calories (kcal)", "Carbs (g)", "Protein (g)", "Fats (g)", "Health Score", "Verdict"];
    const rows = scans.map(s => [
      `"${new Date(s.createdAt).toLocaleDateString()}"`,
      `"${s.foodName.replace(/"/g, '""')}"`,
      s.macros?.calories || 0,
      s.macros?.carbs || 0,
      s.macros?.protein || 0,
      s.macros?.fats || 0,
      s.healthScore || 80,
      s.isHealthy ? "PASSED" : "CAUTION"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Nutrition_Scan_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.foodName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterCategory === 'passed') return scan.isHealthy;
    if (filterCategory === 'caution') return !scan.isHealthy;
    if (filterCategory === 'high-protein') return (scan.macros?.protein || 0) >= 20;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto py-8 px-4 md:px-8 space-y-8">
      {/* Top Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Activity size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Meal History Vault</h1>
            <p className="text-slate-500 font-medium text-sm">Search, filter, inspect, and export your logged nutritional history</p>
          </div>
        </div>

        {scans.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Download size={16} /> Export CSV Report
            </button>
            <button
              onClick={handleClearAll}
              className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-100"
              title="Clear entire vault"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </motion.div>

      {/* Search Bar & Filter Tabs */}
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-3xl p-4 rounded-3xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meal by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'all' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({scans.length})
          </button>
          <button
            onClick={() => setFilterCategory('passed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'passed' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Passed ✨
          </button>
          <button
            onClick={() => setFilterCategory('caution')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'caution' ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Caution ⚠️
          </button>
          <button
            onClick={() => setFilterCategory('high-protein')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'high-protein' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            High Protein (20g+)
          </button>
        </div>
      </motion.div>

      {/* History Items Feed */}
      <div className="space-y-3">
        {filteredScans.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-20 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400 font-bold">
            <div className="text-4xl mb-3">🥗</div>
            <p className="text-sm font-black text-slate-700">No matching scans found.</p>
            <p className="text-xs text-slate-400 font-normal mt-1">Try adjusting your search query or category filters.</p>
          </motion.div>
        ) : (
          filteredScans.map((scan) => (
            <motion.div
              variants={itemVariants}
              key={scan._id}
              onClick={() => setSelectedScan(scan)}
              className="bg-white/80 backdrop-blur-3xl p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group"
            >
              {/* Left Section: Image & Title */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative shadow-inner">
                  {scan.imageUrl ? (
                    <img src={scan.imageUrl} alt={scan.foodName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🥗</div>
                  )}
                </div>

                <div className="truncate">
                  <h3 className="font-bold text-slate-800 text-base tracking-tight truncate group-hover:text-blue-600 transition-colors">
                    {scan.foodName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-black text-blue-600">{scan.macros?.calories || 0} kcal</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">{new Date(scan.createdAt).toLocaleDateString()}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400 font-medium">{scan.portionSize || '1 serving'}</span>
                  </div>
                </div>
              </div>

              {/* Right Section: Verdict & Delete */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                  scan.isHealthy ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {scan.isHealthy ? 'PASSED' : 'CAUTION'}
                </span>

                <button
                  onClick={(e) => handleDeleteScan(e, scan._id)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Delete scan entry"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Popup */}
      {selectedScan && (
        <ScanDetailModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
      )}
    </motion.div>
  );
};

export default HistoryPage;
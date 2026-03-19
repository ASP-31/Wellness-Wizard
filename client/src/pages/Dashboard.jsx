// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DailyProgress from '../components/Dashboard/DailyProgress';
import ImageUpload from '../components/Dashboard/ImageUpload';
import { LayoutDashboard, Utensils } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayScans = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/scans/history', config);
        // Filter for today's date on the frontend for real-time UI
        const today = new Date().setHours(0,0,0,0);
        setScans(data.filter(s => new Date(s.createdAt) >= today));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTodayScans();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-2 mb-8">
        <LayoutDashboard className="text-blue-600" />
        <h1 className="text-2xl font-black">Daily Overview</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Progress & Upload */}
        <div className="lg:col-span-7 space-y-6">
          <DailyProgress scans={scans} goals={user.goals} />
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <Utensils size={20} />
              <h2 className="font-bold">Identify Meal</h2>
            </div>
            <ImageUpload userId={user._id} onAnalysisComplete={(newScan) => setScans([newScan, ...scans])} />
          </div>
        </div>

        {/* Right Side: Quick Stats */}
        <div className="lg:col-span-5 bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
          <h3 className="text-lg font-bold mb-4">Wizard Tip 🧙‍♂️</h3>
          <p className="text-blue-100 leading-relaxed">
            Based on your <strong>{user.preference}</strong> settings, try to keep your 
            protein intake consistent throughout the day to maintain muscle mass!
          </p>
          <div className="mt-8 pt-8 border-t border-blue-500/30">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Current Focus</p>
            <p className="text-2xl font-black mt-1">{user.allergies ? `Avoid: ${user.allergies}` : 'No Allergies Flagged'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
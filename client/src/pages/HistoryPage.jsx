import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ChevronRight, Activity } from 'lucide-react';

const HistoryPage = ({ user }) => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/scans/history', config);
        setScans(data);
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center gap-3 mb-10">
        <Activity className="text-blue-600" size={32} />
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Scan Vault</h1>
      </div>

      <div className="space-y-4">
        {scans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
            No meals scanned yet. Start your journey!
          </div>
        ) : (
          scans.map((scan) => (
            // Inside your scans.map() loop
            <div key={scan._id} className="bg-white p-4 rounded-3xl shadow-sm border flex gap-4 items-center">
              {/* Image Preview */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                {scan.imageUrl ? (
                  <img src={scan.imageUrl} alt={scan.foodName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🥗</div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className="font-bold text-slate-800">{scan.foodName}</h3>
                <p className="text-xs text-blue-600 font-bold">{scan.macros.calories} kcal</p>
              </div>

              <div className={`px-3 py-1 rounded-full text-[10px] font-black ${scan.isHealthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {scan.isHealthy ? 'PASSED' : 'CAUTION'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
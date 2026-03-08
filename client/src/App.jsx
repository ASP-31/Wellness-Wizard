import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from './components/ImageUpload';
import History from './components/History';
import DailyProgress from './components/DailyProgress';

function App() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Using your verified Test User ID from previous scans
  const testUserId = "69ac54ce7d6d9f31b8b2f102"; 
  const userGoals = { calories: 2200, protein: 150, carbs: 50, fats: 160 };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Ensure your backend is running on port 5000
        const res = await axios.get(`/api/user/${testUserId}/history`);
        setScans(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleNewScan = (newScan) => {
    setScans((prev) => [newScan, ...prev]); // Add new scan to top
  };

  if (loading) return <div className="p-20 text-center font-bold">Connecting to MEC Backend...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-black text-blue-700">AI MACRO VISION</h1>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-400">USER PROFILE</p>
          <p className="text-sm font-semibold text-gray-700">Arjun (MEC)</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <DailyProgress scans={scans} goals={userGoals} />
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Scan Food</h2>
            <ImageUpload userId={testUserId} onAnalysisComplete={handleNewScan} />
          </div>
        </div>
        <div className="lg:col-span-5">
          <History scans={scans} />
        </div>
      </div>
    </div>
  );
}

export default App;
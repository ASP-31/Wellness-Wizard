import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PieChart as ChartIcon, TrendingUp, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#10B981', '#F59E0B', '#8B5CF6']; // Green (Protein), Orange (Carbs), Purple (Fats)

const MacroAnalytics = ({ scans = [], goals = {} }) => {
  // Calculate today's totals
  const todayTotals = scans.reduce((acc, scan) => ({
    calories: acc.calories + (scan.macros?.calories || 0),
    protein: acc.protein + (scan.macros?.protein || 0),
    carbs: acc.carbs + (scan.macros?.carbs || 0),
    fats: acc.fats + (scan.macros?.fats || 0),
    fiber: acc.fiber + (scan.micros?.fiber || 0),
    healthScores: [...acc.healthScores, scan.healthScore || 80]
  }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, healthScores: [] });

  const avgHealthScore = todayTotals.healthScores.length > 0 
    ? Math.round(todayTotals.healthScores.reduce((a, b) => a + b, 0) / todayTotals.healthScores.length)
    : 85;

  // Donut chart data
  const pieData = [
    { name: 'Protein (g)', value: Math.round(todayTotals.protein) },
    { name: 'Carbs (g)', value: Math.round(todayTotals.carbs) },
    { name: 'Fats (g)', value: Math.round(todayTotals.fats) }
  ];

  const hasData = pieData.some(d => d.value > 0);

  // Group scans by past 5 days for trend chart
  const getLast5DaysData = () => {
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayStart = new Date(d).setHours(0,0,0,0);
      const dayEnd = new Date(d).setHours(23,59,59,999);

      const dayScans = scans.filter(s => {
        const scanTime = new Date(s.createdAt).getTime();
        return scanTime >= dayStart && scanTime <= dayEnd;
      });

      const dayCals = dayScans.reduce((sum, s) => sum + (s.macros?.calories || 0), 0);
      days.push({ day: dateStr, calories: Math.round(dayCals), target: goals?.calories || 2000 });
    }
    return days;
  };

  const trendData = getLast5DaysData();

  return (
    <div className="bg-white/80 backdrop-blur-3xl p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white/60 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-500 to-indigo-600 p-3 rounded-2xl text-white shadow-md shadow-purple-500/20">
            <ChartIcon size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Macro Breakdown & Analytics</h2>
            <p className="text-xs text-slate-500 font-medium">Real-time ratio breakdown & 5-day calorie history</p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50 px-4 py-2 rounded-2xl">
          <Award className="text-emerald-600" size={18} />
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Health Index</p>
            <p className="text-sm font-black text-slate-800">{avgHealthScore} / 100</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Donut Chart: Macro Ratios */}
        <div className="lg:col-span-5 flex flex-col items-center bg-slate-50/60 p-4 rounded-3xl border border-slate-100 relative">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Today's Macro Split</h3>
          
          <div className="w-full h-56 relative flex items-center justify-center">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <Zap size={32} className="mx-auto mb-2 text-slate-300 animate-pulse" />
                <p className="text-xs font-bold">No meals logged yet today.</p>
                <p className="text-[10px]">Log a meal above to render your chart.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart: 5-Day Trend */}
        <div className="lg:col-span-7 bg-slate-50/60 p-4 rounded-3xl border border-slate-100">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-blue-500" /> 5-Day Calorie Burn Trend (kcal)
          </h3>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="calories" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroAnalytics;

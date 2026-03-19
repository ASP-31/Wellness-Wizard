import React from 'react';

const DailyProgress = ({ scans = [], goals }) => {
  // Calculate today's totals from the scan history
  const totals = scans.reduce((acc, scan) => ({
    calories: acc.calories + (scan.macros?.calories || 0),
    protein: acc.protein + (scan.macros?.protein || 0),
    carbs: acc.carbs + (scan.macros?.carbs || 0),
    fats: acc.fats + (scan.macros?.fats || 0)
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const Bar = ({ label, current, goal, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-black uppercase mb-1">
        <span>{label}</span>
        <span>{Math.round(current)} / {goal}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-700`} 
          style={{ width: `${Math.min((current/goal)*100, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-4">Daily Progress</h3>
      <Bar label="Calories" current={totals.calories} goal={goals?.calories || 2000} color="bg-blue-600" />
      <div className="grid grid-cols-3 gap-4">
        <Bar label="Prot" current={totals.protein} goal={goals?.protein || 150} color="bg-emerald-500" />
        <Bar label="Carb" current={totals.carbs} goal={goals?.carbs || 200} color="bg-orange-500" />
        <Bar label="Fat" current={totals.fats} goal={goals?.fats || 70} color="bg-indigo-500" />
      </div>
    </div>
  );
};

export default DailyProgress;
import React from 'react';

const DailyProgress = ({ scans, goals }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysScans = scans.filter(s => new Date(s.createdAt) >= today);

  const totals = todaysScans.reduce((acc, s) => ({
    calories: acc.calories + (s.macros.calories || 0),
    protein: acc.protein + (s.macros.protein || 0),
    carbs: acc.carbs + (s.macros.carbs || 0),
    fats: acc.fats + (s.macros.fats || 0)
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const Bar = ({ label, current, goal, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1 font-bold uppercase text-gray-500">
        <span>{label}</span>
        <span>{current} / {goal}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-700`} 
          style={{ width: `${Math.min((current/goal)*100, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6">Today's Summary</h2>
      <Bar label="Calories" current={totals.calories} goal={goals.calories} color="bg-blue-600" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400">PROTEIN</p>
          <p className="text-xl font-bold text-green-600">{totals.protein}g</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400">CARBS</p>
          <p className="text-xl font-bold text-orange-500">{totals.carbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400">FATS</p>
          <p className="text-xl font-bold text-red-500">{totals.fats}g</p>
        </div>
      </div>
    </div>
  );
};

export default DailyProgress;
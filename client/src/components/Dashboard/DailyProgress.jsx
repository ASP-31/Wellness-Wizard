import React from 'react';

const DailyProgress = ({ scans = [], goals }) => {
  // Calculate today's totals from the scan history
  const totals = scans.reduce((acc, scan) => ({
    calories: acc.calories + (scan.macros?.calories || 0),
    protein: acc.protein + (scan.macros?.protein || 0),
    carbs: acc.carbs + (scan.macros?.carbs || 0),
    fats: acc.fats + (scan.macros?.fats || 0)
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const Bar = ({ label, current, goal, gradient, bgShadow }) => {
    const isExceeded = current > goal;
    const color = isExceeded ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/50' : gradient;
    const percent = Math.min((current/goal)*100, 100) || 0;

    return (
      <div className="mb-5 group">
        <div className={`flex justify-between text-xs font-black uppercase mb-2 tracking-wide ${isExceeded ? 'text-red-500' : 'text-slate-500'}`}>
          <span>{label}</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">{Math.round(current)} / {goal}</span>
        </div>
        <div className="h-4 bg-slate-100/80 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${color} ${bgShadow} shadow-lg transition-all duration-1000 ease-out relative`} 
            style={{ width: `${percent}%` }}
          >
            {/* Shimmer effect inside the bar */}
            <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white/50 relative overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl -z-10"></div>
      
      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
        <span className="w-2 h-7 bg-blue-600 rounded-full inline-block shadow-lg shadow-blue-500/50"></span>
        Macro Completion
      </h3>
      
      <Bar label="Calories (kcal)" current={totals.calories} goal={goals?.calories || 2000} gradient="bg-gradient-to-r from-blue-500 to-indigo-500" bgShadow="shadow-blue-500/40" />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100/50">
        <Bar label="Protein (g)" current={totals.protein} goal={goals?.protein || 150} gradient="bg-gradient-to-r from-emerald-400 to-teal-500" bgShadow="shadow-emerald-500/40" />
        <Bar label="Carbs (g)" current={totals.carbs} goal={goals?.carbs || 200} gradient="bg-gradient-to-r from-orange-400 to-rose-400" bgShadow="shadow-orange-500/40" />
        <Bar label="Fats (g)" current={totals.fats} goal={goals?.fats || 70} gradient="bg-gradient-to-r from-violet-400 to-fuchsia-500" bgShadow="shadow-violet-500/40" />
      </div>
    </div>
  );
};

export default DailyProgress;
import React from 'react';
import { Target, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';

const DailyProgress = ({ scans = [], goals }) => {
  const totals = scans.reduce((acc, scan) => ({
    calories: acc.calories + (scan.macros?.calories || 0),
    protein: acc.protein + (scan.macros?.protein || 0),
    carbs: acc.carbs + (scan.macros?.carbs || 0),
    fats: acc.fats + (scan.macros?.fats || 0)
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const targetCals = goals?.calories || 2000;
  const targetProtein = goals?.protein || 150;
  const targetCarbs = goals?.carbs || 200;
  const targetFats = goals?.fats || 70;

  const remainingCals = Math.max(0, targetCals - Math.round(totals.calories));

  const Bar = ({ label, current, goal, unit, gradient, bgShadow }) => {
    const isExceeded = current > goal;
    const color = isExceeded ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/50' : gradient;
    const percent = Math.min((current / (goal || 1)) * 100, 100) || 0;

    return (
      <div className="mb-4 group">
        <div className="flex justify-between items-center text-xs font-black uppercase mb-1.5 tracking-wide">
          <span className={isExceeded ? 'text-rose-600 flex items-center gap-1' : 'text-slate-600'}>
            {label} {isExceeded && <AlertCircle size={12} />}
          </span>
          <span className="bg-slate-100/80 border border-slate-200/50 px-2 py-0.5 rounded-lg text-slate-800 font-bold">
            {Math.round(current)} / {goal}{unit}
          </span>
        </div>
        <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
          <div
            className={`h-full ${color} ${bgShadow} rounded-full shadow-md transition-all duration-1000 ease-out relative`}
            style={{ width: `${percent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-3xl p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white/60 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Target size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Daily Macro Progress</h2>
            <p className="text-xs text-slate-500 font-medium">Tracking meal completion against your profile goals</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center justify-end gap-1">
            <Flame size={12} className="text-amber-500" /> Remaining
          </p>
          <p className="text-xl font-black text-slate-800">{remainingCals} <span className="text-xs text-slate-400 font-medium">kcal</span></p>
        </div>
      </div>

      <Bar
        label="Total Calories"
        current={totals.calories}
        goal={targetCals}
        unit=" kcal"
        gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
        bgShadow="shadow-blue-500/30"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
        <Bar
          label="Protein"
          current={totals.protein}
          goal={targetProtein}
          unit="g"
          gradient="bg-gradient-to-r from-emerald-400 to-teal-500"
          bgShadow="shadow-emerald-500/30"
        />
        <Bar
          label="Carbs"
          current={totals.carbs}
          goal={targetCarbs}
          unit="g"
          gradient="bg-gradient-to-r from-amber-400 to-orange-500"
          bgShadow="shadow-amber-500/30"
        />
        <Bar
          label="Fats"
          current={totals.fats}
          goal={targetFats}
          unit="g"
          gradient="bg-gradient-to-r from-purple-400 to-indigo-500"
          bgShadow="shadow-purple-500/30"
        />
      </div>
    </div>
  );
};

export default DailyProgress;
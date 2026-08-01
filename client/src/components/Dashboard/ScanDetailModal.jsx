import React from 'react';
import { X, HeartPulse, Award, AlertCircle, Sparkles, Utensils, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScanDetailModal = ({ scan, onClose }) => {
  if (!scan) return null;

  const {
    foodName, imageUrl, isHealthy, healthScore = 80, portionSize = "1 serving",
    reasoning, dietAdvice, macros = {}, micros = {}, createdAt
  } = scan;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl border border-white/80 max-w-2xl w-full overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="relative h-48 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <img src={imageUrl} alt={foodName} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">🥗</div>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/40 text-white hover:bg-black/60 p-2.5 rounded-full backdrop-blur-md transition-all"
            >
              <X size={20} />
            </button>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest bg-blue-500/20 px-3 py-1 rounded-full backdrop-blur-md border border-blue-400/20">
                  {new Date(createdAt).toLocaleDateString()} • {portionSize}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1 drop-shadow-md">
                  {foodName}
                </h2>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg ${
                isHealthy ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {isHealthy ? 'PASSED' : 'CAUTION'}
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow">
            {/* Health Score & Key Takeaway */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Health Index Score</p>
                  <p className="text-2xl font-black text-slate-800">{healthScore} <span className="text-xs text-slate-400 font-medium">/ 100</span></p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Nutritional Verdict</p>
                <p className={`text-sm font-bold ${isHealthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isHealthy ? 'Optimal Choice' : 'Watch Intake'}
                </p>
              </div>
            </div>

            {/* Macros Grid */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Macronutrient Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Calories</p>
                  <p className="text-xl font-black text-slate-800">{macros.calories || 0} <span className="text-xs font-normal">kcal</span></p>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Protein</p>
                  <p className="text-xl font-black text-slate-800">{macros.protein || 0} <span className="text-xs font-normal">g</span></p>
                </div>
                <div className="bg-amber-50/60 border border-amber-100 p-3.5 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Carbs</p>
                  <p className="text-xl font-black text-slate-800">{macros.carbs || 0} <span className="text-xs font-normal">g</span></p>
                </div>
                <div className="bg-purple-50/60 border border-purple-100 p-3.5 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider">Fats</p>
                  <p className="text-xl font-black text-slate-800">{macros.fats || 0} <span className="text-xs font-normal">g</span></p>
                </div>
              </div>
            </div>

            {/* Micronutrients if present */}
            {(micros.fiber || micros.sugar || micros.sodium) ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-around text-center text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Fiber</span>
                  <span className="font-black text-slate-800">{micros.fiber || 0}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Sugar</span>
                  <span className="font-black text-slate-800">{micros.sugar || 0}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Sodium</span>
                  <span className="font-black text-slate-800">{micros.sodium || 0}mg</span>
                </div>
              </div>
            ) : null}

            {/* AI Reasoning */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <Utensils size={18} className="text-indigo-600" />
                <h3 className="font-black text-sm uppercase tracking-wide">AI Dietitian Analysis</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                {reasoning}
              </p>
            </div>

            {/* Diet Specific Advice */}
            {dietAdvice && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100/80 flex items-start gap-3">
                <Sparkles className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-black text-indigo-900 uppercase tracking-wider">Wizard Advice</p>
                  <p className="text-xs text-indigo-800 mt-0.5 font-medium leading-relaxed">{dietAdvice}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScanDetailModal;

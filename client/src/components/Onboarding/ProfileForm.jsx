import React, { useState } from 'react';
import { Activity, Ruler, Weight, AlertCircle, Target, Sparkles } from 'lucide-react';
import axios from 'axios';

const ProfileForm = ({ user, onComplete, initialData, isUpdateMode }) => {
  const [formData, setFormData] = useState(initialData || {
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    allergies: user?.allergies || '',
    activityLevel: user?.activityLevel || 'moderate',
    preference: user?.preference || 'Balanced',
    goalType: user?.goalType || 'maintenance',
    gender: user?.gender || 'male'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/user/${user._id}/update-profile`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      onComplete(data);
    } catch (err) {
      console.error("Update Profile Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-8 md:p-12 border border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>

        {!isUpdateMode && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Welcome to Wellness Wizard ✨</h1>
            <p className="text-slate-500 text-sm font-medium">Let's calculate your clinical macro targets and diet rules.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Objective Goal Selector */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Primary Fitness Objective</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, goalType: 'deficit' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${
                  formData.goalType === 'deficit'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔥 Weight Loss (-15%)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, goalType: 'maintenance' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${
                  formData.goalType === 'maintenance'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ⚖️ Maintain Weight
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, goalType: 'surplus' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${
                  formData.goalType === 'surplus'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                💪 Muscle Gain (+15%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Age</label>
              <div className="flex items-center bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <input
                  type="number"
                  required
                  placeholder="Years e.g. 25"
                  className="bg-transparent w-full outline-none font-bold text-slate-800 text-sm"
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  value={formData.age}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Gender</label>
              <div className="flex items-center bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <select
                  className="bg-transparent w-full outline-none font-bold text-slate-800 text-sm"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Height (cm)</label>
              <div className="flex items-center bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Ruler className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                <input
                  type="number"
                  required
                  placeholder="e.g. 175"
                  className="bg-transparent w-full outline-none font-bold text-slate-800 text-sm"
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  value={formData.height}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Weight (kg)</label>
              <div className="flex items-center bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Weight className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                <input
                  type="number"
                  required
                  placeholder="e.g. 70"
                  className="bg-transparent w-full outline-none font-bold text-slate-800 text-sm"
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  value={formData.weight}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Activity Level</label>
              <div className="flex items-center bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Activity className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                <select
                  className="bg-transparent w-full outline-none font-bold text-slate-800 text-sm"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                >
                  <option value="sedentary">Sedentary (Desk Job)</option>
                  <option value="moderate">Moderate (Light Workout 3x/wk)</option>
                  <option value="active">Active (Intense Sports / Heavy Lifting)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Diet Focus Split</label>
              <div className="flex items-center bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <select
                  className="bg-transparent w-full outline-none font-bold text-slate-800 text-sm"
                  value={formData.preference}
                  onChange={(e) => setFormData({ ...formData, preference: e.target.value })}
                >
                  <option value="Balanced">Balanced (30P / 45C / 25F)</option>
                  <option value="Keto">Keto Low-Carb (25P / 5C / 70F)</option>
                  <option value="High Protein">High Protein (40P / 35C / 25F)</option>
                  <option value="Low Carb">Low Carb (45P / 20C / 35F)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-rose-500 uppercase tracking-wider block mb-1">Allergies / Restrictions</label>
            <div className="flex items-center bg-rose-50/60 rounded-2xl p-3.5 border border-rose-200/60 focus-within:border-rose-500 focus-within:bg-white transition-all">
              <AlertCircle className="text-rose-500 mr-2 flex-shrink-0" size={18} />
              <input
                type="text"
                placeholder="e.g. Peanuts, Lactose, Shellfish (Leave blank if none)"
                className="bg-transparent w-full outline-none font-bold text-slate-800 text-sm"
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                value={formData.allergies}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all text-base tracking-tight flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            {isUpdateMode ? 'Update Wizard Settings' : 'Initialize AI Goals'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
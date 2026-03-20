// client/src/components/Onboarding/ProfileForm.jsx
import React, { useState } from 'react';
import { Activity, Ruler, Weight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ProfileForm = ({ user, onComplete, initialData, isUpdateMode }) => {
  const [formData, setFormData] = useState(initialData || {
    age: '', height: '', weight: '', allergies: '', activityLevel: 'moderate', preference: 'Keto', gender: 'male'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/user/${user._id}/update-profile`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      onComplete(data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-white">
        {!isUpdateMode && (
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Welcome to Nourish.</h1>
            <p className="text-slate-500 font-medium">Let's craft your personalized wellness journey.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider">Age</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all">
                <input type="number" required placeholder="Years" className="bg-transparent w-full outline-none font-medium" 
                  onChange={(e) => setFormData({...formData, age: e.target.value})} value={formData.age} />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider">Gender</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all">
                <select className="bg-transparent w-full outline-none font-medium" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider">Height (cm)</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all">
                <Ruler className="text-blue-500 mr-3" size={20} />
                <input type="number" required placeholder="e.g. 175" className="bg-transparent w-full outline-none font-medium" 
                  onChange={(e) => setFormData({...formData, height: e.target.value})} value={formData.height} />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider">Weight (kg)</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all">
                <Weight className="text-blue-500 mr-3" size={20} />
                <input type="number" required placeholder="e.g. 70" className="bg-transparent w-full outline-none font-medium" 
                  onChange={(e) => setFormData({...formData, weight: e.target.value})} value={formData.weight} />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider">Activity Level</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all">
                <Activity className="text-blue-500 mr-3" size={20} />
                <select className="bg-transparent w-full outline-none font-medium" value={formData.activityLevel} onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}>
                  <option value="sedentary">Sedentary (Office Job)</option>
                  <option value="moderate">Moderate (Light Exercise)</option>
                  <option value="active">Active (Intense Sports)</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider">Diet Focus</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all">
                <select className="bg-transparent w-full outline-none font-medium" value={formData.preference} onChange={(e) => setFormData({...formData, preference: e.target.value})}>
                  <option value="Balanced">Balanced Macros</option>
                  <option value="Keto">Keto (Low Carb)</option>
                  <option value="High Protein">High Protein</option>
                </select>
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-black text-red-500 uppercase ml-1 tracking-wider">Allergies / Restrictions</label>
            <div className="flex items-center mt-1 bg-red-50 rounded-2xl p-4 border border-transparent focus-within:border-red-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-500/10 transition-all">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <input type="text" placeholder="e.g. Peanuts, Dairy, Gluten (Leave blank if none)" className="bg-transparent w-full outline-none font-medium" 
                onChange={(e) => setFormData({...formData, allergies: e.target.value})} value={formData.allergies} />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 text-lg tracking-tight">
            {isUpdateMode ? 'Update Wizard Settings 🪄' : 'Initialize Wizard Goals 🪄'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
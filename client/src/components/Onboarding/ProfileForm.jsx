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
      onComplete(data); // Returns user with calculated goals
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Build Your Profile 🧙‍♂️</h2>
        <p className="text-slate-500 mb-8">We use this to calculate your personalized AI macros.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Age</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 transition">
                <input type="number" required placeholder="Years" className="bg-transparent w-full outline-none" 
                  onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Gender</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 transition">
                <select className="bg-transparent w-full outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Height (cm)</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 transition">
                <Ruler className="text-blue-500 mr-3" size={20} />
                <input type="number" required placeholder="e.g. 175" className="bg-transparent w-full outline-none" 
                  onChange={(e) => setFormData({...formData, height: e.target.value})} />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Weight (kg)</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 transition">
                <Weight className="text-blue-500 mr-3" size={20} />
                <input type="number" required placeholder="e.g. 70" className="bg-transparent w-full outline-none" 
                  onChange={(e) => setFormData({...formData, weight: e.target.value})} />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Activity Level</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 transition">
                <Activity className="text-blue-500 mr-3" size={20} />
                <select className="bg-transparent w-full outline-none" value={formData.activityLevel} onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}>
                  <option value="sedentary">Sedentary (Office Job)</option>
                  <option value="moderate">Moderate (Light Exercise)</option>
                  <option value="active">Active (Intense Sports)</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Diet Focus</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 transition">
                <select className="bg-transparent w-full outline-none" value={formData.preference} onChange={(e) => setFormData({...formData, preference: e.target.value})}>
                  <option value="Balanced">Balanced Macros</option>
                  <option value="Keto">Keto (Low Carb)</option>
                  <option value="High Protein">High Protein</option>
                </select>
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-red-400 uppercase ml-1">Allergies / Restrictions</label>
            <div className="flex items-center mt-1 bg-red-50 rounded-2xl p-4 border border-transparent focus-within:border-red-500 transition">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <input type="text" placeholder="e.g. Peanuts, Dairy, Gluten (Leave blank if none)" className="bg-transparent w-full outline-none" 
                onChange={(e) => setFormData({...formData, allergies: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all active:scale-95">
            {isUpdateMode ? 'Update Macros 🚀' : 'Initialize Wizard Goals 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProfileForm;
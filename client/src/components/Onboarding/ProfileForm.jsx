// client/src/components/Onboarding/ProfileForm.jsx
import React, { useState } from 'react';
import { Activity, Ruler, Weight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ProfileForm = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    age: '', height: '', weight: '', allergies: '', activity: 'moderate', preference: 'Keto'
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
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Height (cm)</label>
              <div className="flex items-center mt-1 bg-slate-50 rounded-2xl p-4 border border-transparent focus-within:border-blue-500 transition">
                <Ruler className="text-blue-500 mr-3" size={20} />
                <input type="number" required className="bg-transparent w-full outline-none" 
                  onChange={(e) => setFormData({...formData, height: e.target.value})} />
              </div>
            </div>
            {/* Repeat similar structure for Weight and Age */}
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-red-400 uppercase ml-1">Allergies / Restrictions</label>
            <div className="flex items-center mt-1 bg-red-50 rounded-2xl p-4 border border-transparent focus-within:border-red-500 transition">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <input type="text" placeholder="e.g. Peanuts, Dairy, Gluten" className="bg-transparent w-full outline-none" 
                onChange={(e) => setFormData({...formData, allergies: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all active:scale-95">
            Initialize Wizard Goals 🚀
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProfileForm;
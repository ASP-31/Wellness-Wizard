// client/src/components/ProfileForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = ({ userId, onComplete }) => {
    const [formData, setFormData] = useState({
        age: '', height: '', weight: '', gender: 'male', activityLevel: 'moderate', preference: 'Keto'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sends data to the backend to calculate and save goals
            const res = await axios.put(`/api/user/${userId}/update-profile`, formData);
            onComplete(res.data.user); // Pass the new user object back to App.jsx
        } catch (err) { console.error(err); }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Set Your Goals</h2>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Age" className="border p-2 rounded" onChange={(e) => setFormData({...formData, age: e.target.value})} />
                <input type="number" placeholder="Weight (kg)" className="border p-2 rounded" onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                <input type="number" placeholder="Height (cm)" className="border p-2 rounded" onChange={(e) => setFormData({...formData, height: e.target.value})} />
                <select className="border p-2 rounded" onChange={(e) => setFormData({...formData, preference: e.target.value})}>
                    <option value="Keto">Keto Diet</option>
                    <option value="Balanced">Balanced</option>
                </select>
            </div>
            <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Calculate My Macros 🚀
            </button>
        </form>
    );
};

export default ProfileForm;
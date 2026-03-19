import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const Signup = ({ onAuth }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/user/signup', formData);
      onAuth(data); // Passes user data + token to App.jsx
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="p-10 bg-white shadow-2xl rounded-3xl w-full max-w-md border border-slate-100">
        <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
          <UserPlus className="text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-6">Create Account</h2>
        <input type="text" placeholder="Full Name" className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-4 mb-8 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="w-full p-4 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95">
          Sign Up 🚀
        </button>
      </form>
    </div>
  );
};

export default Signup;
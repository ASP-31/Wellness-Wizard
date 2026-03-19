import React, { useState } from 'react';
import axios from 'axios';
import { LogIn } from 'lucide-react';

const Login = ({ onAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/user/login', formData);
      onAuth(data); // Stores token and goals in App.jsx state
    } catch (err) {
      alert("Invalid credentials. Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="p-10 bg-white shadow-2xl rounded-3xl w-full max-w-md border border-slate-100">
        <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
          <LogIn className="text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-6">Welcome Back</h2>
        <input type="email" placeholder="Email" className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-emerald-500 transition" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-4 mb-8 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-emerald-500 transition" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="w-full p-4 font-bold text-white bg-emerald-500 rounded-2xl hover:bg-emerald-600 hover:shadow-xl transition-all active:scale-95">
          Enter Vault 🔑
        </button>
      </form>
    </div>
  );
};

export default Login;
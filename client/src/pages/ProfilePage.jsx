import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileForm from '../components/Onboarding/ProfileForm';

const ProfilePage = ({ user, onComplete }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/api/user/${user._id}`);
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-700 tracking-tight">Loading Profile...</h2>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-2xl">
            <User className="text-indigo-600" size={28} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Metrics</h1>
        </div>
      </div>
      <p className="text-slate-500 mb-10 font-medium">Update your body metrics and diet strategy to dynamically recalculate your daily AI macros.</p>

      {/* We reuse the beautifully styled ProfileForm. The isUpdateMode prop changes the CTA text. */}
      <ProfileForm 
        user={user} 
        onComplete={(data) => {
          onComplete(data);
          navigate('/');
        }} 
        initialData={profileData} 
        isUpdateMode={true} 
      />
    </motion.div>
  );
};

export default ProfilePage;

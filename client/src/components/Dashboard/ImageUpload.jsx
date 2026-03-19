import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Loader2 } from 'lucide-react';

const ImageUpload = ({ onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);

    try {
      // Get the token we saved during Login/Signup
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const { data } = await axios.post('/api/ai/analyze', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}` // Proves who is uploading
        }
      });
      onAnalysisComplete(data);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 border-2 border-dashed border-blue-100 rounded-3xl bg-blue-50/50 flex flex-col items-center">
      {loading ? (
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
          <p className="text-sm font-bold text-blue-800">Wizard is scanning...</p>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center group">
          <div className="bg-blue-600 p-5 rounded-full text-white shadow-lg group-hover:scale-110 transition">
            <Camera size={28} />
          </div>
          <span className="mt-3 font-bold text-slate-600">Upload Meal Photo</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Loader2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageUpload = ({ onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const base64Data = reader.result;
        
        const { data } = await axios.post('/api/ai/analyze', {
            imageBase64: base64Data,
            imagePreviewUrl: base64Data
        }, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        onAnalysisComplete(data.data); // data.data contains the newScan
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setLoading(false);
    };
  };

  return (
    <div className="p-10 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-gradient-to-b from-blue-50/50 to-indigo-50/30 rounded-[2rem] flex flex-col items-center justify-center transition-colors group relative overflow-hidden">
      {/* Subtle pulse behind the camera icon */}
      <div className="absolute inset-0 bg-blue-400/5 group-hover:bg-blue-400/10 transition-colors"></div>

      {loading ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl animate-pulse opacity-50"></div>
            <div className="bg-white p-4 rounded-full shadow-lg relative">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          </div>
          <p className="text-sm font-black text-blue-800 tracking-wide uppercase">AI actively scanning...</p>
        </motion.div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center group relative z-10 w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-full text-white shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 relative">
              <Camera size={32} />
            </div>
          </div>
          <h3 className="mt-6 font-black text-lg text-slate-800 tracking-tight transition-colors">Capture or Upload</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">Tap to select your food photo</p>
          <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
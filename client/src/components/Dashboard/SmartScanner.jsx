import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Camera, UploadCloud, FileText, Loader2, RefreshCw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment'
};

const SmartScanner = ({ userId, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'camera', 'upload', 'text'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Camera state
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Text log state
  const [textMeal, setTextMeal] = useState('');

  // File upload drag state
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle Photo Analysis (from camera or file)
  const processImageAnalysis = async (base64Data) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.post('/api/ai/analyze', {
        imageBase64: base64Data,
        imagePreviewUrl: base64Data
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      if (data.data) {
        onAnalysisComplete(data.data);
        setCapturedImage(null);
        setPreviewImage(null);
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      setErrorMsg(err.response?.data?.error || "Meal analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Camera capture
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        processImageAnalysis(imageSrc);
      }
    }
  }, [webcamRef]);

  // File input change
  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
      processImageAnalysis(reader.result);
    };
  };

  // Text Meal Analysis
  const handleTextAnalysis = async (e) => {
    e.preventDefault();
    if (!textMeal.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.post('/api/ai/analyze-text', {
        mealDescription: textMeal
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      if (data.data) {
        onAnalysisComplete(data.data);
        setTextMeal('');
      }
    } catch (err) {
      console.error("Text Meal Analysis Error:", err);
      setErrorMsg(err.response?.data?.error || "Failed to analyze meal text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-3xl p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white/60 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>

      {/* Header Tabs */}
      <div className="flex items-center justify-between gap-2 mb-6 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'upload' ? 'bg-white text-blue-600 shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud size={16} /> File Upload
        </button>
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'camera' ? 'bg-white text-blue-600 shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera size={16} /> Live Camera
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === 'text' ? 'bg-white text-blue-600 shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={16} /> Quick Text
        </button>
      </div>

      {/* Error Message Toast */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-500" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-700 text-sm font-bold">×</button>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-ping"></div>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-2xl text-white shadow-xl relative border border-white/20">
              <Loader2 className="animate-spin" size={32} />
            </div>
          </div>
          <p className="text-sm font-black text-slate-800 tracking-wide uppercase">AI Nutritionist Analysis in Progress...</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Scanning macros, health rating & dietary targets</p>
        </motion.div>
      )}

      {/* TAB CONTENT: FILE UPLOAD */}
      {!loading && activeTab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileChange(e.dataTransfer.files[0]);
            }
          }}
          className={`p-8 md:p-10 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 relative ${
            isDragging ? 'border-blue-500 bg-blue-50/80 scale-[1.01]' : 'border-blue-200 hover:border-blue-400 bg-gradient-to-b from-blue-50/40 to-indigo-50/20'
          }`}
        >
          <label className="cursor-pointer flex flex-col items-center w-full">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-full text-white shadow-lg border border-white/20">
                <UploadCloud size={28} />
              </div>
            </div>
            <h3 className="font-black text-lg text-slate-800 tracking-tight">Upload Food Image</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Drag and drop photo here, or click to browse</p>
            <span className="mt-3 text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full">
              JPG, PNG, WEBP Supported
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
          </label>
        </div>
      )}

      {/* TAB CONTENT: LIVE CAMERA */}
      {!loading && activeTab === 'camera' && (
        <div className="flex flex-col items-center relative">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-blue-500/30 shadow-2xl bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-64 md:h-72 object-cover"
            />
            {/* Viewfinder reticle overlay */}
            <div className="absolute inset-4 border-2 border-dashed border-white/50 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-l-2 border-cyan-400 absolute top-2 left-2"></div>
              <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400 absolute top-2 right-2"></div>
              <div className="w-8 h-8 border-b-2 border-l-2 border-cyan-400 absolute bottom-2 left-2"></div>
              <div className="w-8 h-8 border-b-2 border-r-2 border-cyan-400 absolute bottom-2 right-2"></div>
            </div>
          </div>
          <button
            onClick={capturePhoto}
            className="mt-5 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <Camera size={20} /> Capture & Scan Meal
          </button>
        </div>
      )}

      {/* TAB CONTENT: QUICK TEXT LOG */}
      {!loading && activeTab === 'text' && (
        <form onSubmit={handleTextAnalysis} className="space-y-4">
          <div className="relative">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Describe Meal or Snack</label>
            <textarea
              rows={3}
              value={textMeal}
              onChange={(e) => setTextMeal(e.target.value)}
              placeholder="e.g. 2 scrambled eggs with spinach, 1 slice sourdough toast with butter, and a black coffee..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10 transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={!textMeal.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={18} /> Parse & Calculate Macros
          </button>
        </form>
      )}
    </div>
  );
};

export default SmartScanner;

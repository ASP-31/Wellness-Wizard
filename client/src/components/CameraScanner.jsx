// client/src/components/CameraScanner.jsx
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { scanFoodImage } from "../services/aiService"; // The service we created earlier

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment", // Use "environment" for the back camera on mobile
};

const CameraScanner = ({ userId }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const capture = useCallback(async () => {
    // 1. Get the screenshot as a base64 string
    const imageBase64 = webcamRef.current.getScreenshot();
    setImgSrc(imageBase64);
    
    // 2. Send it to your Node.js backend
    setLoading(true);
    try {
      const result = await scanFoodImage(userId, imageBase64);
      console.log("AI Analysis:", result);
      // You can now display this 'result' in your UI
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [webcamRef, userId]);

  return (
    <div className="flex flex-col items-center">
      {!imgSrc ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg border-4 border-blue-500"
          />
          <button 
            onClick={capture} 
            className="mt-4 bg-blue-600 text-white p-3 rounded-full"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Scan Food"}
          </button>
        </>
      ) : (
        <div className="text-center">
          <img src={imgSrc} alt="Captured" className="rounded-lg" />
          <button onClick={() => setImgSrc(null)} className="mt-2 text-red-500">
            Retake Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
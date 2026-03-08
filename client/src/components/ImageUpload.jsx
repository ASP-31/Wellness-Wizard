import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ userId, onAnalysisComplete }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Show preview immediately
        }
    };

    const handleUpload = async () => {
        if (!image) return alert("Please select an image first!");

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
            const base64String = reader.result;
            setLoading(true);

            try {
                // Using the proxy we set up in package.json
                const response = await axios.post('/api/ai/analyze', {
                    userId,
                    imageBase64: base64String
                });

                // Pass the result back to the parent component
                onAnalysisComplete(response.data.data);
                alert("Analysis Successful!");
            } catch (err) {
                console.error("Upload Error:", err);
                alert("AI Analysis failed. Check console for details.");
            } finally {
                setLoading(false);
            }
        };
    };

    return (
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center bg-white shadow-sm">
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
                id="food-upload"
            />
            <label htmlFor="food-upload" className="cursor-pointer text-blue-600 font-semibold hover:underline">
                {preview ? "Change Image" : "Click to Upload Food Image"}
            </label>

            {preview && (
                <div className="mt-4">
                    <img src={preview} alt="Preview" className="mx-auto h-48 rounded-lg shadow-md" />
                    <button 
                        onClick={handleUpload}
                        disabled={loading}
                        className={`mt-4 w-full py-2 rounded-lg font-bold text-white ${
                            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? "Analyzing..." : "Analyze Macros"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
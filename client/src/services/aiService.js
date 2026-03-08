// client/src/services/aiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

export const scanFoodImage = async (userId, base64Image) => {
  try {
    const response = await axios.post(`${API_URL}/scan`, {
      userId,
      imageBase64: base64Image
    });
    return response.data;
  } catch (error) {
    console.error("Error scanning image:", error);
    throw error;
  }
};
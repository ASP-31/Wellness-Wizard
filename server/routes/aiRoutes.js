import express from 'express';
import { analyzeImage, analyzeText } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in users can use the Gemini scanner endpoints
router.post('/analyze', protect, analyzeImage);
router.post('/analyze-text', protect, analyzeText);

export default router;
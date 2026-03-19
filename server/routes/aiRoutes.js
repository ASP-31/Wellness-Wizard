import express from 'express';
import { analyzeImage } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in users can use the Gemini scanner
router.post('/analyze', protect, analyzeImage);

export default router;
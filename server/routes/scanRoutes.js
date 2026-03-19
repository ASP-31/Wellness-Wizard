import express from 'express';
import { getUserHistory } from '../controllers/scanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This automatically filters history for the logged-in user
router.get('/history', protect, getUserHistory);

export default router;
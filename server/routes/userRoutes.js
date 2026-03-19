import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import ScanHistory from '../models/ScanHistory.js';
import { updateProfile } from '../controllers/userController.js';
// 1. Static routes go FIRST
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// 2. Dynamic routes (with :) go LAST
router.get('/:id', userController.getUserProfile);

// Get all scans for a specific user, newest first
router.get('/:id/history', async (req, res) => {
    try {
        const history = await ScanHistory.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE all history for a user
router.delete('/:id/history/clear', async (req, res) => {
    try {
        const result = await ScanHistory.deleteMany({ userId: req.params.id });
        res.json({ message: `Deleted ${result.deletedCount} scans.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/:userId/update-profile', updateProfile);
export default router;
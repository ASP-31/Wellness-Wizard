import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import ScanHistory from '../models/ScanHistory.js';
import { updateProfile } from '../controllers/userController.js';

// Static Auth Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Get User Profile
router.get('/:id', userController.getUserProfile);

// Get all scan history for a specific user, newest first
router.get('/:id/history', async (req, res) => {
    try {
        const history = await ScanHistory.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a specific scan entry
router.delete('/:id/history/:scanId', async (req, res) => {
    try {
        const { id, scanId } = req.params;
        const deletedScan = await ScanHistory.findOneAndDelete({ _id: scanId, userId: id });
        if (!deletedScan) {
            return res.status(404).json({ message: "Scan entry not found." });
        }
        res.json({ message: "Scan deleted successfully.", scanId });
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

// Update Profile & recalculate macros
router.put('/:userId/update-profile', updateProfile);

export default router;
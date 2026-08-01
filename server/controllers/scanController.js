import ScanHistory from '../models/ScanHistory.js';

export const getUserHistory = async (req, res) => {
    try {
        const history = await ScanHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};
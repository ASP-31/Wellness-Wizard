// server/controllers/scanController.js
export const getUserHistory = async (req, res) => {
    try {
        // req.user.id comes from the auth middleware after login
        const history = await ScanHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};
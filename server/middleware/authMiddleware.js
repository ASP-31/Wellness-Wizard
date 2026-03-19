// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from string "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // 2. Decode the token using your secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach the user object (minus password) to the request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the actual controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
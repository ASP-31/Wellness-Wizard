import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { calculateMacros } from '../utils/macroEngine.js';

// Helper: Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register new user
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Send token to frontend
            goals: user.goals // Initially null, triggers ProfileForm in App.jsx
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Auth user & get token
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                goals: user.goals // If exists, user goes straight to Dashboard
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update Profile & Calculate Macros
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const goals = calculateMacros(req.body); // Uses the engine we built earlier

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { ...req.body, goals },
            { new: true }
        );

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            token: generateToken(updatedUser._id), // Refresh token if needed
            goals: updatedUser.goals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
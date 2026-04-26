import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

connectDB(); // Connect to MongoDB Atlas

const app = express();
export { app };

// Middleware
// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
  origin: ['https://wellness-wizard-7liq.onrender.com/', 'http://localhost:3000'], // Added localhost:3000 for local dev
  credentials: true
}));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', globalLimiter);

// Specific stricter limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 AI requests per hour
  message: 'AI analysis limits exceeded. Please try again later.'
});
app.use('/api/ai/', aiLimiter);

app.use(express.json({ limit: '10mb' })); // Increase limit for image data

// Routes
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Health check endpoint (used by pingers to keep the server warm)
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

connectDB(); // Connect to MongoDB Atlas

const app = express();
export { app };

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
  origin: ['https://wellness-wizard-7liq.onrender.com', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', globalLimiter);

// Specific stricter limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60, // increased for rich interactive usage
  message: 'AI analysis limits exceeded. Please try again later.'
});
app.use('/api/ai/', aiLimiter);

app.use(express.json({ limit: '10mb' }));

// Routes
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import scanRoutes from './routes/scanRoutes.js';

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/scans', scanRoutes);

import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
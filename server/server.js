import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB(); // Connect to MongoDB Atlas

const app = express();
export { app };

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image data

// Routes
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
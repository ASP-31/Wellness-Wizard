const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB(); // Connect to MongoDB Atlas

const app = express();
exports.app = app;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image data

// Routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
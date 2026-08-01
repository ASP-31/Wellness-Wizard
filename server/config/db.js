import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import dns from 'dns';

// Fix Windows DNS resolution issue for MongoDB Atlas SRV records
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignored if unsupported
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/macrovision';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout for quick diagnostics
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Warning: ${error.message}`);
    logger.info(`💡 Note: If using MongoDB Atlas, verify your internet connection and check if your IP address is whitelisted in MongoDB Atlas Network Access.`);
    // Do not call process.exit(1) so nodemon stays alive and server serves API health endpoints
  }
};

export default connectDB;
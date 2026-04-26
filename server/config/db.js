import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    // Attempting to connect using the MONGO_URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ Error: ${error.message}`);
    // Exit the process with failure if connection fails
    process.exit(1); 
  }
};

export default connectDB;
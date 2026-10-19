import mongoose from 'mongoose';

/**
 * Connect to MongoDB with robust error handling and event listeners.
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todolist';
    
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true, // Build indexes automatically in development
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Runtime Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection lost. Attempting to reconnect...');
    });

  } catch (error) {
    console.error(`[MongoDB] Initial Connection Error: ${error.message}`);
    // Non-blocking in dev mode so API can still provide clear error response
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

import app from '../app.js';
import connectDB from '../config/database.js';
import mongoose from 'mongoose';

// Cache MongoDB connection for serverless (reuse across invocations)
let isConnected = false;

async function ensureDatabaseConnection() {
  // Check if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // If connection exists but is not ready, close it first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  try {
    await connectDB();
    isConnected = true;
    console.log('✅ MongoDB connected for serverless function');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

// Vercel serverless function handler
export default async function handler(req, res) {
  // Ensure MongoDB connection before handling request
  try {
    await ensureDatabaseConnection();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
      }),
    });
  }

  // Handle the request with Express app
  // Express app will handle routing, middleware, etc.
  return app(req, res);
}

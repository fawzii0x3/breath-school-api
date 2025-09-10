import mongoose from 'mongoose';
import { config } from '../../config/config';

export class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      // Set a connection timeout
      const connectWithTimeout = Promise.race([
        mongoose.connect(config.database.mongoUri, {
          serverSelectionTimeoutMS: 5000, // 5 second timeout
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        )
      ]);
      
      await connectWithTimeout;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.warn('MongoDB connection failed - running without database:', error);
      // Don't throw error, just log warning to allow app to start without DB
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
      throw error;
    }
  }
}
import mongoose from 'mongoose';

const mongoUri = process.env.NODE_ENV === 'production' 
  ? process.env.MONGO_URI 
  : process.env.MONGO_URI;

export async function connectDatabase(): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    await mongoose.connect(mongoUri!);
    
    console.log('Database is connected');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

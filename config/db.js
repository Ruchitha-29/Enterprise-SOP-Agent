import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      // eslint-disable-next-line no-console
      console.warn(
        'MONGO_URI is not set. Please configure your MongoDB connection string in .env',
      );
      throw new Error('MONGO_URI is not defined');
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || 'opsmind-ai',
    });

    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error', error);
    throw error;
  }
}


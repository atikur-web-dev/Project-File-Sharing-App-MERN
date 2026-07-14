import mongoose from 'mongoose';
import { config } from '../Config/config.js';

export async function connectDB() {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose Connect to MongoDB atlas');
  });

  mongoose.connection.on('error', (err: Error) => {
    console.log('Mongoose connection failed', err);
    process.exit(1);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnect from MongoDB');
  });

  try {
    await mongoose.connect(config.DATABASE_URL);
    console.log('Database Connection Established');
  } catch (error) {
    console.log('Failed to connect to Database', error);
    process.exit(1);
  }
}

import "dotenv/config";

console.log("🔥 SERVER STARTED 🔥");
console.log("GEMINI KEY LOADED:", !!process.env.GEMINI_API_KEY);

import path from 'path';
import { fileURLToPath } from 'url';

// Resolve .env relative to this file (backend/.env), independent of working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temporary debug check for Mongo URI – remove once verified
// eslint-disable-next-line no-console
console.log('ENV CHECK:', process.env.MONGO_URI);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Basic security hardening
app.use(helmet());

// CORS – adjust origins as needed
app.use(cors({
  origin: true,
  credentials: true
}));
// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'opsmind-ai-backend' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', queryRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`OpsMind AI backend running on port ${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

startServer();

export default app;


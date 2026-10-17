import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler, generalLimiter } from './middleware/index.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and utility middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded static files
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/uploads', express.static(path.resolve(__dirname, '../backend/uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Root entry point
app.get('/', (req, res) => {
  res.json({
    name: 'Khyber Rehabilitation Center API',
    version: '1.0.0',
    status: 'online',
    docs: '/api/v1/health',
  });
});

// API version 1 router with general rate limiting
app.use('/api/v1', generalLimiter, apiRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import express from 'express';
import cors from 'cors';
import logRouter from './routes/logs.js';
import { cleanupExpiredFiles } from './controllers/logController.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/logs', logRouter);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Periodic cleaner for temporary log files (runs every 5 minutes)
setInterval(cleanupExpiredFiles, 5 * 60 * 1000);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;

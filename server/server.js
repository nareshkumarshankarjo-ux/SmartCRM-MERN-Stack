import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Please configure a strong JWT_SECRET (at least 32 characters) in server/.env');
  process.exit(1);
}
const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }));

app.get('/', (_req, res) => res.json({ message: 'Welcome to SmartCRM API', status: 'success' }));
app.get('/health', (_req, res) => res.json({ status: 'OK', application: 'SmartCRM', message: 'Backend server is running' }));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/customers', customerRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`SmartCRM server running on port ${PORT}`));
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}
startServer();
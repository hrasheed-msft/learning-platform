import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import config from './config';
import prisma from './config/database';
import redis from './config/redis';

// Import routes
import authRoutes from './routes/auth.routes';
import familyRoutes from './routes/family.routes';
import courseRoutes from './routes/course.routes';
import assessmentRoutes from './routes/assessment.routes';
import srsRoutes from './routes/srs.routes';
import userRoutes from './routes/user.routes';
import flashCardRoutes from './routes/flashcard/flashcard.routes';
import childAuthRoutes from './routes/child-auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import notificationRoutes from './routes/notification.routes';
import gameRoutes from './routes/game.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

const app = express();

// Trust proxy — required for correct client IP detection behind Azure Container Apps ingress
app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));

// Health check endpoint (above rate limiter so it's always accessible)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rate limiting
// In development we disable global rate limiting entirely. React StrictMode,
// Vite HMR, dashboard fan-out requests, and rapid retries during local work
// can easily blow past any reasonable global limit and break logins. We still
// rely on auth (JWT) and validation middleware for protection.
// In production we apply a generous global limit, plus a stricter per-IP
// limit on auth endpoints to mitigate credential stuffing / brute force.
if (config.env === 'production') {
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 600,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) =>
      req.path.includes('/games/sessions/') &&
      (req.method === 'POST' || req.method === 'GET'),
  });
  app.use(globalLimiter);

  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    keyGenerator: (req) => {
      // Use X-Forwarded-For (set by Azure Container Apps ingress) for per-client limiting
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim();
      return clientIp || req.ip || 'unknown';
    },
    message: { error: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/v1/auth', authLimiter);
} else {
  console.log('[startup] Rate limiting DISABLED (non-production environment)');
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
}

// Static assets — coursebook diagram images
app.use('/coursebook-images', express.static(path.join(__dirname, '../public/coursebook-images')));

// API routes (v1)
// Note: flashCardRoutes must be before courseRoutes because it has more specific
// routes like /courses/:courseId/flashcards that would otherwise be caught by
// the course router's authenticate middleware
app.use('/api/v1', flashCardRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/family', familyRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/srs', srsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', childAuthRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/games', gameRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');

    // Connect to Redis
    await redis.connect();

    // Start listening
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.env} mode`);
      console.log(`API available at http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();

export default app;

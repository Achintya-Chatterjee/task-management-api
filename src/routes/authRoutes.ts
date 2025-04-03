import { Router } from 'express';
import { login, register } from '../controllers/authController';
import rateLimit from 'express-rate-limit';
import { AsyncRequestHandler } from '../types/express';

const router = Router();

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

export default router;

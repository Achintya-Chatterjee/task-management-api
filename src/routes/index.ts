import express from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Task routes
router.use('/tasks', taskRoutes);

export default router; 
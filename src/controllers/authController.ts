import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AsyncRequestHandler } from '../types/express';
import { AuthService } from '../services/authService';

// Input validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Generate JWT token
const generateToken = (id: string, email: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// Register user
export const register: AsyncRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.register(req.body);

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        token: result.token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};

// Login user
export const login: AsyncRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.login(req.body);

    res.json({
      message: 'Login successful',
      data: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        token: result.token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};
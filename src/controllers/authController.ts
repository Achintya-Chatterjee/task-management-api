import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AsyncRequestHandler } from '../types/express';

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
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      res.status(400).json({
        message: 'User already exists',
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Generate token
    const token = generateToken(String(user.id), user.email);

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
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
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken(String(user.id), user.email);

    res.json({
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
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
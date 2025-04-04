import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { TaskStatus, Priority } from '@prisma/client';

// Get all tasks for logged-in user
export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const result = await TaskService.getAllTasks(req.user.id, {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as TaskStatus | undefined,
      priority: req.query.priority as Priority | undefined,
      isArchived: req.query.isArchived === 'true',
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    });

    res.json({
      message: 'Tasks fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get task by ID
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const task = await TaskService.getTaskById(req.params.id, req.user.id);
    res.json({
      message: 'Task fetched successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const { title, description, status, priority, dueDate, tags } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Title is required');
    }

    const task = await TaskService.createTask({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
      userId: req.user.id,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const { title, description, status, priority, dueDate, tags, isArchived } = req.body;

    const task = await TaskService.updateTask(req.params.id, req.user.id, {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
      isArchived,
    });

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await TaskService.deleteTask(req.params.id, req.user.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
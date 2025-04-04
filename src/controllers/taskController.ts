import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma, TaskStatus, Priority } from '@prisma/client';

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

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter parameters
    const status = req.query.status as TaskStatus | undefined;
    const priority = req.query.priority as Priority | undefined;
    const isArchived = req.query.isArchived === 'true';

    // Sort parameters
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    // Build where clause
    const where = {
      userId: req.user.id,
      ...(status && { status }),
      ...(priority && { priority }),
      isArchived,
    };

    // Get total count for pagination
    const totalTasks = await prisma.task.count({ where });

    // Get tasks with pagination and sorting
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // Return paginated response with success message
    res.json({
      message: 'Tasks fetched successfully',
      tasks,
      pagination: {
        total: totalTasks,
        page,
        limit,
        totalPages: Math.ceil(totalTasks / limit),
      },
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

    const taskId = req.params.id;
    
    if (!taskId) {
      res.status(400);
      throw new Error('Invalid task ID');
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure the task belongs to the authenticated user
    if (task.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }

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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status ? status as TaskStatus : TaskStatus.PENDING,
        priority: priority ? priority as Priority : Priority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: tags || [],
        userId: req.user.id,
      },
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

    const taskId = req.params.id;
    const { title, description, status, priority, dueDate, tags, isArchived } = req.body;
    
    if (!taskId) {
      res.status(400);
      throw new Error('Invalid task ID');
    }

    // Validate status if provided
    if (status && !Object.values(TaskStatus).includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${Object.values(TaskStatus).join(', ')}`);
    }

    // Validate priority if provided
    if (priority && !Object.values(Priority).includes(priority)) {
      res.status(400);
      throw new Error(`Invalid priority. Must be one of: ${Object.values(Priority).join(', ')}`);
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (existingTask.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title !== undefined ? title : existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        status: status !== undefined ? status : existingTask.status,
        priority: priority !== undefined ? priority : existingTask.priority,
        dueDate: dueDate !== undefined ? new Date(dueDate) : existingTask.dueDate,
        tags: tags !== undefined ? tags : existingTask.tags,
        isArchived: isArchived !== undefined ? isArchived : existingTask.isArchived,
      },
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
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

    const taskId = req.params.id;
    
    if (!taskId) {
      res.status(400);
      throw new Error('Invalid task ID');
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (existingTask.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    // Delete task
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
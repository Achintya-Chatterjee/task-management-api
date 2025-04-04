import { prisma } from '../lib/prisma';
import { TaskStatus, Priority } from '@prisma/client';

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  tags?: string[];
  userId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  tags?: string[];
  isArchived?: boolean;
}

export class TaskService {
  // Get all tasks with pagination and filtering
  static async getAllTasks(userId: string, options: {
    page?: number;
    limit?: number;
    status?: TaskStatus;
    priority?: Priority;
    isArchived?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 10, status, priority, isArchived, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      isArchived: isArchived ?? false,
    };

    const [total, tasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
    ]);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get task by ID
  static async getTaskById(id: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('Not authorized to access this task');
    }

    return task;
  }

  // Create a new task
  static async createTask(data: CreateTaskData) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || TaskStatus.PENDING,
        priority: data.priority || Priority.MEDIUM,
        dueDate: data.dueDate,
        tags: data.tags || [],
        userId: data.userId,
      },
    });
  }

  // Update a task
  static async updateTask(id: string, userId: string, data: UpdateTaskData) {
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    if (existingTask.userId !== userId) {
      throw new Error('Not authorized to update this task');
    }

    return prisma.task.update({
      where: { id },
      data: {
        title: data.title ?? existingTask.title,
        description: data.description ?? existingTask.description,
        status: data.status ?? existingTask.status,
        priority: data.priority ?? existingTask.priority,
        dueDate: data.dueDate ?? existingTask.dueDate,
        tags: data.tags ?? existingTask.tags,
        isArchived: data.isArchived ?? existingTask.isArchived,
      },
    });
  }

  // Delete a task
  static async deleteTask(id: string, userId: string) {
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    if (existingTask.userId !== userId) {
      throw new Error('Not authorized to delete this task');
    }

    return prisma.task.delete({
      where: { id },
    });
  }
} 
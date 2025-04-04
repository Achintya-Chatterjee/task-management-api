import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A RESTful API for managing tasks with user authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'https://task-management-api-t8a6.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the task',
            },
            title: {
              type: 'string',
              description: 'Title of the task',
            },
            description: {
              type: 'string',
              description: 'Description of the task',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
              description: 'Current status of the task',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
              description: 'Priority level of the task',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date of the task',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags associated with the task',
            },
            isArchived: {
              type: 'boolean',
              description: 'Whether the task is archived',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task last update timestamp',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the user who owns the task',
            },
          },
          required: ['id', 'title', 'status', 'priority', 'userId'],
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options); 
# Task Management API

A RESTful API for task management with user authentication built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- JWT Authentication
- Task CRUD operations
- PostgreSQL database with Prisma ORM
- Input validation
- Error handling

## Prerequisites

- Node.js (v14+ recommended)
- Docker and Docker Compose
- npm or yarn
- Git

## Project Structure

```
task-management-api/
├── src/
│   ├── lib/           # Utility functions and configurations
│   ├── middleware/    # Express middleware
│   ├── routes/        # API routes
│   └── server.ts      # Application entry point
├── prisma/           # Database schema and migrations
├── docker-compose.yml # Docker configuration
├── .env.example      # Environment variables template
└── package.json      # Project dependencies
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Achintya-Chatterjee/task-management-api.git
cd task-management-api
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` and fill in your database credentials and JWT secret:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management_db?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Run database migrations:
```bash
npx prisma migrate dev
```

## Database Setup

The project uses PostgreSQL running in a Docker container. The database configuration is managed through Docker Compose, which sets up:
- PostgreSQL 16 (Alpine-based for smaller size)
- Persistent volume for data storage
- Health checks for container monitoring
- Automatic container restart

## Running the API

### Development Mode

```bash
npm run dev
# or
yarn dev
```

### Production Mode

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Tasks

All task endpoints require authentication (JWT token in Authorization header)

- `GET /api/tasks` - Get all tasks for the logged-in user
- `GET /api/tasks/:id` - Get a specific task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

## API Documentation

### Authentication Endpoints

#### Register a new user
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "token": "your-jwt-token"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "token": "your-jwt-token"
}
```

### Task Endpoints

#### Get all tasks
```
GET /api/tasks
Authorization: Bearer your-jwt-token
```

Response:
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task management API project",
    "status": "PENDING",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "userId": 1
  }
]
```

#### Get a specific task
```
GET /api/tasks/1
Authorization: Bearer your-jwt-token
```

Response:
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task management API project",
  "status": "PENDING",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "userId": 1
}
```

#### Create a new task
```
POST /api/tasks
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "title": "New task",
  "description": "Description for the new task",
  "status": "PENDING"
}
```

Response:
```json
{
  "id": 2,
  "title": "New task",
  "description": "Description for the new task",
  "status": "PENDING",
  "createdAt": "2023-01-02T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z",
  "userId": 1
}
```

#### Update a task
```
PUT /api/tasks/2
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "title": "Updated task",
  "status": "IN_PROGRESS"
}
```

Response:
```json
{
  "id": 2,
  "title": "Updated task",
  "description": "Description for the new task",
  "status": "IN_PROGRESS",
  "createdAt": "2023-01-02T00:00:00.000Z",
  "updatedAt": "2023-01-02T01:00:00.000Z",
  "userId": 1
}
```

#### Delete a task
```
DELETE /api/tasks/2
Authorization: Bearer your-jwt-token
```

Response:
```json
{
  "message": "Task deleted successfully"
}
```

## Deployment

This API can be deployed to platforms like Render, Railway, Heroku, or any other platform that supports Node.js applications.

## License

MIT

## Development

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio for database management

### Development Tools

- **Prisma Studio**: Visual database management tool
  ```bash
  npx prisma studio
  ```
  Access at: http://localhost:5555

- **Docker Commands**:
  ```bash
  # Start containers
  docker-compose up -d
  
  # Stop containers
  docker-compose down
  
  # View logs
  docker-compose logs -f
  ```
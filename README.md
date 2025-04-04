# Task Management API

A RESTful API for task management with user authentication built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- JWT Authentication
- Task CRUD operations with pagination, filtering, and sorting
- Secure password hashing
- Input validation
- Error handling
- Rate limiting for authentication endpoints
- PostgreSQL database with Prisma ORM
- Docker support for database

## Prerequisites

- Node.js (v14+ recommended)
- Docker and Docker Compose
- npm or yarn
- Git

## Project Structure

```
task-management-api/
├── src/
│   ├── controllers/   # Request handlers
│   ├── lib/          # Utility functions and configurations
│   ├── middleware/   # Express middleware
│   ├── routes/       # API routes
│   ├── types/        # TypeScript type definitions
│   └── server.ts     # Application entry point
├── prisma/          # Database schema and migrations
├── docker-compose.yml # Docker configuration
├── .env.example     # Environment variables template
└── package.json     # Project dependencies
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

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "your-jwt-token"
    }
  }
  ```

#### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "your-jwt-token"
    }
  }
  ```

### Tasks

#### Get All Tasks
- **URL**: `/api/tasks`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
  - `priority` (optional): Filter by priority (LOW, MEDIUM, HIGH, URGENT)
  - `isArchived` (optional): Filter by archived status (true/false)
  - `sortBy` (optional): Field to sort by (default: createdAt)
  - `sortOrder` (optional): Sort order (asc/desc, default: desc)
- **Response**:
  ```json
  {
    "message": "Tasks fetched successfully",
    "tasks": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
  ```

#### Get Task by ID
- **URL**: `/api/tasks/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Task fetched successfully",
    "task": {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "status": "PENDING",
      "priority": "MEDIUM",
      "dueDate": "2024-04-03T12:00:00Z",
      "tags": ["tag1", "tag2"],
      "isArchived": false,
      "createdAt": "2024-04-03T12:00:00Z",
      "updatedAt": "2024-04-03T12:00:00Z"
    }
  }
  ```

#### Create Task
- **URL**: `/api/tasks`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "status": "PENDING",
    "priority": "MEDIUM",
    "dueDate": "2024-04-03T12:00:00Z",
    "tags": ["tag1", "tag2"]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Task created successfully",
    "task": {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "status": "PENDING",
      "priority": "MEDIUM",
      "dueDate": "2024-04-03T12:00:00Z",
      "tags": ["tag1", "tag2"],
      "isArchived": false,
      "createdAt": "2024-04-03T12:00:00Z",
      "updatedAt": "2024-04-03T12:00:00Z"
    }
  }
  ```

#### Update Task
- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2024-04-04T12:00:00Z",
    "tags": ["tag1", "tag3"],
    "isArchived": false
  }
  ```
- **Response**:
  ```json
  {
    "message": "Task updated successfully",
    "task": {
      "id": "uuid",
      "title": "Updated title",
      "description": "Updated description",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2024-04-04T12:00:00Z",
      "tags": ["tag1", "tag3"],
      "isArchived": false,
      "createdAt": "2024-04-03T12:00:00Z",
      "updatedAt": "2024-04-03T12:00:00Z"
    }
  }
  ```

#### Delete Task
- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

## Testing with Postman

1. Import the `Task-Management-API.postman_collection.json` file into Postman
2. Create a new environment in Postman and add a variable named `token`
3. First, use the Register or Login endpoint to get a JWT token
4. Copy the token from the response and set it in your Postman environment
5. Now you can test all task endpoints with the token

## Deployment

This API can be deployed to platforms like Render, Railway, Heroku, or any other platform that supports Node.js applications.

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

## License

MIT
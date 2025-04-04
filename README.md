# Task Management API

A RESTful API for managing tasks with user authentication, built with Node.js, Express, TypeScript, and PostgreSQL.

## Live API
- Production URL: https://task-management-api-t8a6.onrender.com
- API Documentation: https://task-management-api-t8a6.onrender.com/api-docs
- Health Check: https://task-management-api-t8a6.onrender.com/healthz

## Postman Collections

### Development Collection
Download: [Task-Management-API-Dev.postman_collection.json](./postman/Task-Management-API-Dev.postman_collection.json)

Environment variables for development:
```json
{
  "baseUrl": "http://localhost:3000",
  "token": ""
}
```

### Production Collection
Download: [Task-Management-API-Prod.postman_collection.json](./postman/Task-Management-API-Prod.postman_collection.json)

Environment variables for production:
```json
{
  "baseUrl": "https://task-management-api-t8a6.onrender.com",
  "token": ""
}
```

### Testing Steps
1. Import the appropriate collection (Dev/Prod)
2. Import the environment variables
3. Register a new user:
   ```json
   POST {{baseUrl}}/auth/register
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "securepassword123"
   }
   ```
4. Login and copy the token:
   ```json
   POST {{baseUrl}}/auth/login
   {
     "email": "test@example.com",
     "password": "securepassword123"
   }
   ```
5. Set the token in your environment
6. Test other endpoints

## Features
- User authentication with JWT
- CRUD operations for tasks
- Task filtering and pagination
- Swagger/OpenAPI documentation
- Rate limiting for auth endpoints
- Health check endpoint
- Production-ready deployment configuration
- PostgreSQL database with Prisma ORM
- Docker support for local development

## Project Structure
```
task-management-api/
├── src/
│   ├── controllers/   # Request handlers
│   ├── lib/          # Utility functions and configurations
│   ├── middleware/   # Express middleware
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── types/        # TypeScript type definitions
│   └── server.ts     # Application entry point
├── prisma/          # Database schema and migrations
├── docker-compose.yml # Docker configuration
├── .env.example     # Environment variables template
└── package.json     # Project dependencies
```

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose (for local database)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-management-api.git
cd task-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management_db?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
```

4. Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- `POST /auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```

### Tasks
- `GET /tasks` - Get all tasks (with pagination and filtering)
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `status`: Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
    - `priority`: Filter by priority (LOW, MEDIUM, HIGH, URGENT)
    - `isArchived`: Filter by archived status
    - `sortBy`: Field to sort by (default: createdAt)
    - `sortOrder`: Sort order (asc, desc)

- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
  ```json
  {
    "title": "Complete project",
    "description": "Finish the task management API",
    "status": "PENDING",
    "priority": "HIGH",
    "dueDate": "2024-04-10T00:00:00Z",
    "tags": ["api", "backend"]
  }
  ```
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Testing with Postman

### Local Testing
1. Import the Postman collection
2. Use the `Development` environment with base URL: `http://localhost:3000`

### Production Testing
1. Create a new environment in Postman called "Production"
2. Set the following variables:
   - `baseUrl`: `https://task-management-api-t8a6.onrender.com`
   - `token`: Leave empty (will be filled after login)

3. Test Flow:
   a. Register a new user (POST `/auth/register`)
   b. Login (POST `/auth/login`)
   c. Copy the JWT token from the login response
   d. Set the token in your Postman environment
   e. Test other endpoints with the token

Example Postman Request Headers:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## Development Tools

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run format` - Format code
- `npx prisma studio` - Open Prisma Studio (http://localhost:5555)

### Docker Commands
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

## Deployment Status
- ✅ API Server: Running
- ✅ Database: PostgreSQL on Render
- ✅ Documentation: Swagger UI
- ✅ Health Check: Active
- ✅ Authentication: Working
- ✅ Task Management: Working

## Support
For any issues or questions, please:
1. Check the API documentation at `/api-docs`
2. Use the health check endpoint at `/healthz`
3. Ensure proper authentication headers are set
4. Verify request payload matches the schema

## License
MIT
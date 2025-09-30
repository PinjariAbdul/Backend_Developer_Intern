# TaskFlow Pro API Documentation

## Overview
TaskFlow Pro provides a RESTful API for task management with user authentication and role-based access control.

## Authentication
All API endpoints (except user registration and login) require token-based authentication.

### Obtaining a Token
To obtain an authentication token, register a new user or login with existing credentials.

#### Register a New User
```
POST /api/v1/users/register/
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Login
```
POST /api/v1/users/login/
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Using the Token
Include the token in the Authorization header for all protected requests:
```
Authorization: Token YOUR_TOKEN_HERE
```

## User Endpoints

### Register User
```
POST /api/v1/users/register/
```

**Permissions:** Public

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response Codes:**
- 201 Created - User registered successfully
- 400 Bad Request - Validation errors

### Login User
```
POST /api/v1/users/login/
```

**Permissions:** Public

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Codes:**
- 200 OK - Login successful
- 400 Bad Request - Validation errors
- 401 Unauthorized - Invalid credentials

## Task Endpoints

### List Tasks
```
GET /api/v1/tasks/
```

**Permissions:** Authenticated users

**Response:**
```json
[
  {
    "id": "integer",
    "title": "string",
    "description": "string",
    "created_by": "integer",
    "created_at": "datetime",
    "updated_at": "datetime",
    "is_completed": "boolean"
  }
]
```

**Notes:**
- Regular users only see their own tasks
- Admin users see all tasks

**Response Codes:**
- 200 OK - Tasks retrieved successfully
- 401 Unauthorized - Missing or invalid token

### Create Task
```
POST /api/v1/tasks/
```

**Permissions:** Authenticated users

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "created_by": "integer",
  "created_at": "datetime",
  "updated_at": "datetime",
  "is_completed": "boolean"
}
```

**Response Codes:**
- 201 Created - Task created successfully
- 400 Bad Request - Validation errors
- 401 Unauthorized - Missing or invalid token

### Retrieve Task
```
GET /api/v1/tasks/{id}/
```

**Permissions:** Task owner or admin

**Response:**
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "created_by": "integer",
  "created_at": "datetime",
  "updated_at": "datetime",
  "is_completed": "boolean"
}
```

**Response Codes:**
- 200 OK - Task retrieved successfully
- 401 Unauthorized - Missing or invalid token
- 403 Forbidden - User doesn't have permission to access this task
- 404 Not Found - Task with specified ID doesn't exist

### Update Task
```
PUT /api/v1/tasks/{id}/
```

**Permissions:** Task owner or admin

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "is_completed": "boolean"
}
```

**Response:**
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "created_by": "integer",
  "created_at": "datetime",
  "updated_at": "datetime",
  "is_completed": "boolean"
}
```

**Response Codes:**
- 200 OK - Task updated successfully
- 400 Bad Request - Validation errors
- 401 Unauthorized - Missing or invalid token
- 403 Forbidden - User doesn't have permission to update this task
- 404 Not Found - Task with specified ID doesn't exist

### Partially Update Task
```
PATCH /api/v1/tasks/{id}/
```

**Permissions:** Task owner or admin

**Request Body (example for marking complete):**
```json
{
  "is_completed": true
}
```

**Response:**
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "created_by": "integer",
  "created_at": "datetime",
  "updated_at": "datetime",
  "is_completed": "boolean"
}
```

**Response Codes:**
- 200 OK - Task updated successfully
- 400 Bad Request - Validation errors
- 401 Unauthorized - Missing or invalid token
- 403 Forbidden - User doesn't have permission to update this task
- 404 Not Found - Task with specified ID doesn't exist

### Delete Task
```
DELETE /api/v1/tasks/{id}/
```

**Permissions:** Task owner or admin

**Response Codes:**
- 204 No Content - Task deleted successfully
- 401 Unauthorized - Missing or invalid token
- 403 Forbidden - User doesn't have permission to delete this task
- 404 Not Found - Task with specified ID doesn't exist

## Error Responses

### Validation Errors
```json
{
  "field_name": [
    "Error message"
  ]
}
```

### Authentication Errors
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Permission Errors
```json
{
  "error": "Permission denied"
}
```

## Rate Limiting
- Anonymous users: 100 requests per hour
- Authenticated users: 1000 requests per hour

## Status Codes
- 200 OK - Successful GET, PUT, PATCH requests
- 201 Created - Successful POST requests
- 204 No Content - Successful DELETE requests
- 400 Bad Request - Invalid request data
- 401 Unauthorized - Missing or invalid authentication
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource doesn't exist
- 429 Too Many Requests - Rate limit exceeded
- 500 Internal Server Error - Server error
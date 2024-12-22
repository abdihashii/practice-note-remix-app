# Notes App API Documentation

## Overview

RESTful API for the Notes application. All requests to protected endpoints must include:

- `Authorization: Bearer <access_token>` header
- `X-CSRF-Token: <csrf_token>` header for mutations (POST, PUT, DELETE)

## Base URLs

- Development: `http://localhost:8000`
- Production: `${APP_URL}`

## Authentication

### Register New User

```http
POST /auth/register
Content-Type: application/json
X-CSRF-Token: <csrf_token>

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

Password must contain:

- 8-128 characters
- 1+ uppercase letter
- 1+ lowercase letter
- 1+ number
- 1+ special character (!@#$%^&\*()\_+-=[]{}|;:,.<>?)

Response `200 OK`:

```json
{
  "user": {
    "id": "random_uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-03-20T12:00:00Z",
    "updatedAt": "2024-03-20T12:00:00Z",
    "emailVerified": false,
    "isActive": true,
    "settings": {
      "theme": "system",
      "language": "en",
      "timezone": "UTC"
    },
    "notificationPreferences": {
      "email": {
        "enabled": false,
        "digest": "never",
        "marketing": false
      },
      "push": {
        "enabled": false,
        "alerts": false
      }
    },
    "lastActivityAt": null,
    "lastSuccessfulLogin": "2024-03-20T12:00:00Z",
    "loginCount": 1
  },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json
X-CSRF-Token: <csrf_token>

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response: Same as register

### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json
X-CSRF-Token: <csrf_token>

{
  "refreshToken": "current_refresh_token"
}
```

Response `200 OK`:

```json
{
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### Logout

```http
POST /auth/logout
Content-Type: application/json
X-CSRF-Token: <csrf_token>

{
  "refreshToken": "current_refresh_token"
}
```

Response `200 OK`:

```json
{
  "message": "Logged out successfully"
}
```

## Error Responses

### 400 Bad Request

**Description**:

```json
{
  "error": "Invalid input",
  "details": ["Error details..."]
}
```

### 401 Unauthorized

```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden

```json
{
  "error": "Invalid or missing CSRF token"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Operation failed"
}
```

## Security Notes

1. **Authentication**:

   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
   - Passwords hashed with Argon2id

2. **CSRF Protection**:

   - Required for all mutations (POST, PUT, DELETE)
   - Token in `X-CSRF-Token` header

3. **Authorization**:

   - JWT validation on all protected routes
   - Secure password requirements
   - Token rotation on refresh

4. **Security Headers**:
   - Content Security Policy
   - XSS Protection
   - Frame Options
   - Content Type Options
   - Referrer Policy
   - Strict Transport Security (HSTS)

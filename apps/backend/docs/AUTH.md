# Authentication & Authorization Guide

## Overview

This guide explains how authentication (AuthN) and authorization (AuthZ) work in our API. We'll cover the journey of a request from the moment it hits our API to how we ensure secure access to resources.

## Authentication Flow 🔄

Our API implements a standard JWT-based authentication flow with refresh tokens.

### 1. Registration

```typescript
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

### 2. Login

```typescript
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response (same as registration)
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

### 3. Token Refresh

When the access token expires, use the refresh token to get a new pair:

```typescript
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbG..."
}

// Response
{
  "accessToken": "new_token...",
  "refreshToken": "new_refresh_token..."
}
```

### 4. Logout

Invalidates both access and refresh tokens:

```typescript
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGc...

// Response
{
  "message": "Successfully logged out"
}
```

### Token Lifecycle

1. **Access Token**

   - Short-lived (15 minutes)
   - Used for API requests
   - Sent in Authorization header

2. **Refresh Token**
   - Longer-lived (7 days)
   - Used only for getting new access tokens
   - One-time use (rotated on refresh)
   - Invalidated on logout

### Security Measures

- Passwords are hashed using bcrypt
- Refresh tokens are single-use
- Token invalidation on logout
- Rate limiting on auth endpoints (planned)
- IP-based blocking on multiple failed attempts (planned)

## The Authentication Journey 🛣️

### 1. Initial Request

When a client makes a request to a protected endpoint (any route under `/api/v1` except `/auth`), the journey begins at our authentication middleware. The middleware's primary job is to validate the user's identity through a JWT (JSON Web Token).

```typescript
// A typical protected request
GET /api/v1/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 2. Token Verification Process

Our `verifyJWT` middleware performs several checks in sequence:

1. **Token Presence**

   - Checks if the Authorization header exists and contains a Bearer token
   - Returns a generic "Authentication required" if missing

2. **Token Validation**

   - Verifies the token's signature using our secret key
   - Validates the token's format and contents (e.g. `exp`, `iat`, `userId`)
   - All validation failures return a generic "Authentication failed" message

3. **Expiration Check**

   - Ensures the token hasn't expired
   - Uses standardized JWT `exp` claim

4. **Token Invalidation Check**
   - Verifies the token wasn't invalidated (e.g., by logout or password change)
   - Compares token issue time against last invalidation time

### 3. Request Context

Once authenticated, the user's ID is added to the request context:

```typescript
c.set('userId', payload.userId);
```

This makes the user's identity available to subsequent middleware and route handlers.

## Authorization Model 🔒

### Resource Access Control

Currently, our authorization is simple and binary:

- Authenticated users can access their own resources
- No role-based or permission-based access control yet

Example from a note route:

```typescript
// User can only access their own notes
const notes = await db.query.notesTable.findMany({
	where: eq(notesTable.userId, c.get('userId')),
});
```

## Security Features 🛡️

### Error Handling

We implement secure error handling practices:

- Generic error messages to prevent information leakage
- Detailed logging for debugging (not exposed to clients)
- Consistent error format for frontend handling

### Token Management

- JWTs are signed using HS256 algorithm
- Tokens include essential claims (exp, iat, userId)
- Server-side invalidation support through `lastTokenInvalidation`

## Known Limitations 🚧

Our current auth system has some limitations that are planned for improvement:

1. **Token Security** (Phase 2 - [High Priority](../ROADMAP.md#high-priority-security-enhancements-))

   - No token reuse detection yet
   - Missing token context binding
   - Basic token rotation system

2. **Authorization** (Phase 4 - [Security Enhancements](../ROADMAP.md#phase-4-security-enhancements-))

   - No fine-grained permissions
   - Missing role-based access control
   - Limited API key support for service-to-service auth

3. **Rate Limiting** (Phase 1 - [Quick Wins](../ROADMAP.md#api-protection--rate-limiting))
   - No rate limiting per user/IP
   - Missing request timeout handling

## Best Practices & Guidelines 📚

### For Frontend Integration

1. **Token Storage**

   - Store tokens in memory or secure HTTP-only cookies
   - Never store in localStorage due to XSS vulnerability
   - Clear tokens on logout/session end

2. **Error Handling**
   - Implement proper token refresh flow by using refresh tokens from the backend
   - Handle authentication errors gracefully
   - Redirect to login when needed

### For Backend Development

1. **Adding Protected Routes**

   ```typescript
   // Always add verifyJWT middleware for protected routes
   api.use('*', verifyJWT);
   api.route('/protected', protectedRoutes);
   ```

2. **User Context**
   ```typescript
   // Always use the userId from context, never trust client input
   const userId = c.get('userId');
   ```

## Future Improvements 🚀

See our [ROADMAP.md](../ROADMAP.md) for planned improvements, including:

1. **Short Term**

   - Token reuse detection
   - Request rate limiting
   - API versioning

2. **Medium Term**

   - Role-based access control
   - API key management
   - Audit logging

3. **Long Term**
   - Fine-grained permissions
   - OAuth2 integration
   - Multi-factor authentication

## Security Considerations 🔐

1. **Token Lifetime**

   - Access tokens: Short-lived (currently 15 minutes)
   - Refresh tokens: Longer-lived (currently 7 days)
   - Consider your use case when adjusting these values

2. **Error Messages**

   - We use generic error messages in production
   - Detailed errors are logged but never sent to clients
   - Helps prevent security information leakage

3. **CORS & Security Headers**
   - Strict CORS policy in production so that only our frontend can access the API
   - Essential security headers implemented
   - Protection against common web vulnerabilities

## Debugging Tips 🔍

1. **Common Issues**

   - Token expiration
   - Invalid signatures
   - Missing Authorization header

2. **Logging**
   - Detailed logs available in server console
   - Includes request context and error details
   - Use correlation IDs for request tracking

## Contributing 🤝

When adding or modifying auth-related code:

1. Follow security best practices
2. Maintain generic error messages
3. Add appropriate logging
4. Update this documentation
5. Consider implications for existing clients

## Questions & Support 💬

For questions about authentication or authorization:

1. Check this documentation
2. Review the [ROADMAP.md](../ROADMAP.md) for planned features
3. Consult the security team for complex scenarios

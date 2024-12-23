// Third-party imports
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { MiddlewareHandler } from "hono/types";

// Local imports
import { SecurityErrorType, type CustomEnv, type ErrorResponse } from "@/types";

// Security event logger
export class SecurityLogger {
  static log(
    context: Context,
    type: SecurityErrorType,
    message: string,
    details?: Record<string, unknown>
  ) {
    const event = {
      type,
      message,
      timestamp: new Date().toISOString(),
      requestId: context.req.header("x-request-id"),
      ip:
        context.req.header("x-forwarded-for") ||
        context.req.header("x-real-ip"),
      userAgent: context.req.header("user-agent"),
      method: context.req.method,
      path: context.req.path,
      details,
    };

    // In production, you might want to send this to a logging service
    if (process.env.NODE_ENV === "production") {
      // TODO: Implement production logging service
      // Example: await logstashClient.send(event);
    }

    // Console log for development and as backup in production
    console.error("[Security Event]", JSON.stringify(event, null, 2));
  }
}

// Create standardized error response
function createErrorResponse(
  type: SecurityErrorType,
  message: string,
  code: number,
  context: Context,
  details?: Record<string, unknown>
): ErrorResponse {
  const response: ErrorResponse = {
    error: {
      type,
      message,
      code,
      timestamp: new Date().toISOString(),
      requestId: context.req.header("x-request-id"),
    },
  };

  if (details) {
    response.error.details = details;
  }

  return response;
}

// Error handler middleware
export const errorHandler: MiddlewareHandler<CustomEnv> = async (c, next) => {
  try {
    await next();
  } catch (error) {
    console.error("Error caught in middleware:", error);

    let errorResponse: ErrorResponse;
    let statusCode = 500;

    if (error instanceof HTTPException) {
      // Handle Hono HTTP exceptions
      const type =
        error.status === 403
          ? SecurityErrorType.AUTHORIZATION
          : SecurityErrorType.SECURITY_POLICY;

      statusCode = error.status;
      errorResponse = createErrorResponse(type, error.message, statusCode, c);

      SecurityLogger.log(c, type, error.message);
    } else if (error instanceof Error) {
      // Handle other known errors
      let type = SecurityErrorType.SECURITY_POLICY;

      // Categorize common security-related errors
      if (error.message.includes("token")) {
        type = SecurityErrorType.INVALID_TOKEN;
        statusCode = 401;
      } else if (
        error.message.includes("permission") ||
        error.message.includes("unauthorized")
      ) {
        type = SecurityErrorType.AUTHORIZATION;
        statusCode = 403;
      } else if (error.message.includes("csrf")) {
        type = SecurityErrorType.CSRF;
        statusCode = 403;
      }

      errorResponse = createErrorResponse(
        type,
        error.message,
        statusCode,
        c,
        process.env.NODE_ENV === "development"
          ? { stack: error.stack }
          : undefined
      );

      SecurityLogger.log(c, type, error.message);
    } else {
      // Handle unknown errors
      errorResponse = createErrorResponse(
        SecurityErrorType.SECURITY_POLICY,
        "An unexpected error occurred",
        statusCode,
        c
      );

      SecurityLogger.log(
        c,
        SecurityErrorType.SECURITY_POLICY,
        "Unknown error type encountered",
        { error: String(error) }
      );
    }

    // Set security headers for error responses
    c.header("X-Content-Type-Options", "nosniff");
    c.header("X-Frame-Options", "DENY");

    return c.json(errorResponse);
  }
};

// Authentication error handler
export function handleAuthError(
  c: Context,
  message: string,
  details?: Record<string, unknown>
) {
  const errorResponse = createErrorResponse(
    SecurityErrorType.AUTHENTICATION,
    message,
    401,
    c,
    details
  );

  SecurityLogger.log(c, SecurityErrorType.AUTHENTICATION, message, details);
  return c.json(errorResponse);
}

// Authorization error handler
export function handleAuthzError(
  c: Context,
  message: string,
  details?: Record<string, unknown>
) {
  const errorResponse = createErrorResponse(
    SecurityErrorType.AUTHORIZATION,
    message,
    403,
    c,
    details
  );

  SecurityLogger.log(c, SecurityErrorType.AUTHORIZATION, message, details);
  return c.json(errorResponse);
}

// Token error handler
export function handleTokenError(
  c: Context,
  message: string,
  details?: Record<string, unknown>
) {
  const errorResponse = createErrorResponse(
    SecurityErrorType.INVALID_TOKEN,
    message,
    401,
    c,
    details
  );

  SecurityLogger.log(c, SecurityErrorType.INVALID_TOKEN, message, details);
  return c.json(errorResponse);
}

// CSRF error handler
export function handleCSRFError(
  c: Context,
  message: string,
  details?: Record<string, unknown>
) {
  const errorResponse = createErrorResponse(
    SecurityErrorType.CSRF,
    message,
    403,
    c,
    details
  );

  SecurityLogger.log(c, SecurityErrorType.CSRF, message, details);
  return c.json(errorResponse);
}

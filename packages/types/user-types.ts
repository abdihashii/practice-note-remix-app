/**
 * Response type for successful authentication operations.
 * Contains both the user data and the JWT tokens needed for API access.
 * The refresh token is used to obtain new access tokens when they expire.
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserSettings {
  theme: "system" | "light" | "dark";
  language: string;
  timezone: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    digest: "never" | "daily" | "weekly" | "monthly";
    marketing: boolean;
  };
  push: {
    enabled: boolean;
    alerts: boolean;
  };
}

/**
 * Represents a user in the system.
 * This is the safe user type that excludes sensitive information like passwords and tokens.
 * Used for client-side rendering and API responses.
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  isActive: boolean;
  deletedAt: string | null;
  settings: UserSettings /** JSON object for user preferences */;
  notificationPreferences: NotificationPreferences /** JSON object for notification settings */;
  lastActivityAt: string | null;
  lastSuccessfulLogin: string | null;
  loginCount: number;
}

/**
 * Data Transfer Object (DTO) for user registration.
 * Contains only the essential fields needed to create a new user account.
 * Additional user data can be updated after registration.
 */
export interface CreateUserDto {
  email: string;
  password: string /** Will be hashed server-side */;
  name?: string;
}

/**
 * Data Transfer Object (DTO) for updating user profile information.
 * All fields are optional since any subset of properties can be updated.
 * Sensitive operations like password changes trigger additional security measures.
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string /** Will be hashed server-side */;
  settings?: Record<string, unknown>;
  notificationPreferences?: Record<string, unknown>;
  theme?: string;
}

/**
 * Represents a note in the system.
 * This is the full note type as stored in the database and returned by the API.
 * Contains all note properties including metadata like timestamps and ownership.
 */
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string | null /** Can be null for empty notes */;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

/**
 * Data Transfer Object (DTO) for creating a new note.
 * Contains only the fields that can be set during note creation.
 * Other fields like id and timestamps are handled by the server.
 */
export interface CreateNoteDto {
  title: string;
  content?: string;
  favorite?: boolean;
}

/**
 * Data Transfer Object (DTO) for updating an existing note.
 * All fields are optional since any subset of properties can be updated.
 * Timestamps and IDs are automatically updated by the server.
 */
export interface UpdateNoteDto {
  title?: string;
  content?: string;
  favorite?: boolean;
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
  settings: Record<string, unknown> /** JSON object for user preferences */;
  notificationPreferences: Record<
    string,
    unknown
  > /** JSON object for notification settings */;
  theme: string;
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

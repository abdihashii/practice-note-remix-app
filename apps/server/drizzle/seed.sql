-- Insert a test user
INSERT INTO "users" (
    id,
    email,
    hashed_password,
    name,
    created_at,
    updated_at,
    email_verified,
    is_active,
    settings,
    notification_preferences,
    login_count
) VALUES (
    '94e0f505-2c87-4735-aac7-5f9e1d2b79ea',  -- Fixed UUID for testing
    'test+2@example.com',
    '$2b$10$6YgKtZHbN7hTKY.C.VhgYOxqH/t9yNPkJHZF5KPZsWBzKIp8VZKHm',  -- hashed value of 'password123'
    'Test User 2',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true,
    true,
    '{"theme": "system", "language": "en", "timezone": "cst"}',
    '{
      "email": {
        "enabled": false,
        "digest": "never",
        "marketing": false
      },
      "push": {
        "enabled": false,
        "alerts": false
      }
    }',
    1
);

-- Insert a test note for this user
INSERT INTO "notes" (
    title,
    content,
    user_id,
    favorite
) VALUES (
    'Welcome Note',
    'Welcome to your notes app! This is your first note.',
    '94e0f505-2c87-4735-aac7-5f9e1d2b79ea',
    true
);
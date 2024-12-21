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
    theme,
    login_count
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  -- Fixed UUID for testing
    'test@example.com',
    '$2b$10$6YgKtZHbN7hTKY.C.VhgYOxqH/t9yNPkJHZF5KPZsWBzKIp8VZKHm',  -- hashed value of 'password123'
    'Test User',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true,
    true,
    '{"language": "en"}',
    '{"email": true, "push": false}',
    'light',
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
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    true
);
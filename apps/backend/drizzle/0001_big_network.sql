-- First add the column if it doesn't exist
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "user_id" uuid;

-- Then add the foreign key constraint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

-- Optionally, create a default user and assign notes (if you want to preserve existing notes)
DO $$
DECLARE
    default_user_id uuid;
BEGIN
    -- Create default user if not exists
    INSERT INTO users (email, hashed_password, name)
    VALUES ('default@example.com', 'CHANGE_THIS_PASSWORD_HASH', 'Default User')
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO default_user_id;

    -- If we didn't insert (because of conflict), get the existing default user's id
    IF default_user_id IS NULL THEN
        SELECT id INTO default_user_id
        FROM users
        WHERE email = 'default@example.com'
        LIMIT 1;
    END IF;

    -- Update existing notes with the default user
    UPDATE notes 
    SET user_id = default_user_id
    WHERE user_id IS NULL;
END $$;
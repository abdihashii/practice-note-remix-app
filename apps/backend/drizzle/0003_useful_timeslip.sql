CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"hashed_password" varchar(255) NOT NULL,
	"name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"refresh_token" text,
	"refresh_token_expires_at" timestamp with time zone,
	"last_token_invalidation" timestamp with time zone,
	"email_verified" boolean DEFAULT false,
	"verification_token" text,
	"verification_token_expiry" timestamp with time zone,
	"reset_token" text,
	"reset_token_expires_at" timestamp with time zone,
	"last_password_change" timestamp with time zone,
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp with time zone,
	"settings" jsonb DEFAULT '{"theme":"system","language":"en","timezone":"UTC"}'::jsonb,
	"notification_preferences" jsonb DEFAULT '{"email":{"enabled":true,"digest":"daily","marketing":false},"push":{"enabled":true,"alerts":true}}'::jsonb,
	"last_activity_at" timestamp with time zone,
	"last_successful_login" timestamp with time zone,
	"login_count" integer DEFAULT 0,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
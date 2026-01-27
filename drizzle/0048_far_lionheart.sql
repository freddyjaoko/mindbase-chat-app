CREATE TABLE IF NOT EXISTS "daily_briefings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"content" text NOT NULL,
	"model" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "model" SET DEFAULT 'claude-sonnet-4-5-20250929';--> statement-breakpoint
ALTER TABLE "tenants" ALTER COLUMN "default_model" SET DEFAULT 'claude-sonnet-4-5-20250929';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "insight_model" text DEFAULT 'claude-sonnet-4-5-20250929';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_briefings" ADD CONSTRAINT "daily_briefings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_briefings" ADD CONSTRAINT "daily_briefings_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_briefings_profile_idx" ON "daily_briefings" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_briefings_tenant_profile_idx" ON "daily_briefings" USING btree ("tenant_id","profile_id");
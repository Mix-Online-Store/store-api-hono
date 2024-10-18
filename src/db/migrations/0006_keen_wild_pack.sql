CREATE TABLE IF NOT EXISTS "apiKeys" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accessKey" text NOT NULL,
	"expired" timestamp NOT NULL,
	"plan" "plan" DEFAULT 'free',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apiKeys" ADD CONSTRAINT "apiKeys_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

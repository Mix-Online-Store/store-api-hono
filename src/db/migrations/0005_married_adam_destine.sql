DO $$ BEGIN
 CREATE TYPE "public"."plan" AS ENUM('admin', 'free', 'basic', 'premium', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

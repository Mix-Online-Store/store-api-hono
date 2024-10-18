CREATE TABLE IF NOT EXISTS "orderTotals" (
	"id" text PRIMARY KEY NOT NULL,
	"subtotal" double precision,
	"discount" double precision,
	"total" double precision,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "orderTotalId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_orderTotalId_orderTotals_id_fk" FOREIGN KEY ("orderTotalId") REFERENCES "public"."orderTotals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "items";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "orderTotal";
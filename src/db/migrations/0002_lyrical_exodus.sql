DROP TABLE "orderItems";--> statement-breakpoint
DROP TABLE "orderTotals";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "items" json;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "orderTotal" json;
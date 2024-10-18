DO $$ BEGIN
 CREATE TYPE "public"."couponStatus" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."discountType" AS ENUM('fixed', 'percentage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."orderStatus" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."paymentMethod" AS ENUM('cash_on_delivery', 'prepaid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'user', 'delivery');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"street" text,
	"city" text,
	"state" text,
	"postalCode" text,
	"country" text,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brands" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subCategoryId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "couponCodes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discountType" "discountType" NOT NULL,
	"discountAmount" double precision NOT NULL,
	"minimunPurchaseAmount" double precision NOT NULL,
	"endDate" timestamp NOT NULL,
	"status" "couponStatus" DEFAULT 'active' NOT NULL,
	"applicableCategoryId" text,
	"applicableSubCategoryId" text,
	"applicableProductId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"notificationId" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1,
	CONSTRAINT "notifications_notificationId_unique" UNIQUE("notificationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posters" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"price" double precision NOT NULL,
	"offerPrice" double precision,
	"categoryId" text NOT NULL,
	"subCategoryId" text,
	"brandId" text,
	"variantTypeId" text,
	"variantId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcategories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"categoryId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"refreshToken" text NOT NULL,
	"ip" text,
	"userAgent" text,
	"isValid" boolean DEFAULT true NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1,
	CONSTRAINT "tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"verificationToken" text,
	"isVerified" boolean DEFAULT false NOT NULL,
	"verified" timestamp,
	"passwordToken" text,
	"passwordTokenExpirationDate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variantTypes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"variantTypeId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"deletedAt" timestamp,
	"updateCounter" integer DEFAULT 1
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "brands" ADD CONSTRAINT "brands_subCategoryId_subcategories_id_fk" FOREIGN KEY ("subCategoryId") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "couponCodes" ADD CONSTRAINT "couponCodes_applicableCategoryId_categories_id_fk" FOREIGN KEY ("applicableCategoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "couponCodes" ADD CONSTRAINT "couponCodes_applicableSubCategoryId_subcategories_id_fk" FOREIGN KEY ("applicableSubCategoryId") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "couponCodes" ADD CONSTRAINT "couponCodes_applicableProductId_products_id_fk" FOREIGN KEY ("applicableProductId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_subcategories_id_fk" FOREIGN KEY ("subCategoryId") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_brandId_brands_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_variantTypeId_variantTypes_id_fk" FOREIGN KEY ("variantTypeId") REFERENCES "public"."variantTypes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_variantId_variants_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."variants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variants" ADD CONSTRAINT "variants_variantTypeId_variantTypes_id_fk" FOREIGN KEY ("variantTypeId") REFERENCES "public"."variantTypes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

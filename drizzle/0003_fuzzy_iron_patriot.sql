ALTER TABLE "orders" ALTER COLUMN "pay_channel" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "address_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pay_client" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "store_order_no" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "third_party_order_no" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fail_reason" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "aotu_renew" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "user_id" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sales_volume" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "price" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "original_price" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "product_variant_id" varchar(30) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_variant_id_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "stripe_payment_intent_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "stripe_payment_intent_status";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "email";
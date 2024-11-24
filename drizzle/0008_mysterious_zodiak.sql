ALTER TABLE "stocks" ADD COLUMN "variant_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_values" ADD COLUMN "variant_code" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stocks_product_variant_code_idx" ON "stocks" USING btree ("variant_code");--> statement-breakpoint
ALTER TABLE "product_variant_values" DROP COLUMN IF EXISTS "sku_code";
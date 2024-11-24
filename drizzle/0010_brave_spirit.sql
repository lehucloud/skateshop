DROP INDEX IF EXISTS "stocks_product_variant_code_idx";--> statement-breakpoint
ALTER TABLE "stocks" DROP COLUMN IF EXISTS "variant_code";--> statement-breakpoint
ALTER TABLE "product_variant_values" DROP COLUMN IF EXISTS "variant_code";
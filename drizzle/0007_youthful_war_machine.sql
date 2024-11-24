ALTER TABLE "stocks" DROP CONSTRAINT "stocks_product_variant_id_product_variants_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "stocks_product_variant_id_idx";--> statement-breakpoint
ALTER TABLE "product_variant_values" DROP CONSTRAINT "product_variant_values_pk";--> statement-breakpoint
ALTER TABLE "stocks" DROP COLUMN IF EXISTS "product_variant_id";
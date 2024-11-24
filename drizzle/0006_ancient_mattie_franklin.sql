ALTER TABLE "product_variant_values" DROP CONSTRAINT "product_variant_values_stock_id_stocks_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "variant_values_stock_id_idx";--> statement-breakpoint
ALTER TABLE "product_variant_values" ALTER COLUMN "sku_code" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "sku_code" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_values" DROP COLUMN IF EXISTS "price";--> statement-breakpoint
ALTER TABLE "product_variant_values" DROP COLUMN IF EXISTS "stock_id";
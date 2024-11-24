ALTER TABLE "product_variant_values" ADD COLUMN "stock_id" varchar(30) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variant_values" ADD CONSTRAINT "product_variant_values_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

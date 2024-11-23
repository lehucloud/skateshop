DO $$ BEGIN
 CREATE TYPE "public"."pay_channel" AS ENUM('wxpay', 'alipay');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pay_channel" "pay_channel" NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "pay_channel" "pay_channel" NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "icon" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "config" json DEFAULT 'null'::json;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "enabled" boolean DEFAULT true NOT NULL;
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phoneVerified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phoneVerified" SET DEFAULT false;
ALTER TABLE "user" ALTER COLUMN "emailVerified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phoneVerified" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phoneVerified" DROP DEFAULT;
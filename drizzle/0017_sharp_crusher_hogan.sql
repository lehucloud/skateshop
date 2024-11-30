ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" DROP NOT NULL;
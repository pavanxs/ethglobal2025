ALTER TABLE "campaigns" ADD COLUMN "under_review" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "validator_decision" varchar(20);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "validator_account_id" varchar(255);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "validator_rating" "content_category";--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "validator_comments" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "reviewed_at" timestamp;
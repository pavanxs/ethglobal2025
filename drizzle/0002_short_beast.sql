ALTER TABLE "campaigns" ADD COLUMN "hcs_message_status" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hcs_topic_creation_tx_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hcs_topic_memo" text;
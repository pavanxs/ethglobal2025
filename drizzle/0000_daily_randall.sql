CREATE TYPE "public"."ad_status" AS ENUM('Pending Validation', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('Pending Review', 'Active', 'Paused', 'Rejected', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."content_category" AS ENUM('PG', 'Family-Friendly', 'Adult', 'Informative', 'Promotional', 'Unsuitable');--> statement-breakpoint
CREATE TYPE "public"."persona_type" AS ENUM('AI_AGENT_OWNER', 'ADVERTISER', 'VALIDATOR');--> statement-breakpoint
CREATE TABLE "ad_link_opens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad_id" uuid NOT NULL,
	"agent_id" uuid,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45)
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"ad_content" text NOT NULL,
	"tracked_link" varchar(500) NOT NULL,
	"advertiser_submitted_category" "content_category" NOT NULL,
	"validator_grade" "content_category",
	"status" "ad_status" DEFAULT 'Pending Validation' NOT NULL,
	"pinecone_vector_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ads_pinecone_vector_id_unique" UNIQUE("pinecone_vector_id")
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"api_endpoint" varchar(500) NOT NULL,
	"api_key" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agents_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"ad_content" text NOT NULL,
	"tracked_link" varchar(500) NOT NULL,
	"advertiser_submitted_category" "content_category" NOT NULL,
	"budget" numeric(10, 2) DEFAULT '0.00',
	"spent" numeric(10, 2) DEFAULT '0.00',
	"duration_start" timestamp,
	"duration_end" timestamp,
	"targeting_keywords" json,
	"bid_amount" numeric(10, 2),
	"status" "campaign_status" DEFAULT 'Pending Review' NOT NULL,
	"impressions" numeric(10, 0) DEFAULT '0',
	"link_opens" numeric(10, 0) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monetization_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"category" "content_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"persona_type" "persona_type" NOT NULL,
	"name" varchar(255),
	"account_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ad_link_opens" ADD CONSTRAINT "ad_link_opens_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_link_opens" ADD CONSTRAINT "ad_link_opens_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monetization_preferences" ADD CONSTRAINT "monetization_preferences_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
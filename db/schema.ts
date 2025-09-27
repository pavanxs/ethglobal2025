import { pgTable, uuid, varchar, text, timestamp, decimal, pgEnum, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const personaTypeEnum = pgEnum('persona_type', ['AI_AGENT_OWNER', 'ADVERTISER', 'VALIDATOR']);
export const campaignStatusEnum = pgEnum('campaign_status', ['Pending Review', 'Active', 'Paused', 'Rejected', 'Completed']);
export const contentCategoryEnum = pgEnum('content_category', ['PG', 'Family-Friendly', 'Adult', 'Informative', 'Promotional', 'Unsuitable']);
export const adStatusEnum = pgEnum('ad_status', ['Pending Validation', 'Approved', 'Rejected']);

// Users table - for hardcoded judge accounts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  personaType: personaTypeEnum('persona_type').notNull(),
  name: varchar('name', { length: 255 }),
  accountId: varchar('account_id', { length: 255 }).notNull(), // Hedera Account ID
  hcsTopicId: varchar('hcs_topic_id', { length: 255 }), // HCS Topic ID for this user's campaigns
  hcsTopicCreationTxId: varchar('hcs_topic_creation_tx_id', { length: 255 }), // Transaction ID for topic creation
  hcsTopicMemo: text('hcs_topic_memo'), // Topic memo/description
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Agents table
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  apiEndpoint: varchar('api_endpoint', { length: 500 }).notNull(),
  apiKey: varchar('api_key', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Monetization preferences table
export const monetizationPreferences = pgTable('monetization_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  category: contentCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  adContent: text('ad_content').notNull(),
  trackedLink: varchar('tracked_link', { length: 500 }).notNull(),
  advertiserSubmittedCategory: contentCategoryEnum('advertiser_submitted_category').notNull(),
  budget: decimal('budget', { precision: 10, scale: 2 }).default('0.00'),
  spent: decimal('spent', { precision: 10, scale: 2 }).default('0.00'),
  durationStart: timestamp('duration_start'),
  durationEnd: timestamp('duration_end'),
  targetingKeywords: json('targeting_keywords').$type<string[]>(),
  bidAmount: decimal('bid_amount', { precision: 10, scale: 2 }),
  status: campaignStatusEnum('status').notNull().default('Pending Review'),
  impressions: decimal('impressions', { precision: 10, scale: 0 }).default('0'),
  linkOpens: decimal('link_opens', { precision: 10, scale: 0 }).default('0'),
  hcsMessageId: varchar('hcs_message_id', { length: 255 }), // HCS message transaction ID
  hcsMessageStatus: varchar('hcs_message_status', { length: 50 }), // HCS message status
  // New review status columns
  underReview: boolean('under_review').notNull().default(true), // Is currently under validator review
  validatorDecision: varchar('validator_decision', { length: 20 }), // 'approved' or 'rejected'
  validatorAccountId: varchar('validator_account_id', { length: 255 }), // Which validator made the decision
  validatorRating: contentCategoryEnum('validator_rating'), // Validator assigned rating
  validatorComments: text('validator_comments'), // Validator feedback
  reviewedAt: timestamp('reviewed_at'), // When the review was completed
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Ads table (validated ad instances)
export const ads = pgTable('ads', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  adContent: text('ad_content').notNull(),
  trackedLink: varchar('tracked_link', { length: 500 }).notNull(),
  advertiserSubmittedCategory: contentCategoryEnum('advertiser_submitted_category').notNull(),
  validatorGrade: contentCategoryEnum('validator_grade'),
  status: adStatusEnum('status').notNull().default('Pending Validation'),
  pineconeVectorId: varchar('pinecone_vector_id', { length: 255 }).unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Ad link opens table (for verification)
export const adLinkOpens = pgTable('ad_link_opens', {
  id: uuid('id').primaryKey().defaultRandom(),
  adId: uuid('ad_id').notNull().references(() => ads.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id').references(() => agents.id),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 })
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  agents: many(agents),
  campaigns: many(campaigns)
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id]
  }),
  monetizationPreferences: many(monetizationPreferences),
  adLinkOpens: many(adLinkOpens)
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id]
  }),
  ads: many(ads)
}));

export const adsRelations = relations(ads, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [ads.campaignId],
    references: [campaigns.id]
  }),
  linkOpens: many(adLinkOpens)
}));

export const monetizationPreferencesRelations = relations(monetizationPreferences, ({ one }) => ({
  agent: one(agents, {
    fields: [monetizationPreferences.agentId],
    references: [agents.id]
  })
}));

export const adLinkOpensRelations = relations(adLinkOpens, ({ one }) => ({
  ad: one(ads, {
    fields: [adLinkOpens.adId],
    references: [ads.id]
  }),
  agent: one(agents, {
    fields: [adLinkOpens.agentId],
    references: [agents.id]
  })
}));

import { db, users, campaigns } from '../lib/db';
import { eq } from 'drizzle-orm';

// Seed data for 4 users using your real Hedera account IDs
const seedUsers = [
  {
    accountId: '0.0.6885334',
    personaType: 'ADVERTISER' as const,
    name: 'Tech Startup Advertiser'
  },
  {
    accountId: '0.0.6916595',
    personaType: 'ADVERTISER' as const,
    name: 'E-commerce Business'
  },
  {
    accountId: '0.0.6916585',
    personaType: 'AI_AGENT_OWNER' as const,
    name: 'AI Agent Developer'
  },
  {
    accountId: '0.0.6916597',
    personaType: 'VALIDATOR' as const,
    name: 'Content Validator'
  }
];

const seedCampaigns = [
  // Tech Startup campaigns (0.0.6885334)
  {
    userAccountId: '0.0.6885334',
    name: 'AI Development Tools Promotion',
    adContent: 'Discover cutting-edge AI development tools that will revolutionize your workflow. Get 30% off our premium IDE with advanced machine learning capabilities. Perfect for developers building the next generation of AI applications.',
    trackedLink: 'https://example.com/ai-tools-promo',
    advertiserSubmittedCategory: 'Informative' as const,
    budget: '2500.00',
    spent: '1200.50',
    impressions: '4500',
    linkOpens: '180',
    targetingKeywords: ['AI', 'development', 'machine learning', 'tools', 'IDE'],
    bidAmount: '0.85',
    status: 'Active' as const,
    underReview: false
  },
  {
    userAccountId: '0.0.6885334',
    name: 'Cloud Computing Summit',
    adContent: 'Join industry leaders at the Cloud Computing Summit 2024. Learn about serverless architectures, container orchestration, and the future of distributed systems. Early bird tickets now available.',
    trackedLink: 'https://example.com/cloud-summit',
    advertiserSubmittedCategory: 'PG' as const,
    budget: '1500.00',
    spent: '450.00',
    impressions: '2800',
    linkOpens: '95',
    targetingKeywords: ['cloud', 'computing', 'serverless', 'containers', 'summit'],
    bidAmount: '0.75',
    status: 'Active' as const,
    underReview: false
  },
  
  // E-commerce campaigns (0.0.6916595)
  {
    userAccountId: '0.0.6916595',
    name: 'Smart Home Holiday Sale',
    adContent: 'Transform your home into a smart haven this holiday season! Get up to 50% off on smart speakers, thermostats, security cameras, and lighting systems. Free installation included with purchase over $200.',
    trackedLink: 'https://example.com/smart-home-sale',
    advertiserSubmittedCategory: 'Family-Friendly' as const,
    budget: '5000.00',
    spent: '3200.75',
    impressions: '12500',
    linkOpens: '425',
    targetingKeywords: ['smart home', 'IoT', 'automation', 'security', 'holiday'],
    bidAmount: '0.95',
    status: 'Active' as const,
    underReview: false
  },
  {
    userAccountId: '0.0.6916595',
    name: 'Eco-Friendly Electronics',
    adContent: 'Go green with our eco-friendly electronics line. Solar-powered gadgets, biodegradable phone cases, and energy-efficient devices. Help save the planet while staying connected to technology.',
    trackedLink: 'https://example.com/eco-electronics',
    advertiserSubmittedCategory: 'Informative' as const,
    budget: '1800.00',
    spent: '890.25',
    impressions: '3200',
    linkOpens: '128',
    targetingKeywords: ['eco-friendly', 'sustainable', 'green tech', 'solar', 'environment'],
    bidAmount: '0.65',
    status: 'Pending Review' as const,
    underReview: true
  },
  {
    userAccountId: '0.0.6916595',
    name: 'Gaming Accessories Mega Sale',
    adContent: 'Level up your gaming experience! Premium mechanical keyboards, high-DPI gaming mice, surround sound headsets, and RGB lighting systems. Professional gamers choice - now at consumer prices.',
    trackedLink: 'https://example.com/gaming-sale',
    advertiserSubmittedCategory: 'PG' as const,
    budget: '3000.00',
    spent: '3000.00',
    impressions: '8900',
    linkOpens: '356',
    targetingKeywords: ['gaming', 'esports', 'peripherals', 'mechanical keyboard', 'RGB'],
    bidAmount: '1.20',
    status: 'Completed' as const,
    underReview: false
  },

  // AI Agent Owner campaigns (0.0.6916585)
  {
    userAccountId: '0.0.6916585',
    name: 'AI Agent Marketplace Launch',
    adContent: 'Introducing the first decentralized marketplace for AI agents. Deploy, monetize, and scale your AI creations. Connect with developers worldwide and turn your AI innovations into sustainable revenue streams.',
    trackedLink: 'https://example.com/ai-marketplace',
    advertiserSubmittedCategory: 'Informative' as const,
    budget: '2000.00',
    spent: '150.00',
    impressions: '850',
    linkOpens: '34',
    targetingKeywords: ['AI agents', 'marketplace', 'monetization', 'developers', 'blockchain'],
    bidAmount: '0.90',
    status: 'Active' as const,
    underReview: false
  },

  // Content Validator campaigns (0.0.6916597) - even validators can advertise!
  {
    userAccountId: '0.0.6916597',
    name: 'Content Moderation Services',
    adContent: 'Professional content moderation and validation services for your platform. Our experienced team ensures quality, safety, and compliance across all your user-generated content.',
    trackedLink: 'https://example.com/content-moderation',
    advertiserSubmittedCategory: 'PG' as const,
    budget: '1200.00',
    spent: '0.00',
    impressions: '0',
    linkOpens: '0',
    targetingKeywords: ['content moderation', 'validation', 'safety', 'compliance', 'platform'],
    bidAmount: '0.80',
    status: 'Pending Review' as const,
    underReview: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed with real Hedera account IDs...');

    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    await db.delete(campaigns);
    await db.delete(users);

    // Insert users with your real account IDs
    console.log('👥 Seeding users...');
    const insertedUsers = await db.insert(users).values(seedUsers).returning();
    console.log(`✅ Created ${insertedUsers.length} users`);

    // Create a map of accountId to user id for campaign insertion
    const userMap = new Map();
    for (const user of insertedUsers) {
      userMap.set(user.accountId, user.id);
    }

    // Insert campaigns
    console.log('📢 Seeding campaigns...');
    const campaignsToInsert = seedCampaigns.map(campaign => ({
      ...campaign,
      userId: userMap.get(campaign.userAccountId)!,
      userAccountId: undefined // Remove this field as it's not in the schema
    }));

    const insertedCampaigns = await db.insert(campaigns).values(campaignsToInsert).returning();
    console.log(`✅ Created ${insertedCampaigns.length} campaigns`);

    // Summary
    console.log('\n📊 Seed Summary:');
    console.log(`Users created: ${insertedUsers.length}`);
    console.log(`Campaigns created: ${insertedCampaigns.length}`);
    
    console.log('\n🏷️  Real Hedera Account IDs:');
    insertedUsers.forEach(user => {
      const campaignCount = insertedCampaigns.filter(c => c.userId === user.id).length;
      console.log(`  ${user.name}: ${user.accountId} (${campaignCount} campaigns)`);
    });

    console.log('\n🎉 Database seeded successfully with your real Hedera accounts!');
    console.log('\n💡 You can now switch between these accounts in the header to see different campaigns.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✨ Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });

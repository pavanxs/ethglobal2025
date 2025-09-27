import { db, users } from '../lib/db';
import { eq } from 'drizzle-orm';


// Essential users that should exist
const essentialUsers = [
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

async function ensureUsers() {
  try {
    console.log('👥 Ensuring essential users exist...');
    
    for (const userData of essentialUsers) {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.accountId, userData.accountId)
      });
      
      if (!existingUser) {
        // Create the user
        const [newUser] = await db.insert(users).values(userData).returning();
        console.log(`✅ Created user: ${newUser.name} (${newUser.accountId})`);
      } else {
        console.log(`ℹ️  User already exists: ${existingUser.name} (${existingUser.accountId})`);
      }
    }
    
    console.log('🎉 All essential users are ready!');
    console.log('💡 You can now create campaigns and they will work with the validator flow');
    
  } catch (error) {
    console.error('❌ Error ensuring users:', error);
    throw error;
  }
}

// Run the function
ensureUsers()
  .then(() => {
    console.log('✨ User setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 User setup failed:', error);
    process.exit(1);
  });

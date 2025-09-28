import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { 
  createCampaignTopic, 
  submitCampaignMessage, 
  createCampaignHCSData 
} from '@/lib/hedera-hcs';

// GET /api/campaigns - Get campaigns for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Find user by account ID
    const user = await db.query.users.findFirst({
      where: eq(users.accountId, accountId)
    });

    if (!user) {
      // User doesn't exist yet - this is normal for new accounts
      // Return empty campaigns array instead of error
      return NextResponse.json({ campaigns: [] });
    }

    // Get campaigns for this user
    const userCampaigns = await db.query.campaigns.findMany({
      where: eq(campaigns.userId, user.id),
      orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)]
    });

    return NextResponse.json({ campaigns: userCampaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountId,
      campaignName,
      adContent,
      trackedLink,
      contentCategory,
      budget,
      durationStart,
      durationEnd,
      targetingKeywords,
      bidAmount
    } = body;

    if (!accountId || !campaignName || !adContent || !trackedLink || !contentCategory) {
      return NextResponse.json({ 
        error: 'Missing required fields: accountId, campaignName, adContent, trackedLink, contentCategory' 
      }, { status: 400 });
    }

    // Find or create user by account ID
    let user = await db.query.users.findFirst({
      where: eq(users.accountId, accountId)
    });

    if (!user) {
      // Create new advertiser user
      const [newUser] = await db.insert(users).values({
        accountId,
        personaType: 'ADVERTISER',
        name: `Advertiser ${accountId.slice(-4)}`
      }).returning();
      user = newUser;
    }

    // Create or get HCS topic for this user
    let topicId = user.hcsTopicId;
    if (!topicId) {
      try {
        console.log(`Creating HCS topic for user ${accountId}...`);
        const topicResult = await createCampaignTopic(
          accountId, 
          `Ad Review Topic - Validator approvals for ${user.name || accountId}`
        );
        topicId = topicResult.topicId;
        
        // Update user with topic details
        await db.update(users)
          .set({ 
            hcsTopicId: topicId,
            hcsTopicCreationTxId: topicResult.transactionId,
            hcsTopicMemo: `Ad Review Topic - Validator approvals for ${user.name || accountId}`,
            updatedAt: new Date() 
          })
          .where(eq(users.id, user.id));
        
        console.log(`✅ HCS topic created: ${topicId}`);
      } catch (hcsError) {
        console.error('⚠️ Failed to create HCS topic:', hcsError);
        // Continue without HCS - don't fail the campaign creation
      }
    }

    // Create campaign in database
    const [campaign] = await db.insert(campaigns).values({
      userId: user.id,
      name: campaignName,
      adContent,
      trackedLink,
      advertiserSubmittedCategory: contentCategory,
      budget: budget ? parseFloat(budget).toString() : '0.00',
      durationStart: durationStart ? new Date(durationStart) : null,
      durationEnd: durationEnd ? new Date(durationEnd) : null,
      targetingKeywords: targetingKeywords || [],
      bidAmount: bidAmount ? parseFloat(bidAmount).toString() : null,
      status: 'Pending Review',
      underReview: true // Explicitly set as under review
    }).returning();

    // Submit campaign data to HCS topic
    let hcsMessageId = null;
    if (topicId) {
      try {
        console.log(`Submitting campaign to HCS topic ${topicId}...`);
        const hcsData = createCampaignHCSData(
          'AD_SUBMITTED_FOR_REVIEW',
          campaign.id,
          accountId,
          campaign
        );
        
        const messageResult = await submitCampaignMessage(accountId, topicId, hcsData);
        hcsMessageId = messageResult.transactionId;
        
        // Update campaign with HCS message details
        await db.update(campaigns)
          .set({ 
            hcsMessageId, 
            hcsMessageStatus: messageResult.status,
            updatedAt: new Date() 
          })
          .where(eq(campaigns.id, campaign.id));
        
        console.log(`✅ Campaign submitted to HCS: ${hcsMessageId}`);
      } catch (hcsError) {
        console.error('⚠️ Failed to submit to HCS:', hcsError);
        // Continue - campaign is created even if HCS fails
      }
    }

    return NextResponse.json({ 
      message: 'Campaign created successfully',
      campaign: {
        ...campaign,
        hcsMessageId
      },
      hcs: {
        topicId,
        messageId: hcsMessageId,
        hashscanUrl: hcsMessageId ? `https://hashscan.io/testnet/tx/${hcsMessageId}` : null
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

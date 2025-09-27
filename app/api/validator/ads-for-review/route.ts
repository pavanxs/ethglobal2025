import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET /api/validator/ads-for-review - Get ads awaiting validation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validatorAccountId = searchParams.get('validatorAccountId');

    if (!validatorAccountId) {
      return NextResponse.json({ error: 'Validator account ID is required' }, { status: 400 });
    }

    // Verify the account is a validator
    const validator = await db.query.users.findFirst({
      where: eq(users.accountId, validatorAccountId)
    });

    if (!validator || validator.personaType !== 'VALIDATOR') {
      return NextResponse.json({ error: 'Access restricted to validators only' }, { status: 403 });
    }

    // Get all campaigns that are under review (underReview = true)
    const adsForReview = await db.query.campaigns.findMany({
      where: eq(campaigns.underReview, true),
      with: {
        user: {
          columns: {
            accountId: true,
            name: true
          }
        }
      },
      orderBy: (campaigns, { asc }) => [asc(campaigns.createdAt)]
    });

    // Transform the data for the frontend
    const formattedAds = adsForReview.map(campaign => ({
      id: campaign.id,
      campaignId: campaign.id,
      campaignName: campaign.name,
      adContent: campaign.adContent,
      trackedLink: campaign.trackedLink,
      advertiserSubmittedCategory: campaign.advertiserSubmittedCategory,
      advertiserAccountId: campaign.user.accountId,
      advertiserName: campaign.user.name,
      submittedAt: campaign.createdAt,
      status: campaign.status,
      targetingKeywords: campaign.targetingKeywords || []
    }));

    return NextResponse.json({ 
      ads: formattedAds,
      count: formattedAds.length 
    });
  } catch (error) {
    console.error('Error fetching ads for review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

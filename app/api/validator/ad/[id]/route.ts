import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET /api/validator/ad/[id] - Get specific ad for review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // Get the specific campaign
    const campaign = await db.query.campaigns.findFirst({
      where: eq(campaigns.id, id),
      with: {
        user: {
          columns: {
            accountId: true,
            name: true
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Transform the data for the frontend
    const formattedAd = {
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
      targetingKeywords: campaign.targetingKeywords || [],
      budget: campaign.budget,
      bidAmount: campaign.bidAmount
    };

    return NextResponse.json({ ad: formattedAd });
  } catch (error) {
    console.error('Error fetching ad for review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

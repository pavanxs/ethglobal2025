import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, users } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// GET /api/campaigns/[id] - Get specific campaign details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get campaign
    const campaign = await db.query.campaigns.findFirst({
      where: and(
        eq(campaigns.id, params.id),
        eq(campaigns.userId, user.id)
      )
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/campaigns/[id] - Update campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { accountId, status, ...updateData } = body;

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Find user by account ID
    const user = await db.query.users.findFirst({
      where: eq(users.accountId, accountId)
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update campaign
    const [updatedCampaign] = await db.update(campaigns)
      .set({
        ...updateData,
        status,
        updatedAt: new Date()
      })
      .where(and(
        eq(campaigns.id, params.id),
        eq(campaigns.userId, user.id)
      ))
      .returning();

    if (!updatedCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Campaign updated successfully',
      campaign: updatedCampaign 
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/campaigns/[id] - Delete campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete campaign
    const [deletedCampaign] = await db.delete(campaigns)
      .where(and(
        eq(campaigns.id, params.id),
        eq(campaigns.userId, user.id)
      ))
      .returning();

    if (!deletedCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Campaign deleted successfully',
      campaignId: params.id 
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

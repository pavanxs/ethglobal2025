import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, users } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { 
  submitCampaignMessage, 
  createCampaignHCSData 
} from '@/lib/hedera-hcs';

// POST /api/validator/review - Submit validator review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      campaignId,
      validatorAccountId,
      decision, // 'approve' or 'reject'
      rating,
      comments,
      originalCategory
    } = body;

    if (!campaignId || !validatorAccountId || !decision || !rating) {
      return NextResponse.json({ 
        error: 'Missing required fields: campaignId, validatorAccountId, decision, rating' 
      }, { status: 400 });
    }

    // Verify the validator account
    const validator = await db.query.users.findFirst({
      where: eq(users.accountId, validatorAccountId)
    });

    if (!validator || validator.personaType !== 'VALIDATOR') {
      return NextResponse.json({ error: 'Access restricted to validators only' }, { status: 403 });
    }

    // Get the campaign and its owner
    const campaign = await db.query.campaigns.findFirst({
      where: eq(campaigns.id, campaignId),
      with: {
        user: true
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (!campaign.underReview) {
      return NextResponse.json({ error: 'Campaign is not under review' }, { status: 400 });
    }

    // Determine new status based on decision
    const newStatus = decision === 'approve' ? 'Active' : 'Rejected';

    // Update campaign with validator decision and review status
    const [updatedCampaign] = await db.update(campaigns)
      .set({ 
        status: newStatus,
        underReview: false, // No longer under review
        validatorDecision: decision,
        validatorAccountId: validatorAccountId,
        validatorRating: rating,
        validatorComments: comments || null,
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(campaigns.id, campaignId))
      .returning();

    // Submit validator decision to HCS topic
    let hcsMessageId = null;
    if (campaign.user.hcsTopicId) {
      try {
        console.log(`Submitting validator decision to HCS topic ${campaign.user.hcsTopicId}...`);
        
        const hcsData = createCampaignHCSData(
          decision === 'approve' ? 'AD_APPROVED' : 'AD_REJECTED',
          campaignId,
          campaign.user.accountId,
          {
            ...campaign,
            status: newStatus,
            validatorGrade: rating,
            validatorComments: comments
          }
        );

        // Add validator info to HCS data
        hcsData.validatorAccountId = validatorAccountId;

        const messageResult = await submitCampaignMessage(
          validatorAccountId, 
          campaign.user.hcsTopicId, 
          hcsData
        );
        hcsMessageId = messageResult.transactionId;
        
        console.log(`✅ Validator decision submitted to HCS: ${hcsMessageId}`);
      } catch (hcsError) {
        console.error('⚠️ Failed to submit validator decision to HCS:', hcsError);
        // Continue - validation is recorded even if HCS fails
      }
    }

    return NextResponse.json({ 
      message: `Ad ${decision === 'approve' ? 'approved' : 'rejected'} successfully`,
      campaign: updatedCampaign,
      validation: {
        validatorAccountId,
        decision,
        rating,
        comments,
        originalCategory,
        hcsMessageId
      }
    });
  } catch (error) {
    console.error('Error submitting validator review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

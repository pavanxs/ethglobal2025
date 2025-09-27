import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { queryTopicMessages } from '@/lib/hedera-hcs';

// GET /api/hcs/messages - Get HCS messages for a user's topic
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Find user and their HCS topic
    const user = await db.query.users.findFirst({
      where: eq(users.accountId, accountId)
    });

    if (!user || !user.hcsTopicId) {
      return NextResponse.json({ 
        messages: [], 
        count: 0, 
        topicId: null,
        info: 'No HCS topic found for this account'
      });
    }

    // Query messages from HCS topic
    const hcsData = await queryTopicMessages(user.hcsTopicId, limit);

    return NextResponse.json({
      ...hcsData,
      accountId,
      userInfo: {
        name: user.name,
        accountId: user.accountId
      }
    });
  } catch (error) {
    console.error('Error fetching HCS messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

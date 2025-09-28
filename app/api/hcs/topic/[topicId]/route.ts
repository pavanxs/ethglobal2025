import { NextRequest, NextResponse } from 'next/server';
import { queryTopicMessages } from '@/lib/hedera-hcs';

// GET /api/hcs/topic/[topicId] - Get messages for any HCS topic (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  const { topicId } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
    }

    // Query messages from HCS topic
    const hcsData = await queryTopicMessages(topicId, limit);

    return NextResponse.json({
      ...hcsData,
      mirrorNodeUrl: `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`,
      hashscanUrl: `https://hashscan.io/testnet/topic/${topicId}`
    });
  } catch (error) {
    console.error('Error fetching HCS topic messages:', error);
    
    // Check if it's a 404 from mirror node (topic doesn't exist or no messages)
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json({ 
        error: 'Topic not found or has no messages',
        topicId: topicId
      }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

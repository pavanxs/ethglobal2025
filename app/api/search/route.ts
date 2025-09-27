import { NextRequest, NextResponse } from 'next/server';
import { getIndex } from '@/lib/pinecone';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vector, topK = 10, includeMetadata = true, includeValues = false } = body;

    if (!vector || !Array.isArray(vector)) {
      return NextResponse.json(
        { error: 'Vector array is required' },
        { status: 400 }
      );
    }

    // Get the index
    const index = getIndex();

    // Perform the search
    const searchResponse = await index.query({
      vector,
      topK,
      includeMetadata,
      includeValues
    });

    return NextResponse.json({
      success: true,
      matches: searchResponse.matches,
      usage: searchResponse.usage
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const topK = parseInt(searchParams.get('topK') || '10');
  
  if (query) {
    // For now, return a message about text search not being implemented
    return NextResponse.json({
      message: 'Text search not yet implemented in GET endpoint',
      query: query,
      suggestion: 'Use POST /api/search with a vector array, or use /api/upsert to add text that gets auto-embedded',
      example_post_body: {
        vector: [0.1, 0.2, 0.3], // ... 1024 dimensions
        topK: topK
      }
    });
  }
  
  return NextResponse.json({
    message: 'Pinecone Search API',
    usage: {
      method: 'POST',
      endpoint: '/api/search',
      body: {
        vector: 'Array of numbers (1024 dimensions for ethglobal2025 index)',
        topK: 'Number of results to return (optional, default: 10)',
        includeMetadata: 'Include metadata in results (optional, default: true)',
        includeValues: 'Include vector values in results (optional, default: false)'
      },
      example: {
        vector: [0.1, 0.2, 0.3], // ... 1024 dimensions
        topK: 5
      }
    },
    try_with_query: 'Add ?q=your_search_term&topK=5 to see query handling'
  });
}

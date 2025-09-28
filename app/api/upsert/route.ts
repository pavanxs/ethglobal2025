import { NextRequest, NextResponse } from 'next/server';
import { getIndex } from '@/lib/pinecone';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { records, namespace } = body;

    if (!records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'Records array is required' },
        { status: 400 }
      );
    }

    // Get the index
    const index = getIndex();
    const targetNamespace = namespace ? index.namespace(namespace) : index;

    // Transform records to match the expected format
    const transformedRecords = records.map(record => ({
      ...record,
      text: record.chunk_text || record.text, // Map chunk_text to text field
      // Remove chunk_text to avoid duplication
      ...(record.chunk_text && { chunk_text: undefined })
    }));

    // Use upsertRecords for text-based records with automatic embedding
    await targetNamespace.upsertRecords(transformedRecords);
    

    return NextResponse.json({
      success: true,
      upsertedCount: records.length,
      message: 'Records upserted successfully',
    });

  } catch (error) {
    console.error('Upsert error:', error);
    return NextResponse.json(
      { 
        error: 'Upsert failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Pinecone Upsert API',
    usage: {
      method: 'POST',
      endpoint: '/api/upsert',
      body: {
        records: 'Array of record objects with _id, chunk_text, and metadata',
        namespace: 'Optional namespace (string)'
      },
      example: {
        records: [
          {
            "_id": "rec1",
            "chunk_text": "Your text content here",
            "category": "your category"
          }
        ],
        namespace: "example-namespace"
      }
    },
    note: "The chunk_text field will be automatically converted to embeddings"
  });
}

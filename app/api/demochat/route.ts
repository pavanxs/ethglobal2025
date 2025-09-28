import { NextRequest, NextResponse } from 'next/server';
import { getIndex } from '@/lib/pinecone';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown>;
}

interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}

// Function to search the knowledge base
async function searchKnowledgeBase(query: string, topK: number = 5): Promise<SearchResult[]> {
  try {
    const index = getIndex();
    
    // Create a simple embedding from the query (in production, use proper embedding model)
    const queryVector = Array.from({length: 1024}, (_, i) => {
      const hash = query.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0) * (i + 1), 0);
      return (Math.sin(hash) * 0.1);
    });

    const searchResponse = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      includeValues: false
    });

    return searchResponse.matches.map(match => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata || {}
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Real AI response generator using OpenAI with function calling
async function generateAIResponse(messages: Message[]): Promise<{
  message: string;
  toolCalls: ToolCall[];
  searchResults: SearchResult[];
}> {
  try {
    // Define the search function for OpenAI
    const tools = [
      {
        type: 'function' as const,
        function: {
          name: 'search_knowledge_base',
          description: 'Search the vector database for relevant information based on a query',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query to find relevant information'
              },
              topK: {
                type: 'integer',
                description: 'Number of results to return (default: 5)',
                default: 5
              }
            },
            required: ['query']
          }
        }
      }
    ];

    // Call OpenAI with function calling
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message;
    const toolCalls: ToolCall[] = [];
    const searchResults: SearchResult[] = [];

    // Handle tool calls if any
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function.name === 'search_knowledge_base') {
          const args = JSON.parse(toolCall.function.arguments);
          const results = await searchKnowledgeBase(args.query, args.topK || 5);
          
          toolCalls.push({
            id: toolCall.id,
            name: toolCall.function.name,
            arguments: args,
            result: { results }
          });
          
          searchResults.push(...results);
        }
      }

      // If we have search results, make another call to OpenAI with the context
      if (searchResults.length > 0) {
        const contextInfo = searchResults
          .slice(0, 3)
          .map(result => result.metadata.text || result.metadata.chunk_text)
          .filter(Boolean)
          .join('\n\n');

        const contextMessages = [
          ...messages,
          {
            role: 'assistant' as const,
            content: assistantMessage.content || '',
            tool_calls: assistantMessage.tool_calls
          },
          {
            role: 'tool' as const,
            content: `Search results from knowledge base:\n\n${contextInfo}`,
            tool_call_id: assistantMessage.tool_calls[0].id
          }
        ];

        const finalResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: contextMessages,
          temperature: 0.7,
        });

        return {
          message: finalResponse.choices[0].message.content || 'I found some information but had trouble processing it.',
          toolCalls,
          searchResults
        };
      }
    }

    return {
      message: assistantMessage.content || 'I apologize, but I had trouble generating a response.',
      toolCalls,
      searchResults
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      message: 'I encountered an error while processing your request. Please try again.',
      toolCalls: [],
      searchResults: []
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Generate AI response with tool calling
    const response = await generateAIResponse(messages);

    return NextResponse.json({
      success: true,
      message: response.message,
      toolCalls: response.toolCalls,
      searchResults: response.searchResults
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { 
        error: 'Chat failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Demo Chat API',
    description: 'AI chat with tool-based Pinecone search',
    usage: {
      method: 'POST',
      endpoint: '/api/demochat',
      body: {
        messages: 'Array of message objects with role and content'
      },
      example: {
        messages: [
          { role: 'user', content: 'What do you know about machine learning?' }
        ]
      }
    }
  });
}

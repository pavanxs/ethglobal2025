import { NextRequest, NextResponse } from 'next/server';
import { getIndex } from '@/lib/pinecone';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  tools?: Tool[];
  tool_choice?: string | { type: string; function?: { name: string } };
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

// Define available tools
const AVAILABLE_TOOLS: Tool[] = [
  {
    type: 'function',
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

async function searchKnowledgeBase(query: string, topK: number = 5) {
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

    return {
      results: searchResponse.matches.map(match => ({
        id: match.id,
        score: match.score,
        content: match.metadata?.text || match.metadata?.chunk_text || 'No content available',
        metadata: match.metadata
      })),
      usage: searchResponse.usage
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      results: [],
      error: 'Search failed'
    };
  }
}

// This function is no longer needed as we're using real OpenAI
// Keeping it for reference but it won't be used

export async function POST(request: NextRequest) {
  try {
    const body: OpenAIRequest = await request.json();
    const { messages, tools, tool_choice, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: { message: 'Messages array is required', type: 'invalid_request_error' } },
        { status: 400 }
      );
    }

    // Add our search function to the tools if not already present
    let finalTools = tools || [];
    if (tools && tools.length > 0) {
      // Make sure our search function is available
      const hasSearchTool = tools.some(tool => 
        tool.type === 'function' && tool.function.name === 'search_knowledge_base'
      );
      
      if (!hasSearchTool) {
        finalTools = [...tools, ...AVAILABLE_TOOLS];
      }
    }

    // Call the real OpenAI API
    const openaiResponse = await openai.chat.completions.create({
      model,
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      ...(finalTools.length > 0 && { tools: finalTools }),
      ...(tool_choice && { tool_choice: tool_choice as OpenAI.Chat.Completions.ChatCompletionToolChoiceOption }),
      temperature,
      max_tokens,
    });

    const assistantMessage = openaiResponse.choices[0].message;

    // Handle tool calls if any
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolResults = [];
      
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function.name === 'search_knowledge_base') {
          const args = JSON.parse(toolCall.function.arguments);
          const searchResult = await searchKnowledgeBase(args.query, args.topK || 5);
          
          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool' as const,
            content: JSON.stringify({
              results: searchResult.results,
              query: args.query,
              count: searchResult.results.length
            })
          });
        }
      }

      // If we have tool results, make another call to get the final response
      if (toolResults.length > 0) {
        const messagesWithTools = [
          ...messages,
          {
            role: 'assistant' as const,
            content: assistantMessage.content,
            tool_calls: assistantMessage.tool_calls
          },
          ...toolResults
        ];

        const finalResponse = await openai.chat.completions.create({
          model,
          messages: messagesWithTools as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
          temperature,
          max_tokens,
        });

        return NextResponse.json({
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: finalResponse.choices[0].message.content,
                tool_calls: assistantMessage.tool_calls // Include the original tool calls
              },
              finish_reason: finalResponse.choices[0].finish_reason
            }
          ],
          usage: {
            prompt_tokens: (openaiResponse.usage?.prompt_tokens || 0) + (finalResponse.usage?.prompt_tokens || 0),
            completion_tokens: (openaiResponse.usage?.completion_tokens || 0) + (finalResponse.usage?.completion_tokens || 0),
            total_tokens: (openaiResponse.usage?.total_tokens || 0) + (finalResponse.usage?.total_tokens || 0)
          }
        });
      }
    }

    // Return the response as-is if no tool calls
    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: assistantMessage.content,
            ...(assistantMessage.tool_calls && { tool_calls: assistantMessage.tool_calls })
          },
          finish_reason: openaiResponse.choices[0].finish_reason
        }
      ],
      usage: openaiResponse.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    });

  } catch (error) {
    console.error('Chat completion error:', error);
    return NextResponse.json(
      { 
        error: { 
          message: 'Internal server error', 
          type: 'server_error',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'OpenAI-Compatible Chat Completions API',
    description: 'AI chat with integrated Pinecone vector search',
    endpoint: '/api/v1/chat/completions',
    compatibility: 'OpenAI Chat Completions API v1',
    features: [
      'Tool calling with vector search',
      'Knowledge base integration',
      'OpenAI-compatible request/response format'
    ],
    available_tools: AVAILABLE_TOOLS,
    example_request: {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'What do you know about machine learning?' }
      ],
      tools: AVAILABLE_TOOLS,
      tool_choice: 'auto'
    }
  });
}

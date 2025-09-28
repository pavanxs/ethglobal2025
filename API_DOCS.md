# API Documentation

This project provides multiple AI and vector search APIs built with Pinecone integration.

## Overview

- **Pinecone Search API**: Direct vector search functionality
- **Upsert API**: Add text documents with automatic embedding
- **Demo Chat**: Interactive chat interface with AI search
- **OpenAI-Compatible API**: Standard chat completions with vector search tools

---

## 1. Pinecone Search API

### Endpoint: `POST /api/search`

Search the Pinecone vector database using pre-computed embeddings.

**Request:**
```json
{
  "vector": [0.1, 0.2, 0.3, ...], // 1024-dimensional array
  "topK": 5,                      // optional, default: 10
  "includeMetadata": true,        // optional, default: true
  "includeValues": false          // optional, default: false
}
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "id": "doc_1",
      "score": 0.95,
      "values": [],
      "metadata": {
        "text": "Document content here"
      }
    }
  ],
  "usage": {
    "readUnits": 1
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.1, 0.2, 0.3],
    "topK": 5
  }'
```

---

## 2. Upsert API

### Endpoint: `POST /api/upsert`

Add text documents to Pinecone with automatic embedding generation.

**Request:**
```json
{
  "records": [
    {
      "_id": "doc1",
      "chunk_text": "Your text content here",
      "category": "optional metadata"
    }
  ],
  "namespace": "optional-namespace"
}
```

**Response:**
```json
{
  "success": true,
  "upsertedCount": 1,
  "message": "Records upserted successfully"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/upsert \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {
        "_id": "ml_intro",
        "chunk_text": "Machine learning is a subset of AI...",
        "category": "AI/ML"
      }
    ]
  }'
```

---

## 3. Demo Chat

### Web Interface: `/demochat`

Interactive chat interface where AI searches your knowledge base.

### API Endpoint: `POST /api/demochat`

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What do you know about machine learning?"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Based on my search...",
  "toolCalls": [
    {
      "id": "search_123",
      "name": "search_embeddings",
      "arguments": {
        "query": "machine learning",
        "topK": 5
      }
    }
  ],
  "searchResults": [
    {
      "id": "doc1",
      "score": 0.95,
      "metadata": {
        "text": "Machine learning content..."
      }
    }
  ]
}
```

---

## 4. OpenAI-Compatible API

### Endpoint: `POST /api/v1/chat/completions`

Fully OpenAI-compatible chat completions API with integrated vector search tools.

**Features:**
- Standard OpenAI request/response format
- Tool calling for vector search
- Compatible with OpenAI SDK
- Automatic knowledge base integration

**Request:**
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "What do you know about AI?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_knowledge_base",
        "description": "Search vector database",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "Search query"
            },
            "topK": {
              "type": "integer",
              "description": "Number of results",
              "default": 5
            }
          },
          "required": ["query"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

**Response:**
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on my search through the knowledge base...",
        "tool_calls": [
          {
            "id": "call_123",
            "type": "function",
            "function": {
              "name": "search_knowledge_base",
              "arguments": "{\"query\":\"AI\",\"topK\":5}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

---

## Using with OpenAI SDK

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:3000/api/v1',
  apiKey: 'dummy-key', // Not used but required
});

const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'user', content: 'What do you know about technology?' }
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'search_knowledge_base',
        description: 'Search the vector database',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            topK: { type: 'integer', default: 5 }
          },
          required: ['query']
        }
      }
    }
  ],
  tool_choice: 'auto'
});
```

---

## Environment Setup

Make sure you have these environment variables:

```env
PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key
```

The system uses:
- `ethglobal2025` Pinecone index by default
- Real OpenAI API with function calling for AI responses
- GPT-3.5-turbo model (configurable)

---

## Testing the APIs

### 1. Start the development server:
```bash
npm run dev
```

### 2. Test endpoints:

**Search API:**
```bash
curl http://localhost:3000/api/search
```

**Upsert API:**
```bash
curl http://localhost:3000/api/upsert
```

**Demo Chat:**
Visit `http://localhost:3000/demochat`

**OpenAI API:**
```bash
curl http://localhost:3000/api/v1/chat/completions
```

---

## Navigation

The demo chat is accessible through the main navigation:
- Dashboard → `/dashboard`
- Create Campaign → `/create-campaign`
- **Demo Chat** → `/demochat`
- HCS Messages → `/hcs-messages`
- Validator → `/validator`

---

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/search` | POST | Vector search with embeddings |
| `/api/upsert` | POST | Add text documents |
| `/api/demochat` | POST | Interactive AI chat |
| `/api/v1/chat/completions` | POST | OpenAI-compatible chat |
| `/demochat` | GET | Web chat interface |

All APIs include proper error handling and return structured JSON responses.

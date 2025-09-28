'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, Search } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  searchResults?: SearchResult[];
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

export default function DemoChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/demochat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          toolCalls: data.toolCalls,
          searchResults: data.searchResults,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Demo Chat - AI with Pinecone Search
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Chat with an AI that can search your Pinecone embeddings for relevant information.
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation! Ask me anything and I&apos;ll search for relevant information.</p>
                  <p className="text-sm mt-2">Try: &quot;What do you know about machine learning?&quot;</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`flex items-start gap-2 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tool calls and search results */}
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="ml-12 space-y-2">
                      {message.toolCalls.map((tool) => (
                        <div key={tool.id} className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Search className="h-4 w-4 text-blue-600" />
                            <Badge variant="secondary">Tool: {tool.name}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Query: {String(tool.arguments.query) || 'N/A'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search results */}
                  {message.searchResults && message.searchResults.length > 0 && (
                    <div className="ml-12">
                      <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Search className="h-4 w-4 text-green-600" />
                          Search Results ({message.searchResults.length})
                        </h4>
                        <div className="space-y-2">
                          {message.searchResults.slice(0, 3).map((result, idx) => (
                            <div key={result.id} className="bg-background rounded p-2 text-sm">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium">Result {idx + 1}</span>
                                <Badge variant="outline" className="text-xs">
                                  Score: {result.score.toFixed(3)}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">
                                {String(result.metadata.text) || String(result.metadata.chunk_text) || 'No text available'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>AI is thinking and searching...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

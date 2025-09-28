'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/lib/contexts/wallet-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface HCSMessage {
  consensus_timestamp: string;
  message: string;
  decodedMessage: string;
  parsedData: Record<string, unknown>;
  timestamp: string;
  sequence_number: number;
}

interface HCSResponse {
  messages: HCSMessage[];
  count: number;
  topicId: string;
  accountId: string;
  userInfo: {
    name: string;
    accountId: string;
  };
}

export default function HCSMessages() {
  const { selectedWallet } = useWallet();
  const [hcsData, setHcsData] = useState<HCSResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load HCS messages when wallet changes
  const loadHCSMessages = useCallback(async () => {
    if (!selectedWallet?.accountIdString) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/hcs/messages?accountId=${encodeURIComponent(selectedWallet.accountIdString)}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch HCS messages');
      }
      
      const data = await response.json();
      setHcsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load HCS messages');
      console.error('Error loading HCS messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWallet?.accountIdString]);

  useEffect(() => {
    if (selectedWallet?.accountIdString) {
      loadHCSMessages();
    } else {
      setHcsData(null);
    }
  }, [selectedWallet?.accountIdString, loadHCSMessages]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'CAMPAIGN_CREATED': return 'bg-green-100 text-green-800';
      case 'CAMPAIGN_UPDATED': return 'bg-blue-100 text-blue-800';
      case 'CAMPAIGN_DELETED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HCS Messages</h1>
          <p className="text-gray-600 mt-2">
            Immutable campaign records on Hedera Consensus Service
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Account Info */}
      {selectedWallet && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              HCS Topic Messages
            </CardTitle>
            <CardDescription>
              Messages for account: {selectedWallet.name} ({selectedWallet.accountIdString})
              {hcsData?.topicId && (
                <>
                  <br />
                  Topic ID: {hcsData.topicId}
                  <a 
                    href={`https://hashscan.io/testnet/topic/${hcsData.topicId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    View on Hashscan <ExternalLink className="h-3 w-3" />
                  </a>
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Messages</CardTitle>
          <CardDescription>
            Consensus-timestamped campaign activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedWallet ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Select a wallet to view HCS messages</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading HCS messages...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadHCSMessages} variant="outline">
                Try Again
              </Button>
            </div>
          ) : !hcsData?.topicId ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No HCS topic found for this account</p>
              <p className="text-sm text-gray-400">
                Create a campaign to automatically create an HCS topic
              </p>
            </div>
          ) : hcsData.messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No messages found in HCS topic</p>
              <Link href="/create-campaign">
                <Button>Create Your First Campaign</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {hcsData.messages.map((message, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {message.parsedData?.type ? (
                        <Badge className={getMessageTypeColor(String(message.parsedData.type))}>
                          {String(message.parsedData.type).replace('_', ' ')}
                        </Badge>
                      ) : null}
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(message.timestamp)}
                      </div>
                      <span className="text-xs text-gray-400">
                        Seq: {message.sequence_number}
                      </span>
                    </div>
                  </div>

                  {message.parsedData ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {String((message.parsedData as any).data?.name) || 'Campaign'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Campaign ID: {String((message.parsedData as any).campaignId)}
                        </p>
                      </div>

                      {(message.parsedData as any).data?.adContent && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Ad Content:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {String((message.parsedData as any).data.adContent)}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {(message.parsedData as any).data?.contentCategory && (
                          <div>
                            <p className="font-medium text-gray-700">Category:</p>
                            <p className="text-gray-600">{String((message.parsedData as any).data.contentCategory)}</p>
                          </div>
                        )}
                        {(message.parsedData as any).data?.budget && (
                          <div>
                            <p className="font-medium text-gray-700">Budget:</p>
                            <p className="text-gray-600">₳{String((message.parsedData as any).data.budget)}</p>
                          </div>
                        )}
                        {(message.parsedData as any).data?.status && (
                          <div>
                            <p className="font-medium text-gray-700">Status:</p>
                            <p className="text-gray-600">{String((message.parsedData as any).data.status)}</p>
                          </div>
                        )}
                        {message.parsedData.data?.bidAmount && (
                          <div>
                            <p className="font-medium text-gray-700">Bid Amount:</p>
                            <p className="text-gray-600">₳{message.parsedData.data.bidAmount}</p>
                          </div>
                        )}
                      </div>

                      {message.parsedData.data?.targetingKeywords && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.parsedData.data.targetingKeywords.map((keyword: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Raw Message:</p>
                      <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                        {message.decodedMessage}
                      </pre>
                    </div>
                  )}
                </div>
              ))}

              {hcsData.messages.length >= 20 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing latest 20 messages. Visit Hashscan for complete history.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

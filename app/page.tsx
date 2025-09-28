'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/contexts/wallet-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCampaigns, Campaign } from '@/lib/api';
import { Plus, TrendingUp, Users, MousePointer, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
    case 'Completed': return 'bg-blue-100 text-blue-800';
    case 'Paused': return 'bg-gray-100 text-gray-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Home() {
  const { selectedWallet } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = async () => {
    if (!selectedWallet?.accountIdString) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedCampaigns = await getCampaigns(selectedWallet.accountIdString);
      setCampaigns(fetchedCampaigns);
    } catch (err) {
      setError('Failed to load campaigns');
      console.error('Error loading campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load campaigns when wallet changes
  useEffect(() => {
    if (selectedWallet?.accountIdString) {
      loadCampaigns();
    } else {
      setCampaigns([]);
    }
  }, [selectedWallet?.accountIdString, loadCampaigns]);

  // Calculate summary metrics
  const totalSpent = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.spent || '0'), 0);
  const totalLinkOpens = campaigns.reduce((sum, campaign) => sum + parseInt(campaign.linkOpens || '0'), 0);
  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'Active').length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Agent Monetization Network
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect advertisers with AI agents to deliver contextual, intelligent advertising. 
          Monetize your AI agents or reach new audiences through our decentralized network.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg">
              View Dashboard
            </Button>
          </Link>
          <Link href="/create-campaign">
            <Button variant="outline" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Summary */}
      {selectedWallet && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Overview</h2>
              <p className="text-gray-600">
                Campaigns for {selectedWallet.name} ({selectedWallet.accountIdString})
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          {campaigns.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₳{totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Link Opens</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLinkOpens.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Total conversions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently running
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                {selectedWallet ? 
                  `Campaigns for account ${selectedWallet.accountIdString}` : 
                  'Select a wallet to view campaigns'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedWallet ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Select a wallet to view campaigns</p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading campaigns...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={loadCampaigns} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No campaigns found for this account</p>
                  <Link href="/create-campaign">
                    <Button>Create Your First Campaign</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => {
                    const spent = parseFloat(campaign.spent || '0');
                    const impressions = parseInt(campaign.impressions || '0');
                    const linkOpens = parseInt(campaign.linkOpens || '0');
                    
                    return (
                      <div key={campaign.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{campaign.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(campaign.status)}>
                                {campaign.status}
                              </Badge>
                              <Badge variant="outline">{campaign.advertiserSubmittedCategory}</Badge>
                              <span className="text-sm text-gray-500">
                                Created {new Date(campaign.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Link href={`/campaign?id=${campaign.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Impressions</p>
                            <p className="font-semibold">{impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Link Opens</p>
                            <p className="font-semibold">{linkOpens}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Spent</p>
                            <p className="font-semibold">₳{spent.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {campaigns.length > 3 && (
                    <div className="text-center pt-4">
                      <Link href="/dashboard">
                        <Button variant="outline">
                          View All {campaigns.length} Campaigns
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
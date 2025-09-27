'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@/lib/contexts/wallet-context';
import { getCampaign, Campaign } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Pause, Play, Trash2, ExternalLink, TrendingUp, MousePointer, Eye } from 'lucide-react';
import Link from 'next/link';

// Mock performance data - would come from analytics in real app
const generateMockPerformanceData = (campaign: Campaign) => {
  const data = [];
  const startDate = new Date(campaign.createdAt);
  const impressions = parseInt(campaign.impressions || '0');
  const linkOpens = parseInt(campaign.linkOpens || '0');
  const spent = parseFloat(campaign.spent || '0');
  
  // Generate 7 days of mock data
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dailyImpressions = Math.floor(impressions / 7) + Math.floor(Math.random() * 50);
    const dailyClicks = Math.floor(linkOpens / 7) + Math.floor(Math.random() * 5);
    const dailySpent = (spent / 7) + (Math.random() * 2);
    
    data.push({
      date: date.toISOString().split('T')[0],
      impressions: dailyImpressions,
      clicks: dailyClicks,
      spent: dailySpent
    });
  }
  
  return data;
};

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

export default function CampaignDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedWallet } = useWallet();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get campaign ID from URL params
  const campaignId = searchParams.get('id');

  // Load campaign data
  useEffect(() => {
    if (campaignId && selectedWallet?.accountIdString) {
      loadCampaign();
    }
  }, [campaignId, selectedWallet?.accountIdString]);

  const loadCampaign = async () => {
    if (!campaignId || !selectedWallet?.accountIdString) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedCampaign = await getCampaign(campaignId, selectedWallet.accountIdString);
      setCampaign(fetchedCampaign);
    } catch (err) {
      setError('Failed to load campaign');
      console.error('Error loading campaign:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseCampaign = async () => {
    if (!campaign) return;
    // TODO: Implement API call to pause campaign
    console.log('Pause campaign:', campaign.id);
  };

  const handleResumeCampaign = async () => {
    if (!campaign) return;
    // TODO: Implement API call to resume campaign
    console.log('Resume campaign:', campaign.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Campaign not found'}</p>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const impressions = parseInt(campaign.impressions || '0');
  const linkOpens = parseInt(campaign.linkOpens || '0');
  const spent = parseFloat(campaign.spent || '0');
  const budget = parseFloat(campaign.budget || '0');

  const conversionRate = impressions > 0 
    ? ((linkOpens / impressions) * 100).toFixed(2)
    : '0';

  const avgCostPerClick = linkOpens > 0 
    ? (spent / linkOpens).toFixed(2)
    : '0';

  const performanceData = generateMockPerformanceData(campaign);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
              <Badge variant="outline">{campaign.advertiserSubmittedCategory}</Badge>
            </div>
            <p className="text-gray-600">
              Created {new Date(campaign.createdAt).toLocaleDateString()} • 
              Last updated {new Date(campaign.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {campaign.status === 'Active' ? (
            <Button 
              variant="outline" 
              onClick={handlePauseCampaign}
              disabled={isLoading}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : campaign.status === 'Paused' ? (
            <Button 
              variant="outline" 
              onClick={handleResumeCampaign}
              disabled={isLoading}
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          ) : null}
          
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₳{spent.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {budget > 0 && (
                <>
                  <Progress value={(spent / budget) * 100} className="h-1" />
                  <span className="mt-1 block">₳{(budget - spent).toFixed(2)} remaining</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Link Opens</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkOpens}</div>
            <p className="text-xs text-muted-foreground">
              ₳{avgCostPerClick} avg cost per click
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total ad views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Click-through rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validation">Ad Review</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="hcs">HCS Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ad Content</CardTitle>
                <CardDescription>The content being shown to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">{campaign.adContent}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tracked Link:</span>
                    <a 
                      href={campaign.trackedLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      {campaign.trackedLink}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Targeting & Budget</CardTitle>
                <CardDescription>Campaign configuration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Keywords:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaign.targetingKeywords?.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    )) || <span className="text-gray-500">None</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Bid per Click:</span>
                    <p className="text-gray-600">
                      {campaign.bidAmount ? `₳${campaign.bidAmount}` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Total Budget:</span>
                    <p className="text-gray-600">
                      {budget > 0 ? `₳${budget.toFixed(2)}` : 'Unlimited'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Start Date:</span>
                    <p className="text-gray-600">
                      {campaign.durationStart 
                        ? new Date(campaign.durationStart).toLocaleDateString()
                        : 'Not set'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">End Date:</span>
                    <p className="text-gray-600">
                      {campaign.durationEnd 
                        ? new Date(campaign.durationEnd).toLocaleDateString()
                        : 'Not set'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Review & Validation</CardTitle>
              <CardDescription>
                Validator approval process and content rating for this advertisement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-900">Review Status</h3>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                
                {campaign.underReview ? (
                  <div className="space-y-2">
                    <p className="text-blue-800 text-sm">
                      Your ad is currently under validator review. Validators will assess the content 
                      and assign an appropriate rating based on our content guidelines.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                      Waiting for validator approval...
                    </div>
                  </div>
                ) : campaign.validatorDecision === 'approve' ? (
                  <div className="space-y-2">
                    <p className="text-green-800 text-sm">
                      ✅ Your ad has been approved by validators and is now active in the network.
                    </p>
                    {campaign.validatorRating && (
                      <p className="text-green-700 text-xs">
                        Validator assigned rating: <strong>{campaign.validatorRating}</strong>
                      </p>
                    )}
                    {campaign.validatorComments && (
                      <p className="text-green-700 text-xs">
                        Validator feedback: "{campaign.validatorComments}"
                      </p>
                    )}
                  </div>
                ) : campaign.validatorDecision === 'reject' ? (
                  <div className="space-y-2">
                    <p className="text-red-800 text-sm">
                      ❌ Your ad was rejected by validators. Please review the feedback and resubmit.
                    </p>
                    {campaign.validatorRating && (
                      <p className="text-red-700 text-xs">
                        Validator assigned rating: <strong>{campaign.validatorRating}</strong>
                      </p>
                    )}
                    {campaign.validatorComments && (
                      <p className="text-red-700 text-xs">
                        Validator feedback: "{campaign.validatorComments}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-blue-800 text-sm">
                    Review status: {campaign.status}
                  </p>
                )}
              </div>

              {/* Ad Content for Review */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ad Content Under Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Campaign Name:</span>
                      <p className="text-gray-900 font-semibold">{campaign.name}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Ad Content:</span>
                      <div className="mt-1 p-3 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-800">{campaign.adContent}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tracked Link:</span>
                      <a 
                        href={campaign.trackedLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
                      >
                        {campaign.trackedLink}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Submitted Category:</span>
                      <Badge variant="outline" className="ml-2">
                        {campaign.advertiserSubmittedCategory}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Validation Process</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-sm">Ad submitted to review topic</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          campaign.underReview 
                            ? 'bg-yellow-100 animate-pulse' 
                            : 'bg-green-100'
                        }`}>
                          <span className={`text-xs ${
                            campaign.underReview 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                          }`}>
                            {campaign.underReview ? '⏳' : '✓'}
                          </span>
                        </div>
                        <span className="text-sm">Validator review in progress</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          campaign.validatorDecision === 'approve' 
                            ? 'bg-green-100' 
                            : campaign.validatorDecision === 'reject'
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}>
                          <span className={`text-xs ${
                            campaign.validatorDecision === 'approve' 
                              ? 'text-green-600' 
                              : campaign.validatorDecision === 'reject'
                              ? 'text-red-600'
                              : 'text-gray-400'
                          }`}>
                            {campaign.validatorDecision === 'approve' ? '✓' : 
                             campaign.validatorDecision === 'reject' ? '✗' : '○'}
                          </span>
                        </div>
                        <span className="text-sm">
                          {campaign.validatorDecision === 'approve' ? 'Ad approved and active' :
                           campaign.validatorDecision === 'reject' ? 'Ad rejected' :
                           'Ad approval pending'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Content Guidelines</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• <strong>PG:</strong> General audience content</li>
                        <li>• <strong>Family-Friendly:</strong> Safe for all ages</li>
                        <li>• <strong>Adult:</strong> Mature content (18+)</li>
                        <li>• <strong>Informative:</strong> Educational content</li>
                        <li>• <strong>Promotional:</strong> Marketing content</li>
                        <li>• <strong>Unsuitable:</strong> Violates platform guidelines</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* HCS Review Topic */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Blockchain Review Record</CardTitle>
                  <CardDescription>
                    Immutable record of the validation process on Hedera Consensus Service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Review Topic Purpose:</span>
                        <p className="text-gray-600">Ad validation and approval tracking</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Submission Status:</span>
                        <p className="text-gray-600">
                          {campaign.hcsMessageId ? 'Submitted to blockchain' : 'Pending submission'}
                        </p>
                      </div>
                    </div>
                    
                    {campaign.hcsMessageId && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Review Submission:</span>
                          <a 
                            href={`https://hashscan.io/testnet/tx/${campaign.hcsMessageId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            View on Hashscan <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>Campaign performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Impressions:</span>
                        <span className="ml-1 font-medium">{day.impressions}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Clicks:</span>
                        <span className="ml-1 font-medium">{day.clicks}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Spent:</span>
                        <span className="ml-1 font-medium">₳{day.spent.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">CTR:</span>
                        <span className="ml-1 font-medium">
                          {((day.clicks / day.impressions) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hcs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Review Topic - HCS Details</CardTitle>
              <CardDescription>Blockchain records of validator reviews and approvals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* HCS Message Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Ad Review Submission</h3>
                  
                  {campaign.hcsMessageId ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-green-800">Message Transaction ID:</span>
                          <p className="text-sm text-green-700 font-mono break-all">
                            {campaign.hcsMessageId}
                          </p>
                        </div>
                        
                        {campaign.hcsMessageStatus && (
                          <div>
                            <span className="text-sm font-medium text-green-800">Status:</span>
                            <p className="text-sm text-green-700">{campaign.hcsMessageStatus}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-3">
                          <a 
                            href={`https://hashscan.io/testnet/tx/${campaign.hcsMessageId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                          >
                            View Transaction <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-700 text-sm">
                        Ad not yet submitted to review topic on Hedera Consensus Service
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Ad Review Topic</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-blue-800">Topic ID:</span>
                        <p className="text-sm text-blue-700 font-mono">
                          {selectedWallet?.accountIdString ? 'Loading...' : 'Select wallet to view'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-blue-800">Description:</span>
                        <p className="text-sm text-blue-700">
                          Ad validation and approval messages for account {selectedWallet?.accountIdString}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Link href="/hcs-messages">
                          <Button variant="outline" size="sm">
                            View All Review Messages
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits of HCS for Ad Review */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Benefits of Blockchain Ad Review</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Immutable:</strong> Validator decisions cannot be altered or deleted</li>
                  <li>• <strong>Timestamped:</strong> Exact consensus timestamp for all review activities</li>
                  <li>• <strong>Transparent:</strong> Anyone can verify the validation process</li>
                  <li>• <strong>Decentralized:</strong> No central authority controls ad approvals</li>
                  <li>• <strong>Auditable:</strong> Complete history of all validator interactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>Manage your campaign configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Campaign Status</h3>
                    <p className="text-sm text-gray-600">
                      {campaign.status === 'Active' ? 'Your campaign is currently running' : 
                       campaign.status === 'Paused' ? 'Your campaign is paused' :
                       'Your campaign is pending review'}
                    </p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Budget Alert</h3>
                    <p className="text-sm text-gray-600">
                      {budget > 0 ? ((spent / budget) * 100).toFixed(0) : '0'}% of budget used
                    </p>
                  </div>
                  <Progress value={budget > 0 ? (spent / budget) * 100 : 0} className="w-24" />
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Campaign
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    This action cannot be undone. The campaign will be permanently deleted.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

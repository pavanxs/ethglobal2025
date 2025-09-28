'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/lib/contexts/wallet-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface AdForReview {
  id: string;
  campaignId: string;
  campaignName: string;
  adContent: string;
  trackedLink: string;
  advertiserSubmittedCategory: string;
  advertiserAccountId: string;
  advertiserName?: string;
  submittedAt: string;
  status: string;
  targetingKeywords?: string[];
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'PG': return 'bg-green-100 text-green-800';
    case 'Family-Friendly': return 'bg-blue-100 text-blue-800';
    case 'Adult': return 'bg-red-100 text-red-800';
    case 'Informative': return 'bg-purple-100 text-purple-800';
    case 'Promotional': return 'bg-orange-100 text-orange-800';
    case 'Unsuitable': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ValidatorDashboard() {
  const { selectedWallet } = useWallet();
  const [adsForReview, setAdsForReview] = useState<AdForReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter to only show validator accounts
  const isValidator = selectedWallet?.name.includes('Validator') || selectedWallet?.accountIdString === '0.0.6916597';

  const loadAdsForReview = useCallback(async () => {
    if (!selectedWallet?.accountIdString) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/validator/ads-for-review?validatorAccountId=${encodeURIComponent(selectedWallet.accountIdString)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ads for review');
      }
      
      const data = await response.json();
      setAdsForReview(data.ads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ads for review');
      console.error('Error loading ads for review:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWallet?.accountIdString]);

  // Load ads for review when wallet changes
  useEffect(() => {
    if (selectedWallet?.accountIdString && isValidator) {
      loadAdsForReview();
    } 
  }, [selectedWallet?.accountIdString, isValidator, loadAdsForReview]);

  if (!selectedWallet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Validator Dashboard</h1>
          <p className="text-gray-600 mb-6">Please select a validator account to access the review queue.</p>
        </div>
      </div>
    );
  }

  if (!isValidator) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This dashboard is only accessible to validator accounts. 
            Please switch to a validator account (e.g., Content Validator - 0.0.6916597).
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-800 text-sm">
              <strong>Current Account:</strong> {selectedWallet.name} ({selectedWallet.accountIdString})
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Validator Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Review and validate advertisements submitted to the network
        </p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Validator Account Active</span>
          </div>
          <p className="text-blue-800 text-sm mt-1">
            {selectedWallet.name} ({selectedWallet.accountIdString})
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adsForReview.length}</div>
            <p className="text-xs text-muted-foreground">
              Ads awaiting validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Successfully validated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Failed validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              Approval accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ads Review Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Ads Awaiting Review</CardTitle>
          <CardDescription>
            Review advertisement content and assign appropriate ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading ads for review...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadAdsForReview} variant="outline">
                Try Again
              </Button>
            </div>
          ) : adsForReview.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No ads pending review at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {adsForReview.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{ad.campaignName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          Submitted as: {ad.advertiserSubmittedCategory}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          From: {ad.advertiserAccountId}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(ad.submittedAt).toLocaleDateString()} at {new Date(ad.submittedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/validator/review/${ad.id}`}>
                      <Button className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Review Ad
                      </Button>
                    </Link>
                  </div>

                  {/* Ad Content Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {ad.adContent}
                    </p>
                  </div>

                  {/* Ad Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tracked Link:</span>
                      <p className="text-blue-600 truncate">{ad.trackedLink}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted Category:</span>
                      <Badge className={getCategoryColor(ad.advertiserSubmittedCategory)}>
                        {ad.advertiserSubmittedCategory}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="text-yellow-600 font-medium">{ad.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Validation Guidelines</CardTitle>
          <CardDescription>
            Content rating categories and validation criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">PG</Badge>
              <p className="text-sm text-gray-600">
                General audience content. Safe for all ages, no inappropriate material.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800">Family-Friendly</Badge>
              <p className="text-sm text-gray-600">
                Specifically designed for families. Educational, wholesome content.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-red-100 text-red-800">Adult</Badge>
              <p className="text-sm text-gray-600">
                Mature content for adults only. May contain sensitive topics.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-purple-100 text-purple-800">Informative</Badge>
              <p className="text-sm text-gray-600">
                Educational or informational content. News, tutorials, guides.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-orange-100 text-orange-800">Promotional</Badge>
              <p className="text-sm text-gray-600">
                Marketing and promotional content. Sales, offers, advertisements.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-gray-100 text-gray-800">Unsuitable</Badge>
              <p className="text-sm text-gray-600">
                Violates platform guidelines. Spam, misleading, or harmful content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

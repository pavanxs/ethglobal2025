'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWallet } from '@/lib/contexts/wallet-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Ad {
  id: string;
  campaignId: string;
  campaignName: string;
  adContent: string;
  trackedLink: string;
  advertiserSubmittedCategory: string;
  advertiserAccountId: string;
  submittedAt: string;
  status: string;
  targetingKeywords: string[];
}

// Mock ad data - in real app this would come from API
/*
const mockAdData = {
  '1': {
    id: '1',
    campaignId: 'camp-1',
    campaignName: 'AI Development Tools Promotion',
    adContent: 'Discover cutting-edge AI development tools that will revolutionize your workflow. Get 30% off our premium IDE with advanced machine learning capabilities. Perfect for developers building the next generation of AI applications.',
    trackedLink: 'https://example.com/ai-tools-promo',
    advertiserSubmittedCategory: 'Informative',
    advertiserAccountId: '0.0.6885334',
    submittedAt: '2024-01-20T10:30:00.000Z',
    status: 'Pending Validation',
    targetingKeywords: ['AI', 'development', 'machine learning', 'tools', 'IDE']
  },
  '2': {
    id: '2',
    campaignId: 'camp-2',
    campaignName: 'Smart Home Holiday Sale',
    adContent: 'Transform your home into a smart haven this holiday season! Get up to 50% off on smart speakers, thermostats, security cameras, and lighting systems. Free installation included with purchase over $200.',
    trackedLink: 'https://example.com/smart-home-sale',
    advertiserSubmittedCategory: 'Family-Friendly',
    advertiserAccountId: '0.0.6916595',
    submittedAt: '2024-01-20T09:15:00.000Z',
    status: 'Pending Validation',
    targetingKeywords: ['smart home', 'IoT', 'automation', 'security', 'holiday']
  },
  '3': {
    id: '3',
    campaignId: 'camp-3',
    campaignName: 'Gaming Accessories Mega Sale',
    adContent: 'Level up your gaming experience! Premium mechanical keyboards, high-DPI gaming mice, surround sound headsets, and RGB lighting systems. Professional gamers choice - now at consumer prices.',
    trackedLink: 'https://example.com/gaming-sale',
    advertiserSubmittedCategory: 'PG',
    advertiserAccountId: '0.0.6916595',
    submittedAt: '2024-01-19T16:45:00.000Z',
    status: 'Pending Validation',
    targetingKeywords: ['gaming', 'esports', 'peripherals', 'mechanical keyboard', 'RGB']
  }
};
*/

const contentCategories = [
  { 
    value: 'PG', 
    label: 'PG', 
    description: 'General audience content - Safe for all ages',
    color: 'bg-green-100 text-green-800'
  },
  { 
    value: 'Family-Friendly', 
    label: 'Family-Friendly', 
    description: 'Specifically designed for families - Educational, wholesome',
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    value: 'Adult', 
    label: 'Adult', 
    description: 'Mature content for adults only - May contain sensitive topics',
    color: 'bg-red-100 text-red-800'
  },
  { 
    value: 'Informative', 
    label: 'Informative', 
    description: 'Educational or informational content - News, tutorials, guides',
    color: 'bg-purple-100 text-purple-800'
  },
  { 
    value: 'Promotional', 
    label: 'Promotional', 
    description: 'Marketing and promotional content - Sales, offers, advertisements',
    color: 'bg-orange-100 text-orange-800'
  },
  { 
    value: 'Unsuitable', 
    label: 'Unsuitable', 
    description: 'Violates platform guidelines - Spam, misleading, or harmful content',
    color: 'bg-gray-100 text-gray-800'
  }
];

export default function AdReview() {
  const router = useRouter();
  const params = useParams();
  const { selectedWallet } = useWallet();
  const [ad, setAd] = useState<Ad | null>(null);
  const [selectedRating, setSelectedRating] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);

  const adId = params.id as string;

  useEffect(() => {
    if (adId && selectedWallet?.accountIdString && isValidator) {
      loadAdData();
    }
  }, [adId, selectedWallet?.accountIdString, isValidator, loadAdData]);

  const loadAdData = async () => {
    if (!adId || !selectedWallet?.accountIdString) return;
    
    try {
      const response = await fetch(`/api/validator/ad/${adId}?validatorAccountId=${encodeURIComponent(selectedWallet.accountIdString)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ad data');
      }
      
      const data = await response.json();
      setAd(data.ad);
    } catch (error) {
      console.error('Error loading ad data:', error);
      setAd(null);
    }
  };

  const isValidator = selectedWallet?.name.includes('Validator') || selectedWallet?.accountIdString === '0.0.6916597';

  if (!selectedWallet || !isValidator) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This page is only accessible to validator accounts.
          </p>
          <Link href="/validator">
            <Button variant="outline">Back to Validator Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ad Not Found</h1>
          <p className="text-gray-600 mb-6">The requested ad could not be found.</p>
          <Link href="/validator">
            <Button variant="outline">Back to Validator Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async () => {
    if (!selectedRating || !decision) {
      alert('Please select a rating and decision before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/validator/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: ad.campaignId,
          validatorAccountId: selectedWallet.accountIdString,
          decision,
          rating: selectedRating,
          comments,
          originalCategory: ad.advertiserSubmittedCategory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit validation');
      }

      const result = await response.json();
      console.log('✅ Validation submitted successfully:', result);

      // Redirect back to validator dashboard
      router.push('/validator');
    } catch (error) {
      console.error('Failed to submit validation:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit validation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryInfo = contentCategories.find(c => c.value === category);
    return categoryInfo?.color || 'bg-gray-100 text-gray-800';
  };

  const isRatingMismatch = selectedRating && selectedRating !== ad.advertiserSubmittedCategory;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/validator">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Advertisement</h1>
          <p className="text-gray-600 mt-2">
            Validate content and assign appropriate rating
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ad Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Content for Review</CardTitle>
              <CardDescription>
                Submitted by {ad.advertiserAccountId} on {new Date(ad.submittedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Campaign Name</Label>
                <p className="text-lg font-semibold text-gray-900">{ad.campaignName}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Ad Content</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-gray-800">{ad.adContent}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Tracked Link</Label>
                <div className="mt-1">
                  <a 
                    href={ad.trackedLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {ad.trackedLink}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Targeting Keywords</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ad.targetingKeywords?.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Advertiser Submitted Category</Label>
                <div className="mt-1">
                  <Badge className={getCategoryColor(ad.advertiserSubmittedCategory)}>
                    {ad.advertiserSubmittedCategory}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validation Decision</CardTitle>
              <CardDescription>
                Review the ad and make your decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Decision */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Decision</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="approve"
                      name="decision"
                      value="approve"
                      checked={decision === 'approve'}
                      onChange={(e) => setDecision(e.target.value as 'approve')}
                      className="text-green-600"
                    />
                    <label htmlFor="approve" className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Approve Ad
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="reject"
                      name="decision"
                      value="reject"
                      checked={decision === 'reject'}
                      onChange={(e) => setDecision(e.target.value as 'reject')}
                      className="text-red-600"
                    />
                    <label htmlFor="reject" className="flex items-center gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Reject Ad
                    </label>
                  </div>
                </div>
              </div>

              {/* Rating Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Assign Content Rating
                </Label>
                <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
                  {contentCategories.map((category) => (
                    <div key={category.value} className="flex items-start space-x-2">
                      <RadioGroupItem value={category.value} id={category.value} className="mt-1" />
                      <div className="flex-1">
                        <label htmlFor={category.value} className="cursor-pointer">
                          <Badge className={category.color}>
                            {category.label}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Rating Mismatch Warning */}
              {isRatingMismatch && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Rating Mismatch</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your rating ({selectedRating}) differs from advertiser&apos;s submission ({ad.advertiserSubmittedCategory}).
                    Please provide comments explaining the reason.
                  </p>
                </div>
              )}

              {/* Comments */}
              <div>
                <Label htmlFor="comments" className="text-sm font-medium text-gray-700">
                  Comments {isRatingMismatch && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Optional feedback for the advertiser..."
                  rows={3}
                  className="mt-1"
                />
                {isRatingMismatch && !comments.trim() && (
                  <p className="text-xs text-red-600 mt-1">
                    Comments required when rating differs from submission
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmitReview}
                disabled={
                  isSubmitting || 
                  !selectedRating || 
                  !decision ||
                  (isRatingMismatch && !comments.trim())
                }
                className="w-full"
              >
                {isSubmitting ? 'Submitting Review...' : 'Submit Validation'}
              </Button>
            </CardContent>
          </Card>

          {/* Validation Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Validation Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Is the content appropriate for the claimed category?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Does the ad contain misleading or false information?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Is the tracked link functional and relevant?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Does the content violate platform guidelines?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Is the content quality acceptable for the network?</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

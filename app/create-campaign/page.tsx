'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/contexts/wallet-context';
import { createCampaign } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

const contentCategories = [
  { value: 'PG', label: 'PG', description: 'General audience content' },
  { value: 'Family-Friendly', label: 'Family-Friendly', description: 'Safe for all ages' },
  { value: 'Adult', label: 'Adult', description: 'Mature content' },
  { value: 'Informative', label: 'Informative', description: 'Educational content' },
  { value: 'Promotional', label: 'Promotional', description: 'Marketing content' }
];

export default function CreateCampaign() {
  const router = useRouter();
  const { selectedWallet } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    campaignName: '',
    adContent: '',
    trackedLink: '',
    contentCategory: '',
    budget: '',
    durationStart: '',
    durationEnd: '',
    bidAmount: '',
    targetingKeywords: [] as string[]
  });
  
  const [newKeyword, setNewKeyword] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.targetingKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        targetingKeywords: [...prev.targetingKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      targetingKeywords: prev.targetingKeywords.filter(k => k !== keyword)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWallet?.accountIdString) {
      setError('Please select a wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createCampaign({
        accountId: selectedWallet.accountIdString,
        campaignName: formData.campaignName,
        adContent: formData.adContent,
        trackedLink: formData.trackedLink,
        contentCategory: formData.contentCategory,
        budget: formData.budget || undefined,
        durationStart: formData.durationStart || undefined,
        durationEnd: formData.durationEnd || undefined,
        targetingKeywords: formData.targetingKeywords.length > 0 ? formData.targetingKeywords : undefined,
        bidAmount: formData.bidAmount || undefined
      });
      
      // Show success message with HCS info if available
      if (result && 'hcs' in result && result.hcs?.topicId) {
        console.log('✅ Campaign created and submitted to HCS:', {
          campaignId: result.campaign.id,
          topicId: result.hcs.topicId,
          messageId: result.hcs.messageId,
          hashscanUrl: result.hcs.hashscanUrl
        });
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      console.error('Failed to create campaign:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.campaignName && formData.adContent && formData.trackedLink && formData.contentCategory;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">
            Set up your advertising campaign to reach AI agents across the network
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your advertising campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  value={formData.campaignName}
                  onChange={(e) => handleInputChange('campaignName', e.target.value)}
                  placeholder="e.g., Summer Tech Sale"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentCategory">Content Category *</Label>
                <Select value={formData.contentCategory} onValueChange={(value) => handleInputChange('contentCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adContent">Ad Content *</Label>
              <Textarea
                id="adContent"
                value={formData.adContent}
                onChange={(e) => handleInputChange('adContent', e.target.value)}
                placeholder="Write your ad copy here. This will be integrated into AI agent responses..."
                rows={4}
                required
              />
              <p className="text-xs text-gray-500">
                This content will be contextually integrated into AI agent responses
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackedLink">Tracked Link *</Label>
              <Input
                id="trackedLink"
                type="url"
                value={formData.trackedLink}
                onChange={(e) => handleInputChange('trackedLink', e.target.value)}
                placeholder="https://your-website.com/landing-page"
                required
              />
              <p className="text-xs text-gray-500">
                Link clicks will be tracked for performance measurement and billing
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Bidding */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Bidding</CardTitle>
            <CardDescription>
              Set your campaign budget and bidding strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Total Budget (HBAR)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="1000"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500">
                  Optional. Leave empty for unlimited budget
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bidAmount">Bid per Link Open (HBAR)</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  value={formData.bidAmount}
                  onChange={(e) => handleInputChange('bidAmount', e.target.value)}
                  placeholder="0.50"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500">
                  Amount paid for each verified link click
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Targeting & Duration */}
        <Card>
          <CardHeader>
            <CardTitle>Targeting & Duration</CardTitle>
            <CardDescription>
              Define your target audience and campaign duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Targeting Keywords</Label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add targeting keyword..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                />
                <Button type="button" onClick={addKeyword} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.targetingKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.targetingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Keywords help match your ads with relevant AI agent contexts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationStart">Start Date</Label>
                <Input
                  id="durationStart"
                  type="datetime-local"
                  value={formData.durationStart}
                  onChange={(e) => handleInputChange('durationStart', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationEnd">End Date</Label>
                <Input
                  id="durationEnd"
                  type="datetime-local"
                  value={formData.durationEnd}
                  onChange={(e) => handleInputChange('durationEnd', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Review */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Review</CardTitle>
            <CardDescription>
              Review your campaign settings before submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Campaign Name:</span>
                  <p className="text-gray-600">{formData.campaignName || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium">Content Category:</span>
                  <p className="text-gray-600">{formData.contentCategory || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium">Budget:</span>
                  <p className="text-gray-600">
                    {formData.budget ? `${formData.budget} HBAR` : 'Unlimited'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Bid per Click:</span>
                  <p className="text-gray-600">
                    {formData.bidAmount ? `${formData.bidAmount} HBAR` : 'Not specified'}
                  </p>
                </div>
              </div>
              {formData.adContent && (
                <div>
                  <span className="font-medium">Ad Preview:</span>
                  <p className="text-gray-600 text-sm mt-1 italic">
                    "{formData.adContent}"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting || !selectedWallet}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
}

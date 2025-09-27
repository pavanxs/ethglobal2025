// API utility functions for campaign management

export interface Campaign {
  id: string;
  name: string;
  status: 'Pending Review' | 'Active' | 'Paused' | 'Rejected' | 'Completed';
  budget: string;
  spent: string;
  linkOpens: string;
  impressions: string;
  adContent: string;
  trackedLink: string;
  advertiserSubmittedCategory: string;
  targetingKeywords: string[] | null;
  bidAmount: string | null;
  durationStart: string | null;
  durationEnd: string | null;
  hcsMessageId: string | null;
  hcsMessageStatus: string | null;
  // New review status fields
  underReview: boolean;
  validatorDecision: string | null;
  validatorAccountId: string | null;
  validatorRating: string | null;
  validatorComments: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignData {
  accountId: string;
  campaignName: string;
  adContent: string;
  trackedLink: string;
  contentCategory: string;
  budget?: string;
  durationStart?: string;
  durationEnd?: string;
  targetingKeywords?: string[];
  bidAmount?: string;
}

// Get all campaigns for an account
export async function getCampaigns(accountId: string): Promise<Campaign[]> {
  const response = await fetch(`/api/campaigns?accountId=${encodeURIComponent(accountId)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  
  const data = await response.json();
  return data.campaigns;
}

// Get specific campaign details
export async function getCampaign(campaignId: string, accountId: string): Promise<Campaign> {
  const response = await fetch(`/api/campaigns/${campaignId}?accountId=${encodeURIComponent(accountId)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch campaign');
  }
  
  const data = await response.json();
  return data.campaign;
}

// Create new campaign
export async function createCampaign(campaignData: CreateCampaignData): Promise<Campaign> {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create campaign');
  }
  
  const data = await response.json();
  return data.campaign;
}

// Update campaign
export async function updateCampaign(
  campaignId: string, 
  accountId: string, 
  updates: Partial<Campaign>
): Promise<Campaign> {
  const response = await fetch(`/api/campaigns/${campaignId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountId,
      ...updates,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update campaign');
  }
  
  const data = await response.json();
  return data.campaign;
}

// Delete campaign
export async function deleteCampaign(campaignId: string, accountId: string): Promise<void> {
  const response = await fetch(`/api/campaigns/${campaignId}?accountId=${encodeURIComponent(accountId)}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete campaign');
  }
}

import {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  Status
} from '@hashgraph/sdk';

export interface HCSTopicResult {
  topicId: string;
  transactionId: string;
  status: string;
  hashscanUrl: string;
}

export interface HCSMessageResult {
  transactionId: string;
  status: string;
  hashscanUrl: string;
}

export interface CampaignHCSData {
  type: 'AD_SUBMITTED_FOR_REVIEW' | 'AD_APPROVED' | 'AD_REJECTED' | 'CAMPAIGN_UPDATED' | 'CAMPAIGN_DELETED';
  timestamp: string;
  campaignId: string;
  accountId: string;
  validatorAccountId?: string; // For approval/rejection messages
  data: {
    name: string;
    adContent: string;
    trackedLink: string;
    contentCategory: string;
    budget?: string;
    bidAmount?: string;
    targetingKeywords?: string[];
    status: string;
    validatorGrade?: 'PG' | 'Family-Friendly' | 'Adult' | 'Informative' | 'Promotional' | 'Unsuitable';
    validatorComments?: string;
  };
}

// Create Hedera client with account credentials
function createHederaClient(accountId: string, privateKey: string): Client {
  const client = Client.forTestnet();
  const operatorAccountId = AccountId.fromString(accountId);
  const operatorPrivateKey = PrivateKey.fromStringED25519(privateKey);
  
  client.setOperator(operatorAccountId, operatorPrivateKey);
  return client;
}

// Get private key for an account ID (from environment variables)
function getPrivateKeyForAccount(accountId: string): string | null {
  const accountMap: { [key: string]: string } = {
    '0.0.6885334': process.env.WALLET_ONE_PRIVATE_KEY || '',
    '0.0.6916595': process.env.WALLET_TWO_PRIVATE_KEY || '',
    '0.0.6916585': process.env.WALLET_THREE_PRIVATE_KEY || '',
    '0.0.6916597': process.env.WALLET_FOUR_PRIVATE_KEY || ''
  };
  
  return accountMap[accountId] || null;
}

/**
 * Create a new HCS topic for campaign messages
 */
export async function createCampaignTopic(
  operatorAccountId: string,
  memo: string = 'AI Agent Network Campaign Topic'
): Promise<HCSTopicResult> {
  const privateKey = getPrivateKeyForAccount(operatorAccountId);
  if (!privateKey) {
    throw new Error(`Private key not found for account ${operatorAccountId}`);
  }

  const client = createHederaClient(operatorAccountId, privateKey);

  try {
    // Create the topic
    const topicCreateTx = new TopicCreateTransaction()
      .setTopicMemo(memo);

    const txResponse = await topicCreateTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const topicId = receipt.topicId!.toString();
    const transactionId = txResponse.transactionId.toString();

    const result: HCSTopicResult = {
      topicId,
      transactionId,
      status: receipt.status.toString(),
      hashscanUrl: `https://hashscan.io/testnet/tx/${transactionId}`
    };

    console.log('✅ HCS Topic Created:', result);
    return result;
  } catch (error) {
    console.error('❌ Error creating HCS topic:', error);
    throw error;
  } finally {
    client.close();
  }
}

/**
 * Submit campaign data as JSON message to HCS topic
 */
export async function submitCampaignMessage(
  operatorAccountId: string,
  topicId: string,
  campaignData: CampaignHCSData
): Promise<HCSMessageResult> {
  const privateKey = getPrivateKeyForAccount(operatorAccountId);
  if (!privateKey) {
    throw new Error(`Private key not found for account ${operatorAccountId}`);
  }

  const client = createHederaClient(operatorAccountId, privateKey);

  try {
    // Convert campaign data to JSON string
    const messageJson = JSON.stringify(campaignData, null, 2);
    
    // Check message size (HCS limit is 1024 bytes)
    const messageSize = Buffer.byteLength(messageJson, 'utf8');
    if (messageSize > 1024) {
      throw new Error(`Message too large: ${messageSize} bytes (max 1024)`);
    }

    // Submit message to topic
    const messageTx = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(messageJson);

    const txResponse = await messageTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const transactionId = txResponse.transactionId.toString();

    const result: HCSMessageResult = {
      transactionId,
      status: receipt.status.toString(),
      hashscanUrl: `https://hashscan.io/testnet/tx/${transactionId}`
    };

    console.log('✅ HCS Message Submitted:', result);
    console.log('📝 Message Content:', messageJson);
    return result;
  } catch (error) {
    console.error('❌ Error submitting HCS message:', error);
    throw error;
  } finally {
    client.close();
  }
}

/**
 * Query messages from HCS topic using Mirror Node API
 */
export async function queryTopicMessages(topicId: string, limit: number = 10) {
  try {
    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=${limit}&order=desc`;
    
    const response = await fetch(mirrorNodeUrl);
    if (!response.ok) {
      throw new Error(`Mirror Node API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.messages && data.messages.length > 0) {
      // Decode messages from base64 and parse JSON
      const decodedMessages = data.messages.map((msg: any) => {
        try {
          const messageContent = Buffer.from(msg.message, 'base64').toString('utf8');
          const parsedContent = JSON.parse(messageContent);
          
          return {
            ...msg,
            decodedMessage: messageContent,
            parsedData: parsedContent,
            timestamp: new Date(msg.consensus_timestamp * 1000).toISOString()
          };
        } catch (parseError) {
          console.warn('Failed to parse message:', parseError);
          return {
            ...msg,
            decodedMessage: Buffer.from(msg.message, 'base64').toString('utf8'),
            parsedData: null,
            timestamp: new Date(msg.consensus_timestamp * 1000).toISOString()
          };
        }
      });

      return {
        messages: decodedMessages,
        count: data.messages.length,
        topicId
      };
    }

    return {
      messages: [],
      count: 0,
      topicId
    };
  } catch (error) {
    console.error('❌ Error querying HCS messages:', error);
    throw error;
  }
}

/**
 * Helper to create campaign HCS data structure
 */
export function createCampaignHCSData(
  type: CampaignHCSData['type'],
  campaignId: string,
  accountId: string,
  campaignData: any
): CampaignHCSData {
  return {
    type,
    timestamp: new Date().toISOString(),
    campaignId,
    accountId,
    data: {
      name: campaignData.name,
      adContent: campaignData.adContent,
      trackedLink: campaignData.trackedLink,
      contentCategory: campaignData.advertiserSubmittedCategory,
      budget: campaignData.budget,
      bidAmount: campaignData.bidAmount,
      targetingKeywords: campaignData.targetingKeywords,
      status: campaignData.status
    }
  };
}

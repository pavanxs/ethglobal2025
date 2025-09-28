'use server';

import { PrivateKey, AccountId } from '@hashgraph/sdk';

export interface HederaWallet {
  id: string;
  name: string;
  accountIdString: string;
  balance?: string;
  // Note: We don't send private keys to client for security
}

export async function getHardcodedWallets(): Promise<HederaWallet[]> {
  const wallets: HederaWallet[] = [];
  
  // Load wallets from environment variables with your specific account IDs
  
  const walletConfigs = [
    { envPrefix: 'WALLET_ONE', name: 'Tech Startup Advertiser', expectedAccountId: '0.0.6885334' },
    { envPrefix: 'WALLET_TWO', name: 'E-commerce Business', expectedAccountId: '0.0.6916595' },
    { envPrefix: 'WALLET_THREE', name: 'AI Agent Developer', expectedAccountId: '0.0.6916585' },
    { envPrefix: 'WALLET_FOUR', name: 'Content Validator', expectedAccountId: '0.0.6916597' }
  ];

  walletConfigs.forEach((config, index) => {
    const accountIdString = process.env[`${config.envPrefix}_ACCOUNT_ID`];
    const privateKeyString = process.env[`${config.envPrefix}_PRIVATE_KEY`];
    
    if (accountIdString && privateKeyString) {
      try {
        // Validate the account ID and private key format
        AccountId.fromString(accountIdString);
        PrivateKey.fromStringED25519(privateKeyString);
        
        wallets.push({
          id: `wallet_${index + 1}`,
          name: config.name,
          accountIdString,
        });
      } catch (error) {
        console.error(`Failed to load ${config.name}:`, error);
      }
    } else {
      // Fallback to hardcoded account ID if env vars not set (for demo purposes)
      console.log(`Environment variables not set for ${config.name}, using hardcoded account ID`);
      wallets.push({
        id: `wallet_${index + 1}`,
        name: config.name,
        accountIdString: config.expectedAccountId,
      });
    }
  });
  
  // Fetch balances for all wallets
  const walletsWithBalances = await Promise.all(
    wallets.map(async (wallet) => {
      const balance = await getWalletBalance(wallet.accountIdString);
      return { ...wallet, balance };
    })
  );
  
  return walletsWithBalances;
}

export async function getWalletBalance(accountId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}`,
      { cache: 'no-store' } // Always fetch fresh data
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert from tinybars to HBAR (1 HBAR = 100,000,000 tinybars)
    const balanceInTinybars = data.balance?.balance || 0;
    const balanceInHbar = (balanceInTinybars / 100_000_000).toFixed(2);
    
    return `${balanceInHbar} ℏ`;
  } catch (error) {
    console.error(`Failed to fetch balance for ${accountId}:`, error);
    return '0.00 ℏ';
  }
}

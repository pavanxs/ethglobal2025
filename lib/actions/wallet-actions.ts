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
  
  // Load wallets from environment variables
  const walletConfigs = [
    { envPrefix: 'WALLET_ONE', name: 'AI Agent Owner' },
    { envPrefix: 'WALLET_TWO', name: 'Advertiser' },
    { envPrefix: 'WALLET_THREE', name: 'Validator' },
    { envPrefix: 'WALLET_FOUR', name: 'Extra Wallet' }
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

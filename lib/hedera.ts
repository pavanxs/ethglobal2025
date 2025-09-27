import {
  Client,
  PrivateKey,
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters
} from "@hashgraph/sdk";

export interface HederaWallet {
  id: string;
  name: string;
  privateKey: PrivateKey;
  accountId: AccountId;
  accountIdString: string;
}

export function getHardcodedWallets(): HederaWallet[] {
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
        const accountId = AccountId.fromString(accountIdString);
        const privateKey = PrivateKey.fromStringED25519(privateKeyString);
        
        wallets.push({
          id: `wallet_${index + 1}`,
          name: config.name,
          privateKey,
          accountId,
          accountIdString,
        });
      } catch (error) {
        console.error(`Failed to load ${config.name}:`, error);
      }
    }
  });
  
  return wallets;
}

export function createHederaClient(wallet: HederaWallet): Client {
  // Pre-configured client for test network (testnet)
  const client = Client.forTestnet();
  
  // Set the operator with the account ID and private key
  client.setOperator(wallet.accountId, wallet.privateKey);
  
  return client;
}

export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Example function to execute smart contract (based on your reference)
export async function executeContract(
  wallet: HederaWallet, 
  contractId: string, 
  functionName: string, 
  parameters?: ContractFunctionParameters
): Promise<string> {
  const client = createHederaClient(wallet);
  
  try {
    // Create the transaction
    const txContractExecute = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(100_000_000)
      .setFunction(functionName, parameters || new ContractFunctionParameters());

    // Sign with the client operator private key and submit
    const txContractExecuteResponse = await txContractExecute.execute(client);

    // Request the receipt of the transaction
    const receiptContractExecuteTx = await txContractExecuteResponse.getReceipt(client);

    // Get the transaction ID
    const txContractExecuteId = txContractExecuteResponse.transactionId.toString();

    console.log("Contract execution successful:", {
      status: receiptContractExecuteTx.status.toString(),
      transactionId: txContractExecuteId,
      hashscanUrl: `https://hashscan.io/testnet/tx/${txContractExecuteId}`
    });

    return txContractExecuteId;
  } catch (error) {
    console.error("Contract execution failed:", error);
    throw error;
  } finally {
    client.close();
  }
}




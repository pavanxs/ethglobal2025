import {
    AccountId,
    PrivateKey,
    Client,
    AccountCreateTransaction,
    Hbar
  } from "@hashgraph/sdk"; // v2.64.5
  
  async function main() {
    let client;
    try {
      // Operator account and private key (existing, funded account)
      const MY_ACCOUNT_ID = AccountId.fromString("0.0.6885334");
      const MY_PRIVATE_KEY = PrivateKey.fromStringED25519("9f6b2869835cfe9f0ae1403067949fdf8d40cbe835b4f9c9d0afb2bed79ce320");
  
      // Pre-configured client for test network (testnet)
      client = Client.forTestnet();
      client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
  
      // Generate a new ED25519 key pair for the new account
      const newKey = PrivateKey.generateED25519();
      const hexPrivateKey = Buffer.from(newKey.toBytesRaw()).toString('hex');
  
      // Create a new account with this public key
      const newAccountTx = await new AccountCreateTransaction()
        .setKey(newKey.publicKey)
        .setInitialBalance(Hbar.fromTinybars(1000)) // Set initial balance as needed
        .execute(client);
  
      const receipt = await newAccountTx.getReceipt(client);
      const newAccountId = receipt.accountId;
  
      // Output
      console.log("New account ID:", newAccountId.toString());
      console.log("New raw HEX private key:", hexPrivateKey);
      console.log("New public key:", newKey.publicKey.toString());
  
    } catch (error) {
      console.error(error);
    } finally {
      if (client) client.close();
    }
  }
  
  main();
  
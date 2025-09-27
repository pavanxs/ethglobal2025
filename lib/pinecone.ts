// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

// Use the ethglobal2025 index
const indexName = 'ethglobal2025';

// Get the index
export const getIndex = () => {
  return pc.index(indexName);
};

// Export the Pinecone client
export { pc };
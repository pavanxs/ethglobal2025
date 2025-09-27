// Test script for the Pinecone search API
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSearchAPI() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('Testing Pinecone Search API...\n');

    // Test POST request
    console.log('1. Testing POST /api/search');
    const postResponse = await fetch(`${baseUrl}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'vector database search',
        topK: 5,
        includeMetadata: true
      })
    });

    const postResult = await postResponse.json();
    console.log('POST Response:', JSON.stringify(postResult, null, 2));

    // Test GET request
    console.log('\n2. Testing GET /api/search');
    const getResponse = await fetch(`${baseUrl}/api/search?q=machine learning&topK=3`);
    const getResult = await getResponse.json();
    console.log('GET Response:', JSON.stringify(getResult, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testSearchAPI();
}

export { testSearchAPI };

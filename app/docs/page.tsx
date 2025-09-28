'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Code, 
  Zap, 
  Globe, 
  Puzzle, 
  Bot, 
  Copy,
  ChevronRight,
  BookOpen,
  Cpu,
  MessageSquare
} from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'openai-api', title: 'OpenAI Compatible API', icon: Zap },
    { id: 'sdk', title: 'SDK Integration', icon: Code },
    { id: 'a2a', title: 'Agent-to-Agent (A2A)', icon: Bot },
    { id: 'mcp', title: 'MCP Protocol', icon: MessageSquare },
    { id: 'full-agent', title: 'Full AI Agent', icon: Cpu },
    { id: 'web-widget', title: 'Web Widget/IFrame', icon: Globe },
    { id: 'plugin', title: 'Plugin Integration', icon: Puzzle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Developer Integration Guide
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            Integrate your AI agents with our decentralized monetization network. 
            Choose from multiple integration methods to start earning revenue through contextual advertising.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Integration Methods</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{section.title}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {activeSection === 'overview' && <OverviewSection />}
              {activeSection === 'openai-api' && <OpenAIAPISection copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
              {activeSection === 'sdk' && <SDKSection copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
              {activeSection === 'a2a' && <A2ASection copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
              {activeSection === 'mcp' && <MCPSection copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
              {activeSection === 'full-agent' && <FullAgentSection copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
              {activeSection === 'web-widget' && <WebWidgetSection copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
              {activeSection === 'plugin' && <PluginSection copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Integration Overview
          </CardTitle>
          <CardDescription>
            Choose the integration method that best fits your AI agent architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  SDK Integration
                </CardTitle>
                <Badge variant="secondary">Recommended</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  Direct API integration for maximum control and customization.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Full control over ad placement</li>
                  <li>✅ Custom filtering logic</li>
                  <li>✅ Real-time bidding</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Agent-to-Agent (A2A)
                </CardTitle>
                <Badge variant="outline">Advanced</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  Direct communication between AI agents for seamless integration.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Autonomous operation</li>
                  <li>✅ Context-aware matching</li>
                  <li>✅ Minimal latency</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  MCP Protocol
                </CardTitle>
                <Badge variant="outline">Standard</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  Model Context Protocol for standardized AI agent communication.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Industry standard</li>
                  <li>✅ Easy implementation</li>
                  <li>✅ Broad compatibility</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Web Widget
                </CardTitle>
                <Badge variant="outline">Simple</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  Embed monetization directly in web applications with minimal code.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ No backend required</li>
                  <li>✅ Quick setup</li>
                  <li>✅ Responsive design</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Register your AI agent in our platform</li>
              <li>2. Get your API key and configure monetization preferences</li>
              <li>3. Choose your integration method from the options above</li>
              <li>4. Implement the integration using our guides</li>
              <li>5. Start earning revenue from contextual ads!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SDKSection({ copyToClipboard, copiedCode }: { copyToClipboard: (code: string, id: string) => void, copiedCode: string | null }) {
  const installCode = `npm install @ai-monetization/sdk
# or
yarn add @ai-monetization/sdk`;

  const initCode = `import { AIMonetizationSDK } from '@ai-monetization/sdk';

const sdk = new AIMonetizationSDK({
  apiKey: 'your-api-key-here',
  agentId: 'your-agent-id',
  baseUrl: 'https://your-platform.com/api'
});`;

  const searchAdsCode = `// Search for relevant ads based on context
const searchAds = async (userQuery: string, context: any) => {
  try {
    const response = await sdk.searchAds({
      query: userQuery,
      context: context,
      maxAds: 3,
      categories: ['PG', 'Family-Friendly'], // Your allowed categories
      filters: {
        minBid: 0.01,
        excludeCompetitors: true
      }
    });

    return response.ads;
  } catch (error) {
    console.error('Failed to fetch ads:', error);
    return [];
  }
};`;

  const integrateAdsCode = `// Integrate ads into your AI response
const generateResponseWithAds = async (userQuery: string) => {
  // Get your AI's base response
  const baseResponse = await yourAI.generateResponse(userQuery);
  
  // Search for relevant ads
  const relevantAds = await searchAds(userQuery, {
    responseLength: baseResponse.length,
    topic: extractTopic(userQuery),
    userIntent: analyzeIntent(userQuery)
  });

  // Intelligently integrate ads
  if (relevantAds.length > 0) {
    const integratedResponse = sdk.integrateAds(baseResponse, relevantAds, {
      placement: 'contextual', // 'contextual' | 'append' | 'sidebar'
      maxAdsPerResponse: 2,
      naturalLanguage: true
    });
    
    return integratedResponse;
  }

  return baseResponse;
};`;

  const trackEngagementCode = `// Track ad engagement for revenue
const trackAdClick = async (adId: string, userId?: string) => {
  try {
    await sdk.trackEngagement({
      adId,
      userId,
      eventType: 'click',
      timestamp: new Date().toISOString()
    });
    
    console.log('Ad engagement tracked successfully');
  } catch (error) {
    console.error('Failed to track engagement:', error);
  }
};

// In your ad rendering component
const AdComponent = ({ ad }) => (
  <div className="ad-container">
    <a 
      href={ad.trackedLink}
      onClick={() => trackAdClick(ad.id)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {ad.content}
    </a>
  </div>
);`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            SDK Integration Guide
          </CardTitle>
          <CardDescription>
            Direct API integration for maximum control and customization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Installation</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{installCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(installCode, 'install')}
              >
                {copiedCode === 'install' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Initialize SDK</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{initCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(initCode, 'init')}
              >
                {copiedCode === 'init' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Search for Relevant Ads</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{searchAdsCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(searchAdsCode, 'search')}
              >
                {copiedCode === 'search' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">4. Integrate Ads into Responses</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{integrateAdsCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(integrateAdsCode, 'integrate')}
              >
                {copiedCode === 'integrate' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">5. Track Engagement</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{trackEngagementCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(trackEngagementCode, 'track')}
              >
                {copiedCode === 'track' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✅ SDK Benefits</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Full control over ad placement and filtering</li>
              <li>• Real-time contextual matching via Pinecone</li>
              <li>• Automatic revenue tracking and payouts via Hedera</li>
              <li>• TypeScript support with full type safety</li>
              <li>• Built-in error handling and retry logic</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function A2ASection({ copyToClipboard, copiedCode }: { copyToClipboard: (code: string, id: string) => void, copiedCode: string | null }) {
  const a2aProtocolCode = `// A2A Protocol Implementation
interface A2AMessage {
  type: 'AD_REQUEST' | 'AD_RESPONSE' | 'ENGAGEMENT_EVENT';
  agentId: string;
  timestamp: string;
  payload: any;
}

class A2AAgent {
  constructor(private config: A2AConfig) {}

  async requestAds(context: AdContext): Promise<Ad[]> {
    const message: A2AMessage = {
      type: 'AD_REQUEST',
      agentId: this.config.agentId,
      timestamp: new Date().toISOString(),
      payload: {
        context,
        preferences: this.config.monetizationPreferences,
        maxAds: 3
      }
    };

    return await this.sendMessage(message);
  }

  private async sendMessage(message: A2AMessage) {
    // Direct agent-to-agent communication
    const response = await fetch(\`\${this.config.networkEndpoint}/a2a/message\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.config.apiKey}\`
      },
      body: JSON.stringify(message)
    });

    return response.json();
  }
}`;

  const a2aUsageCode = `// Using A2A in your AI agent
const a2aAgent = new A2AAgent({
  agentId: 'your-agent-id',
  apiKey: 'your-api-key',
  networkEndpoint: 'https://your-platform.com/api',
  monetizationPreferences: {
    categories: ['PG', 'Family-Friendly'],
    minBid: 0.01,
    maxAdsPerResponse: 2
  }
});

// In your AI response generation
const generateResponse = async (userQuery: string) => {
  const baseResponse = await yourAI.process(userQuery);
  
  // Request ads from the network
  const ads = await a2aAgent.requestAds({
    query: userQuery,
    responseContext: baseResponse,
    userProfile: getCurrentUserProfile(),
    conversationHistory: getRecentHistory()
  });

  // Integrate ads naturally
  if (ads.length > 0) {
    return integrateAdsNaturally(baseResponse, ads);
  }

  return baseResponse;
};`;

  const a2aListenerCode = `// A2A Event Listener for incoming requests
class A2AListener {
  constructor(private agent: A2AAgent) {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Listen for incoming A2A messages
    this.agent.onMessage('AD_REQUEST', async (message) => {
      const { context, preferences } = message.payload;
      
      // Process ad request using your agent's logic
      const relevantAds = await this.findRelevantAds(context, preferences);
      
      // Respond with ads
      return {
        type: 'AD_RESPONSE',
        agentId: this.agent.config.agentId,
        timestamp: new Date().toISOString(),
        payload: { ads: relevantAds }
      };
    });

    // Handle engagement events
    this.agent.onMessage('ENGAGEMENT_EVENT', async (message) => {
      await this.trackEngagement(message.payload);
    });
  }

  private async findRelevantAds(context: any, preferences: any) {
    // Your ad matching logic here
    return await this.agent.searchAds(context, preferences);
  }
}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Agent-to-Agent (A2A) Integration
          </CardTitle>
          <CardDescription>
            Direct communication between AI agents for autonomous monetization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🤖 A2A Protocol Overview</h4>
            <p className="text-sm text-blue-800">
              Agent-to-Agent communication enables your AI agent to autonomously discover, 
              negotiate, and integrate monetization opportunities with other agents in the network.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">1. A2A Protocol Implementation</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{a2aProtocolCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(a2aProtocolCode, 'a2a-protocol')}
              >
                {copiedCode === 'a2a-protocol' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Integration in Your Agent</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{a2aUsageCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(a2aUsageCode, 'a2a-usage')}
              >
                {copiedCode === 'a2a-usage' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Event Handling</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{a2aListenerCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(a2aListenerCode, 'a2a-listener')}
              >
                {copiedCode === 'a2a-listener' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ A2A Advantages</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Autonomous operation</li>
                <li>• Real-time negotiation</li>
                <li>• Context-aware matching</li>
                <li>• Minimal latency</li>
                <li>• Decentralized architecture</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Considerations</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Requires agent infrastructure</li>
                <li>• More complex setup</li>
                <li>• Network dependency</li>
                <li>• Security considerations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MCPSection({ copyToClipboard, copiedCode }: { copyToClipboard: (code: string, id: string) => void, copiedCode: string | null }) {
  const mcpServerCode = `// MCP Server Implementation
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

class AIMonetizationMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'ai-monetization-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupTools();
    this.setupResources();
  }

  private setupTools() {
    // Tool for searching ads
    this.server.setRequestHandler('tools/call', async (request) => {
      if (request.params.name === 'search_ads') {
        const { query, context, maxAds = 3 } = request.params.arguments;
        
        const ads = await this.searchAds(query, context, maxAds);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ads, null, 2)
            }
          ]
        };
      }
    });

    // Tool for tracking engagement
    this.server.setRequestHandler('tools/call', async (request) => {
      if (request.params.name === 'track_engagement') {
        const { adId, eventType, userId } = request.params.arguments;
        
        await this.trackEngagement(adId, eventType, userId);
        
        return {
          content: [
            {
              type: 'text',
              text: 'Engagement tracked successfully'
            }
          ]
        };
      }
    });
  }

  private async searchAds(query: string, context: any, maxAds: number) {
    // Implementation for ad search
    const response = await fetch('https://your-platform.com/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, context, maxAds })
    });
    
    return response.json();
  }

  private async trackEngagement(adId: string, eventType: string, userId?: string) {
    // Implementation for engagement tracking
    await fetch('https://your-platform.com/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId, eventType, userId, timestamp: new Date().toISOString() })
    });
  }
}`;

  const mcpClientCode = `// MCP Client Usage in Your AI Agent
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

class AIAgentWithMCP {
  private mcpClient: Client;

  async initialize() {
    // Connect to MCP server
    this.mcpClient = new Client(
      {
        name: 'ai-agent-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await this.mcpClient.connect();
  }

  async generateResponseWithAds(userQuery: string) {
    // Generate base response
    const baseResponse = await this.generateBaseResponse(userQuery);

    // Search for ads via MCP
    const adsResult = await this.mcpClient.request(
      {
        method: 'tools/call',
        params: {
          name: 'search_ads',
          arguments: {
            query: userQuery,
            context: {
              responseLength: baseResponse.length,
              topic: this.extractTopic(userQuery),
              userIntent: this.analyzeIntent(userQuery)
            },
            maxAds: 2
          }
        }
      }
    );

    const ads = JSON.parse(adsResult.content[0].text);

    // Integrate ads if available
    if (ads.length > 0) {
      const integratedResponse = this.integrateAds(baseResponse, ads);
      
      // Track that ads were shown
      for (const ad of ads) {
        await this.mcpClient.request({
          method: 'tools/call',
          params: {
            name: 'track_engagement',
            arguments: {
              adId: ad.id,
              eventType: 'impression'
            }
          }
        });
      }

      return integratedResponse;
    }

    return baseResponse;
  }

  private integrateAds(response: string, ads: any[]) {
    // Your ad integration logic
    return response + '\\n\\n' + ads.map(ad => 
      \`💡 \${ad.content} - [Learn more](\${ad.trackedLink})\`
    ).join('\\n');
  }
}`;

  const mcpConfigCode = `// MCP Configuration
{
  "mcpServers": {
    "ai-monetization": {
      "command": "node",
      "args": ["path/to/ai-monetization-mcp-server.js"],
      "env": {
        "API_KEY": "your-api-key",
        "AGENT_ID": "your-agent-id",
        "BASE_URL": "https://your-platform.com/api"
      }
    }
  }
}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            MCP (Model Context Protocol) Integration
          </CardTitle>
          <CardDescription>
            Standardized protocol for AI agent communication and tool access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">🔌 MCP Overview</h4>
            <p className="text-sm text-purple-800">
              Model Context Protocol (MCP) provides a standardized way for AI agents to access 
              external tools and resources. This integration allows your agent to seamlessly 
              access our monetization platform through MCP tools.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">1. MCP Server Implementation</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{mcpServerCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(mcpServerCode, 'mcp-server')}
              >
                {copiedCode === 'mcp-server' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Client Integration</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{mcpClientCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(mcpClientCode, 'mcp-client')}
              >
                {copiedCode === 'mcp-client' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. MCP Configuration</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{mcpConfigCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(mcpConfigCode, 'mcp-config')}
              >
                {copiedCode === 'mcp-config' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🛠️ Available MCP Tools</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h5 className="font-medium text-blue-800">search_ads</h5>
                <p className="text-sm text-blue-700">Find contextually relevant advertisements</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-800">track_engagement</h5>
                <p className="text-sm text-blue-700">Track user interactions with ads</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-800">get_earnings</h5>
                <p className="text-sm text-blue-700">Retrieve monetization statistics</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-800">update_preferences</h5>
                <p className="text-sm text-blue-700">Modify ad category preferences</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FullAgentSection({ copyToClipboard, copiedCode }: { copyToClipboard: (code: string, id: string) => void, copiedCode: string | null }) {
  const agentArchitectureCode = `// Complete AI Agent with Monetization
import { OpenAI } from 'openai';
import { AIMonetizationSDK } from '@ai-monetization/sdk';

class MonetizedAIAgent {
  private openai: OpenAI;
  private monetization: AIMonetizationSDK;
  private conversationHistory: Array<{role: string, content: string}> = [];

  constructor(config: AgentConfig) {
    this.openai = new OpenAI({ apiKey: config.openaiKey });
    this.monetization = new AIMonetizationSDK({
      apiKey: config.monetizationKey,
      agentId: config.agentId,
      baseUrl: config.platformUrl
    });
  }

  async processUserQuery(query: string, userId?: string): Promise<AgentResponse> {
    // 1. Analyze user intent and context
    const context = await this.analyzeContext(query);
    
    // 2. Generate base AI response
    const baseResponse = await this.generateBaseResponse(query, context);
    
    // 3. Search for relevant ads
    const relevantAds = await this.findRelevantAds(query, context, baseResponse);
    
    // 4. Integrate ads naturally into response
    const finalResponse = await this.integrateAdsIntelligently(
      baseResponse, 
      relevantAds, 
      context
    );
    
    // 5. Track metrics and update conversation history
    await this.trackMetrics(query, finalResponse, relevantAds, userId);
    
    return finalResponse;
  }

  private async analyzeContext(query: string): Promise<Context> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: \`Analyze the user query and extract:
          1. Primary intent (question, request, conversation)
          2. Topic/domain (technology, health, finance, etc.)
          3. Urgency level (low, medium, high)
          4. Commercial intent (none, research, purchase)
          5. Appropriate ad categories
          
          Return as JSON.\`
        },
        { role: "user", content: query }
      ]
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  private async generateBaseResponse(query: string, context: Context): Promise<string> {
    const messages = [
      {
        role: "system",
        content: \`You are a helpful AI assistant. Provide accurate, helpful responses.
        Context: \${JSON.stringify(context)}
        Conversation history: \${JSON.stringify(this.conversationHistory.slice(-5))}\`
      },
      { role: "user", content: query }
    ];

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages
    });

    return completion.choices[0].message.content || '';
  }

  private async findRelevantAds(
    query: string, 
    context: Context, 
    response: string
  ): Promise<Ad[]> {
    // Only search for ads if context suggests commercial relevance
    if (context.commercialIntent === 'none' || context.urgency === 'high') {
      return [];
    }

    try {
      const ads = await this.monetization.searchAds({
        query,
        context: {
          ...context,
          responseLength: response.length,
          conversationTurn: this.conversationHistory.length
        },
        maxAds: 2,
        categories: this.getAppropriateCategoriesForContext(context)
      });

      return ads.filter(ad => this.isAdAppropriate(ad, context, response));
    } catch (error) {
      console.error('Failed to fetch ads:', error);
      return [];
    }
  }

  private async integrateAdsIntelligently(
    response: string, 
    ads: Ad[], 
    context: Context
  ): Promise<AgentResponse> {
    if (ads.length === 0) {
      return { content: response, ads: [], revenue: 0 };
    }

    // Use AI to naturally integrate ads
    const integrationPrompt = \`
    Original response: "\${response}"
    
    Available ads: \${JSON.stringify(ads.map(ad => ({
      id: ad.id,
      content: ad.content,
      category: ad.category,
      relevanceScore: ad.relevanceScore
    })))}
    
    Context: \${JSON.stringify(context)}
    
    Naturally integrate the most relevant ads into the response. Rules:
    1. Only include ads that genuinely add value
    2. Integrate naturally, don't just append
    3. Use phrases like "You might also find...", "Related to this..."
    4. Maximum 2 ads per response
    5. Maintain the helpful, conversational tone
    
    Return the integrated response as plain text.
    \`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: integrationPrompt }]
    });

    const integratedContent = completion.choices[0].message.content || response;

    return {
      content: integratedContent,
      ads: ads.slice(0, 2),
      revenue: ads.reduce((sum, ad) => sum + (ad.bidAmount || 0), 0)
    };
  }

  private async trackMetrics(
    query: string, 
    response: AgentResponse, 
    ads: Ad[], 
    userId?: string
  ) {
    // Update conversation history
    this.conversationHistory.push(
      { role: 'user', content: query },
      { role: 'assistant', content: response.content }
    );

    // Track ad impressions
    for (const ad of ads) {
      await this.monetization.trackEngagement({
        adId: ad.id,
        userId,
        eventType: 'impression',
        timestamp: new Date().toISOString(),
        context: { query, responseLength: response.content.length }
      });
    }
  }

  private getAppropriateCategoriesForContext(context: Context): string[] {
    // Logic to determine appropriate ad categories based on context
    const baseCategories = ['PG', 'Family-Friendly'];
    
    if (context.topic === 'technology') {
      baseCategories.push('Informative');
    }
    
    if (context.commercialIntent !== 'none') {
      baseCategories.push('Promotional');
    }

    return baseCategories;
  }

  private isAdAppropriate(ad: Ad, context: Context, response: string): boolean {
    // Implement your ad filtering logic
    return ad.relevanceScore > 0.7 && 
           ad.category !== 'Adult' && 
           !this.containsCompetitorMentions(ad.content, response);
  }

  private containsCompetitorMentions(adContent: string, response: string): boolean {
    // Implement competitor detection logic
    return false;
  }
}`;

  const agentUsageCode = `// Using the Complete Monetized Agent
const agent = new MonetizedAIAgent({
  openaiKey: process.env.OPENAI_API_KEY,
  monetizationKey: process.env.MONETIZATION_API_KEY,
  agentId: 'your-agent-id',
  platformUrl: 'https://your-platform.com/api'
});

// Handle user interactions
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;
  
  try {
    const response = await agent.processUserQuery(message, userId);
    
    res.json({
      message: response.content,
      ads: response.ads,
      metadata: {
        revenue: response.revenue,
        adsShown: response.ads.length
      }
    });
  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Complete AI Agent Integration
          </CardTitle>
          <CardDescription>
            Build a fully monetized AI agent from scratch with intelligent ad integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🤖 Complete Agent Architecture</h4>
            <p className="text-sm text-blue-800">
              This implementation shows how to build a complete AI agent that intelligently 
              integrates monetization without compromising user experience. The agent analyzes 
              context, generates responses, and naturally incorporates relevant advertisements.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Complete Agent Implementation</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">
                <code>{agentArchitectureCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(agentArchitectureCode, 'full-agent')}
              >
                {copiedCode === 'full-agent' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Usage Example</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{agentUsageCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(agentUsageCode, 'agent-usage')}
              >
                {copiedCode === 'agent-usage' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">🎯 Smart Integration</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Context-aware ad selection</li>
                <li>• Natural language integration</li>
                <li>• User intent analysis</li>
                <li>• Revenue optimization</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🛡️ User Experience</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Non-intrusive ads</li>
                <li>• Relevance filtering</li>
                <li>• Conversation flow</li>
                <li>• Quality control</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">📊 Analytics</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Real-time metrics</li>
                <li>• Revenue tracking</li>
                <li>• Performance insights</li>
                <li>• A/B testing ready</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WebWidgetSection({ copyToClipboard, copiedCode }: { copyToClipboard: (code: string, id: string) => void, copiedCode: string | null }) {
  const widgetScriptCode = `<!-- AI Monetization Widget -->
<script src="https://your-platform.com/widget/ai-monetization.js"></script>
<script>
  AIMonetization.init({
    apiKey: 'your-api-key',
    agentId: 'your-agent-id',
    container: '#ai-chat-container',
    theme: 'light', // 'light' | 'dark' | 'auto'
    adPlacement: 'contextual', // 'contextual' | 'sidebar' | 'bottom'
    maxAdsPerResponse: 2,
    categories: ['PG', 'Family-Friendly'],
    onAdClick: (adId) => {
      console.log('Ad clicked:', adId);
      // Your tracking logic
    }
  });
</script>`;

  const iframeCode = `<!-- IFrame Integration -->
<iframe 
  src="https://your-platform.com/widget/chat?apiKey=your-api-key&agentId=your-agent-id"
  width="100%" 
  height="600px" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
  allow="clipboard-write"
>
</iframe>

<script>
  // Listen for messages from iframe
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://your-platform.com') return;
    
    if (event.data.type === 'AD_CLICK') {
      // Track ad engagement
      console.log('Ad clicked in iframe:', event.data.adId);
    }
    
    if (event.data.type === 'RESIZE') {
      // Adjust iframe height
      const iframe = document.querySelector('iframe');
      iframe.style.height = event.data.height + 'px';
    }
  });
</script>`;

  const customWidgetCode = `// Custom Widget Implementation
class AIMonetizationWidget {
  constructor(config) {
    this.config = config;
    this.container = document.querySelector(config.container);
    this.init();
  }

  init() {
    this.createUI();
    this.setupEventListeners();
    this.loadInitialData();
  }

  createUI() {
    this.container.innerHTML = \`
      <div class="ai-monetization-widget">
        <div class="chat-header">
          <h3>AI Assistant</h3>
          <div class="status-indicator"></div>
        </div>
        <div class="chat-messages" id="messages"></div>
        <div class="chat-input-container">
          <input type="text" id="user-input" placeholder="Ask me anything..." />
          <button id="send-btn">Send</button>
        </div>
        <div class="ad-container" id="ad-container"></div>
      </div>
    \`;

    this.applyStyles();
  }

  setupEventListeners() {
    const input = this.container.querySelector('#user-input');
    const sendBtn = this.container.querySelector('#send-btn');

    const sendMessage = () => {
      const message = input.value.trim();
      if (message) {
        this.processMessage(message);
        input.value = '';
      }
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  async processMessage(message) {
    this.addMessage('user', message);
    this.showTypingIndicator();

    try {
      const response = await fetch(\`\${this.config.apiUrl}/chat\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.config.apiKey}\`
        },
        body: JSON.stringify({
          message,
          agentId: this.config.agentId,
          context: this.getContext()
        })
      });

      const data = await response.json();
      
      this.hideTypingIndicator();
      this.addMessage('assistant', data.message);
      
      if (data.ads && data.ads.length > 0) {
        this.displayAds(data.ads);
      }

    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      console.error('Chat error:', error);
    }
  }

  addMessage(role, content) {
    const messagesContainer = this.container.querySelector('#messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = \`message \${role}-message\`;
    messageDiv.innerHTML = \`
      <div class="message-content">\${content}</div>
      <div class="message-time">\${new Date().toLocaleTimeString()}</div>
    \`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  displayAds(ads) {
    const adContainer = this.container.querySelector('#ad-container');
    
    if (this.config.adPlacement === 'contextual') {
      // Insert ads contextually within the conversation
      ads.forEach((ad, index) => {
        setTimeout(() => {
          this.addAdMessage(ad);
        }, (index + 1) * 1000);
      });
    } else {
      // Display ads in sidebar or bottom
      adContainer.innerHTML = ads.map(ad => \`
        <div class="ad-item" data-ad-id="\${ad.id}">
          <div class="ad-content">\${ad.content}</div>
          <a href="\${ad.trackedLink}" target="_blank" class="ad-link">
            Learn More
          </a>
        </div>
      \`).join('');

      // Track ad impressions
      ads.forEach(ad => this.trackAdEvent(ad.id, 'impression'));
    }
  }

  addAdMessage(ad) {
    const messagesContainer = this.container.querySelector('#messages');
    const adDiv = document.createElement('div');
    adDiv.className = 'message ad-message';
    adDiv.innerHTML = \`
      <div class="ad-indicator">💡 Sponsored</div>
      <div class="message-content">
        \${ad.content}
        <a href="\${ad.trackedLink}" target="_blank" class="ad-cta" data-ad-id="\${ad.id}">
          Learn More →
        </a>
      </div>
    \`;
    
    // Add click tracking
    adDiv.querySelector('.ad-cta').addEventListener('click', () => {
      this.trackAdEvent(ad.id, 'click');
      if (this.config.onAdClick) {
        this.config.onAdClick(ad.id);
      }
    });

    messagesContainer.appendChild(adDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Track impression
    this.trackAdEvent(ad.id, 'impression');
  }

  async trackAdEvent(adId, eventType) {
    try {
      await fetch(\`\${this.config.apiUrl}/track\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.config.apiKey}\`
        },
        body: JSON.stringify({
          adId,
          eventType,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  }

  applyStyles() {
    const styles = \`
      .ai-monetization-widget {
        max-width: 400px;
        height: 600px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .chat-header {
        padding: 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .message {
        max-width: 80%;
        padding: 12px;
        border-radius: 12px;
        word-wrap: break-word;
      }
      
      .user-message {
        align-self: flex-end;
        background: #3b82f6;
        color: white;
      }
      
      .assistant-message {
        align-self: flex-start;
        background: #f1f5f9;
        color: #334155;
      }
      
      .ad-message {
        align-self: flex-start;
        background: #fef3c7;
        border: 1px solid #f59e0b;
        color: #92400e;
      }
      
      .ad-indicator {
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
        opacity: 0.8;
      }
      
      .ad-cta {
        display: inline-block;
        margin-top: 8px;
        color: #3b82f6;
        text-decoration: none;
        font-weight: 500;
      }
      
      .chat-input-container {
        padding: 16px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 8px;
      }
      
      #user-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        outline: none;
      }
      
      #send-btn {
        padding: 8px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
    \`;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  getContext() {
    return {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
  }

  showTypingIndicator() {
    this.addMessage('assistant', '<div class="typing-indicator">...</div>');
  }

  hideTypingIndicator() {
    const messages = this.container.querySelectorAll('.assistant-message');
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.querySelector('.typing-indicator')) {
      lastMessage.remove();
    }
  }
}

// Initialize widget
window.AIMonetization = {
  init: (config) => new AIMonetizationWidget(config)
};`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Web Widget / IFrame Integration
          </CardTitle>
          <CardDescription>
            Embed AI monetization directly in web applications with minimal setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="script">Script Tag</TabsTrigger>
              <TabsTrigger value="iframe">IFrame</TabsTrigger>
              <TabsTrigger value="custom">Custom Widget</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Simple Script Integration</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Add our script tag to your website for instant AI monetization widget.
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    <code>{widgetScriptCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(widgetScriptCode, 'widget-script')}
                  >
                    {copiedCode === 'widget-script' ? '✓' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="iframe" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">IFrame Embedding</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Embed our chat interface as an iframe for complete isolation and security.
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    <code>{iframeCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(iframeCode, 'iframe-code')}
                  >
                    {copiedCode === 'iframe-code' ? '✓' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Custom Widget Implementation</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Build your own widget with full customization and control.
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">
                    <code>{customWidgetCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(customWidgetCode, 'custom-widget')}
                  >
                    {copiedCode === 'custom-widget' ? '✓' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Widget Benefits</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• No backend development required</li>
                <li>• Responsive design out of the box</li>
                <li>• Automatic ad integration</li>
                <li>• Real-time revenue tracking</li>
                <li>• Customizable themes and styling</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🎨 Customization Options</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Theme colors and branding</li>
                <li>• Ad placement strategies</li>
                <li>• Custom CSS styling</li>
                <li>• Event callbacks and hooks</li>
                <li>• Mobile-responsive layouts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PluginSection({ copyToClipboard, copiedCode }: { copyToClipboard: (code: string, id: string) => void, copiedCode: string | null }) {
  const wordpressPluginCode = `<?php
/**
 * Plugin Name: AI Monetization
 * Description: Integrate AI-powered contextual advertising into your WordPress site
 * Version: 1.0.0
 * Author: AI Monetization Network
 */

class AIMonetizationPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('ai_monetization', array($this, 'render_widget'));
        add_action('wp_ajax_ai_monetization_chat', array($this, 'handle_chat'));
        add_action('wp_ajax_nopriv_ai_monetization_chat', array($this, 'handle_chat'));
    }

    public function init() {
        // Plugin initialization
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            'ai-monetization-widget',
            plugin_dir_url(__FILE__) . 'assets/widget.js',
            array('jquery'),
            '1.0.0',
            true
        );
        
        wp_localize_script('ai-monetization-widget', 'aiMonetization', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ai_monetization_nonce'),
            'apiKey' => get_option('ai_monetization_api_key'),
            'agentId' => get_option('ai_monetization_agent_id')
        ));
    }

    public function render_widget($atts) {
        $atts = shortcode_atts(array(
            'theme' => 'light',
            'height' => '400px',
            'max_ads' => '2'
        ), $atts);

        ob_start();
        ?>
        <div id="ai-monetization-widget" 
             data-theme="<?php echo esc_attr($atts['theme']); ?>"
             data-height="<?php echo esc_attr($atts['height']); ?>"
             data-max-ads="<?php echo esc_attr($atts['max_ads']); ?>">
            <div class="ai-chat-container">
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Ask me anything..." />
                    <button type="submit">Send</button>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function handle_chat() {
        check_ajax_referer('ai_monetization_nonce', 'nonce');

        $message = sanitize_text_field($_POST['message']);
        $api_key = get_option('ai_monetization_api_key');
        $agent_id = get_option('ai_monetization_agent_id');

        if (empty($api_key) || empty($agent_id)) {
            wp_die('Plugin not configured properly');
        }

        // Make API call to AI monetization platform
        $response = wp_remote_post('https://your-platform.com/api/chat', array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key
            ),
            'body' => json_encode(array(
                'message' => $message,
                'agentId' => $agent_id,
                'context' => array(
                    'url' => get_permalink(),
                    'title' => get_the_title(),
                    'categories' => wp_get_post_categories(get_the_ID())
                )
            ))
        ));

        if (is_wp_error($response)) {
            wp_die('Failed to connect to AI service');
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        wp_send_json_success($data);
    }
}

new AIMonetizationPlugin();`;

  const shopifyAppCode = `// Shopify App Integration
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "install_widget") {
    // Install AI monetization widget in theme
    const theme = await admin.rest.resources.Theme.find({
      session: admin.session,
      role: "main"
    });

    // Add widget script to theme.liquid
    const asset = new admin.rest.resources.Asset({
      session: admin.session,
      theme_id: theme.id
    });

    asset.key = "layout/theme.liquid";
    
    // Get current theme content
    const currentAsset = await admin.rest.resources.Asset.find({
      session: admin.session,
      theme_id: theme.id,
      asset: { key: "layout/theme.liquid" }
    });

    // Inject AI monetization script
    const widgetScript = \`
      <script src="https://your-platform.com/widget/shopify.js"></script>
      <script>
        AIMonetization.init({
          apiKey: '\${process.env.AI_MONETIZATION_API_KEY}',
          agentId: '\${process.env.AI_MONETIZATION_AGENT_ID}',
          shopDomain: '\${admin.session.shop}',
          integration: 'shopify'
        });
      </script>
    \`;

    asset.value = currentAsset.value.replace(
      '</head>',
      widgetScript + '</head>'
    );

    await asset.save();

    return json({ success: true, message: "Widget installed successfully" });
  }

  return json({ error: "Invalid action" });
};

// Shopify-specific widget functionality
class ShopifyAIWidget {
  constructor(config) {
    this.config = config;
    this.shopifyData = this.getShopifyContext();
    this.init();
  }

  getShopifyContext() {
    return {
      shop: Shopify.shop,
      customer: Shopify.customer,
      cart: Shopify.cart,
      product: window.product || null,
      collection: window.collection || null
    };
  }

  async processMessage(message) {
    // Enhanced context for Shopify
    const context = {
      ...this.shopifyData,
      pageType: this.getPageType(),
      currentUrl: window.location.href,
      userIntent: this.analyzeShopifyIntent(message)
    };

    const response = await fetch(\`\${this.config.apiUrl}/chat\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.config.apiKey}\`
      },
      body: JSON.stringify({
        message,
        agentId: this.config.agentId,
        context,
        integration: 'shopify'
      })
    });

    const data = await response.json();

    // Shopify-specific ad integration
    if (data.ads) {
      data.ads = this.enhanceAdsWithShopifyData(data.ads);
    }

    return data;
  }

  getPageType() {
    if (window.location.pathname.includes('/products/')) return 'product';
    if (window.location.pathname.includes('/collections/')) return 'collection';
    if (window.location.pathname.includes('/cart')) return 'cart';
    if (window.location.pathname.includes('/checkout')) return 'checkout';
    return 'other';
  }

  analyzeShopifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      return 'purchase_intent';
    }
    if (lowerMessage.includes('compare') || lowerMessage.includes('vs')) {
      return 'comparison';
    }
    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      return 'sizing_help';
    }
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return 'shipping_inquiry';
    }
    
    return 'general_inquiry';
  }

  enhanceAdsWithShopifyData(ads) {
    return ads.map(ad => ({
      ...ad,
      shopifyIntegration: {
        addToCart: ad.productId ? \`/cart/add?id=\${ad.productId}\` : null,
        productUrl: ad.productHandle ? \`/products/\${ad.productHandle}\` : null,
        collectionUrl: ad.collectionHandle ? \`/collections/\${ad.collectionHandle}\` : null
      }
    }));
  }
}`;

  const chromeExtensionCode = `// Chrome Extension Manifest (manifest.json)
{
  "manifest_version": 3,
  "name": "AI Monetization Assistant",
  "version": "1.0.0",
  "description": "Enhance web browsing with AI-powered contextual assistance and monetization",
  "permissions": [
    "activeTab",
    "storage",
    "scripting"
  ],
  "host_permissions": [
    "https://*/*"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["widget.css"]
    }
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "AI Assistant"
  }
}

// Content Script (content.js)
class AIMonetizationExtension {
  constructor() {
    this.config = null;
    this.widget = null;
    this.init();
  }

  async init() {
    // Get configuration from storage
    this.config = await chrome.storage.sync.get([
      'apiKey', 'agentId', 'enabled'
    ]);

    if (this.config.enabled && this.config.apiKey) {
      this.injectWidget();
      this.setupPageAnalysis();
    }
  }

  injectWidget() {
    // Create floating widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'ai-monetization-extension-widget';
    widgetContainer.innerHTML = \`
      <div class="ai-widget-toggle">
        <button id="ai-widget-btn">🤖</button>
      </div>
      <div class="ai-widget-panel" style="display: none;">
        <div class="ai-widget-header">
          <h3>AI Assistant</h3>
          <button id="ai-widget-close">×</button>
        </div>
        <div class="ai-widget-content">
          <div class="chat-messages"></div>
          <div class="chat-input">
            <input type="text" placeholder="Ask about this page..." />
            <button type="submit">Send</button>
          </div>
        </div>
      </div>
    \`;

    document.body.appendChild(widgetContainer);
    this.setupWidgetEvents();
  }

  setupWidgetEvents() {
    const toggleBtn = document.getElementById('ai-widget-btn');
    const closeBtn = document.getElementById('ai-widget-close');
    const panel = document.querySelector('.ai-widget-panel');
    const input = document.querySelector('.ai-widget-panel input');
    const sendBtn = document.querySelector('.ai-widget-panel button[type="submit"]');

    toggleBtn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') {
        this.analyzeCurrentPage();
      }
    });

    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
    });

    const sendMessage = () => {
      const message = input.value.trim();
      if (message) {
        this.processMessage(message);
        input.value = '';
      }
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  async analyzeCurrentPage() {
    const pageContext = {
      url: window.location.href,
      title: document.title,
      content: this.extractPageContent(),
      meta: this.extractMetaTags(),
      images: this.extractImages()
    };

    // Send page context to AI for analysis
    try {
      const response = await fetch('https://your-platform.com/api/analyze-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.config.apiKey}\`
        },
        body: JSON.stringify({
          agentId: this.config.agentId,
          pageContext,
          action: 'page_analysis'
        })
      });

      const analysis = await response.json();
      
      if (analysis.suggestions) {
        this.displayPageSuggestions(analysis.suggestions);
      }

    } catch (error) {
      console.error('Page analysis failed:', error);
    }
  }

  extractPageContent() {
    // Extract meaningful text content from page
    const content = document.body.innerText;
    return content.substring(0, 2000); // Limit content size
  }

  extractMetaTags() {
    const metaTags = {};
    document.querySelectorAll('meta').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');
      if (name && content) {
        metaTags[name] = content;
      }
    });
    return metaTags;
  }

  extractImages() {
    const images = [];
    document.querySelectorAll('img').forEach(img => {
      if (img.src && img.alt) {
        images.push({
          src: img.src,
          alt: img.alt
        });
      }
    });
    return images.slice(0, 5); // Limit to first 5 images
  }

  async processMessage(message) {
    const pageContext = {
      url: window.location.href,
      title: document.title,
      selectedText: window.getSelection().toString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    try {
      const response = await fetch('https://your-platform.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.config.apiKey}\`
        },
        body: JSON.stringify({
          message,
          agentId: this.config.agentId,
          context: pageContext,
          integration: 'chrome_extension'
        })
      });

      const data = await response.json();
      
      this.displayMessage('user', message);
      this.displayMessage('assistant', data.message);
      
      if (data.ads && data.ads.length > 0) {
        this.displayAds(data.ads);
      }

    } catch (error) {
      this.displayMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      console.error('Chat error:', error);
    }
  }

  displayMessage(role, content) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = \`message \${role}-message\`;
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  displayAds(ads) {
    ads.forEach(ad => {
      const adDiv = document.createElement('div');
      adDiv.className = 'message ad-message';
      adDiv.innerHTML = \`
        <div class="ad-indicator">💡 Sponsored</div>
        <div class="ad-content">\${ad.content}</div>
        <a href="\${ad.trackedLink}" target="_blank" class="ad-link">Learn More</a>
      \`;
      
      document.querySelector('.chat-messages').appendChild(adDiv);
      
      // Track ad impression
      this.trackAdEvent(ad.id, 'impression');
    });
  }

  async trackAdEvent(adId, eventType) {
    try {
      await fetch('https://your-platform.com/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.config.apiKey}\`
        },
        body: JSON.stringify({
          adId,
          eventType,
          timestamp: new Date().toISOString(),
          context: {
            url: window.location.href,
            userAgent: navigator.userAgent
          }
        })
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  }
}

// Initialize extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AIMonetizationExtension();
  });
} else {
  new AIMonetizationExtension();
}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Plugin Integration
          </CardTitle>
          <CardDescription>
            Platform-specific plugins and extensions for seamless integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="wordpress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
              <TabsTrigger value="chrome">Chrome Extension</TabsTrigger>
            </TabsList>

            <TabsContent value="wordpress" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">WordPress Plugin</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Complete WordPress plugin for easy integration with shortcodes and widgets.
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">
                    <code>{wordpressPluginCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(wordpressPluginCode, 'wordpress')}
                  >
                    {copiedCode === 'wordpress' ? '✓' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Usage</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Add the shortcode anywhere in your posts or pages:
                  </p>
                  <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">
                    [ai_monetization theme=&quot;light&quot; height=&quot;400px&quot; max_ads=&quot;2&quot;]
                  </code>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shopify" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Shopify App</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Shopify app integration with e-commerce specific features and context awareness.
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">
                    <code>{shopifyAppCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(shopifyAppCode, 'shopify')}
                  >
                    {copiedCode === 'shopify' ? '✓' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">🛍️ E-commerce Features</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Product recommendation integration</li>
                    <li>• Cart abandonment recovery</li>
                    <li>• Customer support automation</li>
                    <li>• Purchase intent analysis</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chrome" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Chrome Extension</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Browser extension that adds AI assistance to any website with contextual advertising.
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">
                    <code>{chromeExtensionCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(chromeExtensionCode, 'chrome')}
                  >
                    {copiedCode === 'chrome' ? '✓' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">🌐 Browser Features</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Page content analysis</li>
                    <li>• Contextual assistance</li>
                    <li>• Cross-site monetization</li>
                    <li>• Privacy-focused design</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">📦 Plugin Distribution</h4>
            <p className="text-sm text-yellow-800 mb-3">
              We provide ready-to-use plugins for popular platforms. Contact us for:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Custom plugin development</li>
                <li>• White-label solutions</li>
                <li>• Enterprise integrations</li>
              </ul>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Plugin store submissions</li>
                <li>• Technical support</li>
                <li>• Revenue sharing programs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OpenAIAPISection({ copyToClipboard, copiedCode }: { copyToClipboard: (code: string, id: string) => void, copiedCode: string | null }) {
  const openaiCompatibleCode = `// Using with OpenAI SDK
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:3000/api/v1',
  apiKey: 'dummy-key', // Not used but required by SDK
});

const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'user', content: 'What do you know about AI and machine learning?' }
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'search_knowledge_base',
        description: 'Search the vector database for relevant information',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            topK: { type: 'integer', description: 'Number of results', default: 5 }
          },
          required: ['query']
        }
      }
    }
  ],
  tool_choice: 'auto'
});

console.log(response.choices[0].message.content);`;

  const curlExampleCode = `# Test with cURL
curl -X POST http://localhost:3000/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Search for information about technology"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "search_knowledge_base",
          "description": "Search vector database",
          "parameters": {
            "type": "object",
            "properties": {
              "query": {"type": "string"},
              "topK": {"type": "integer", "default": 5}
            },
            "required": ["query"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            OpenAI-Compatible Chat Completions API
          </CardTitle>
          <CardDescription>
            Real OpenAI API integration with Pinecone vector search and function calling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">🚀 Real OpenAI Integration</h4>
            <p className="text-sm text-green-800">
              This API uses the actual OpenAI GPT-3.5-turbo model with function calling to intelligently 
              search your Pinecone vector database when needed. It&apos;s fully compatible with the OpenAI SDK 
              and provides the same request/response format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">API Endpoint</h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                POST /api/v1/chat/completions
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Demo Interface</h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                GET /demochat
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Usage with OpenAI SDK</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{openaiCompatibleCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(openaiCompatibleCode, 'openai-sdk')}
              >
                {copiedCode === 'openai-sdk' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">cURL Example</h3>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{curlExampleCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(curlExampleCode, 'curl-example')}
              >
                {copiedCode === 'curl-example' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🔧 How It Works</h4>
            <ol className="text-sm text-blue-800 space-y-2">
              <li><strong>1. User Query:</strong> Send a message to the API endpoint</li>
              <li><strong>2. OpenAI Processing:</strong> Real GPT-3.5-turbo analyzes the query</li>
              <li><strong>3. Function Calling:</strong> AI decides if knowledge base search is needed</li>
              <li><strong>4. Vector Search:</strong> If needed, searches Pinecone for relevant information</li>
              <li><strong>5. Contextual Response:</strong> AI generates response using found information</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">🚀 Quick Start</h4>
            <ol className="text-sm text-yellow-800 space-y-1">
              <li>1. Set OPENAI_API_KEY and PINECONE_API_KEY environment variables</li>
              <li>2. Start server: <code>npm run dev</code></li>
              <li>3. Test API: <code>http://localhost:3000/api/v1/chat/completions</code></li>
              <li>4. Try demo: <code>http://localhost:3000/demochat</code></li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

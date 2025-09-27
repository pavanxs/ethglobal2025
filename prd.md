# Project Plan: Decentralized AI Agent Monetization Network (MVP)

## 1. Project Overview & Core Goal

The fundamental purpose of this decentralized network is to enable content creators and platforms with existing AI agents to seamlessly integrate a monetization layer. This allows them to earn revenue by offering contextual advertising or sponsored content that AI agents can intelligently incorporate into their responses. The platform provides a clear value proposition for both hosters (AI Agent Owners) and advertisers, all built on the Hedera blockchain.

## 2. Key Features (Minimum Viable Product - MVP)

To achieve the core goal with a focus on rapid development for a hackathon, the MVP will include the following essential functionalities:

1.  **Agent Onboarding & Integration:** A streamlined process for AI agent owners to register their agents and integrate with your platform, including generating an API key.
2.  **Monetization Configuration:** Tools for AI agent owners to define what types of contextual content (ad categories) they are open to integrating into their agents' responses.
3.  **Contextual Bidding & Ad Placement:** A system where advertisers can submit ads, and these ads are then presented to AI agents for potential integration based on context and agent preferences.
4.  **AI Agent Decision Engine (Integration Logic):** The core logic within the AI agent that evaluates incoming ad contexts and decides whether to integrate them into its responses based on predefined criteria and the agent's own context. This will involve semantic search via Pinecone.
5.  **Ad Verification (Link Openings):** A mechanism to track and verify ad engagement based on users opening provided links. This is the primary monetization metric.
6.  **Hedera Integration:** Secure and efficient integration with the Hedera blockchain for transactions and smart contract execution (e.g., ad payouts, validator rewards).
7.  **Validator Network for Ad Grading:** A system for independent validators to review and grade ads using predefined categorical ratings to ensure content quality and appropriateness.
    *   **Ad Grading Categories:** "PG," "Family-Friendly," "Adult," and "Unsuitable."

## 3. User Personas/Types

For the MVP, we will focus on three primary user types:

1.  **AI Agent Owners (Hosters):**
    *   **Description:** Individuals or companies who own and operate AI agents and want to monetize their usage by integrating contextual ads.
    *   **Primary Needs:** Easy integration of the monetization layer, control over the types of ads their agents show, and tracking of their earnings.
2.  **Advertisers:**
    *   **Description:** Individuals or companies who want to promote their products or services through contextual ads delivered by AI agents.
    *   **Primary Needs:** Efficiently create and manage ad campaigns, target relevant audiences, and track ad performance and conversions (link openings).
3.  **Validators:**
    *   **Description:** Community members or independent entities who review and grade ads to maintain content quality and appropriateness on the platform.
    *   **Primary Needs:** Clear guidelines for ad grading, an intuitive interface for reviewing ads, and a fair compensation mechanism for their efforts.

*   **Note for MVP:** For hackathon judging, explicit login/registration will be replaced with hardcoded account switching in the header.

## 4. User Flows (MVP - with Hardcoded Account Switching)

### 4.1. AI Agent Owner: Onboarding & Monetization Setup

1.  **Account Selection (for Judges):**
    *   **Action:** Judge selects a hardcoded "AI Agent Owner" account from a dropdown in the header.
    *   **Feedback:** UI updates to reflect the selected AI Agent Owner's context.
    *   **Next:** Redirect to agent dashboard or onboarding flow.
2.  **Agent Integration Selection:**
    *   **Action:** AI Agent Owner chooses to integrate an existing AI agent or a new one.
    *   **Feedback:** Options presented (e.g., "Integrate Existing Agent," "Register New Agent").
    *   **Next:** Proceed to integration details.
3.  **Integration Details & API Key Generation:**
    *   **Action:** AI Agent Owner provides agent details (e.g., name, description, API endpoint) and generates a unique API key for integration with the platform.
    *   **Feedback:** API key displayed with clear instructions for implementation.
    *   **Next:** Proceed to monetization configuration.
4.  **Monetization Configuration (Content Categories):**
    *   **Action:** AI Agent Owner selects the ad content categories they are open to (e.g., "PG," "Family-Friendly," "Informative").
    *   **Feedback:** Selected categories are saved and displayed.
    *   **Next:** Confirmation of setup complete and redirection to dashboard.

### 4.2. Advertiser: Creating and Managing Ad Campaigns

1.  **Account Selection (for Judges):**
    *   **Action:** Judge selects a hardcoded "Advertiser" account from a dropdown in the header.
    *   **Feedback:** UI updates to reflect the selected Advertiser's context.
    *   **Next:** Redirect to advertiser dashboard or campaign creation flow.
2.  **Campaign Creation (Basic Info):**
    *   **Action:** Advertiser initiates a new campaign, providing basic details like campaign name, budget, and desired duration.
    *   **Feedback:** Form validation, temporary campaign ID generated.
    *   **Next:** Proceed to ad content and link.
3.  **Ad Content & Link Input:**
    *   **Action:** Advertiser inputs the ad copy/creative, the link to be tracked for verification, and selects the ad content category (e.g., "PG," "Family-Friendly").
    *   **Feedback:** Preview of the ad, validation of link format.
    *   **Next:** Proceed to bidding and targeting options.
4.  **Targeting & Bidding Configuration:**
    *   **Action:** Advertiser specifies targeting parameters (e.g., keywords, topics) and sets their bid strategy (e.g., per-link-open bid, total campaign budget).
    *   **Feedback:** Summary of targeting and bidding settings.
    *   **Next:** Campaign review and submission.
5.  **Campaign Review & Submission:**
    *   **Action:** Advertiser reviews all campaign details and confirms submission.
    *   **Feedback:** Confirmation message, campaign status (e.g., "Pending Review").
    *   **Next:** Redirect to campaign dashboard.

### 4.3. Validator: Grading Ads

1.  **Account Selection (for Judges):**
    *   **Action:** Judge selects a hardcoded "Validator" account from a dropdown in the header.
    *   **Feedback:** UI updates to reflect the selected Validator's context.
    *   **Next:** Redirect to validator dashboard or ad review queue.
2.  **Ad Review Queue Access:**
    *   **Action:** Validator accesses a list of un-graded ads awaiting review.
    *   **Feedback:** Display of ad queue, showing basic ad information (e.g., advertiser, date submitted).
    *   **Next:** Validator selects an ad to review.
3.  **Ad Content Review & Grading:**
    *   **Action:** Validator views the full ad content (copy, creative, linked URL if available) and assigns a categorical grade (e.g., "PG," "Family-Friendly," "Adult," "Unsuitable").
    *   **Feedback:** Visual confirmation of selected grade.
    *   **Next:** Submission of grade.
4.  **Grade Submission & Next Ad:**
    *   **Action:** Validator submits the assigned grade.
    *   **Feedback:** Confirmation of submission, ad removed from their active queue.
    *   **Next:** Automatically presents the next un-graded ad or returns to the ad review queue.

## 5. Page/Screen Planning (MVP Focus)

### 5.1. Global Navigation & Layout

*   **Persistent Header:**
    *   Application logo/name.
    *   **Account Switching Dropdown:** Allows judges to switch between "AI Agent Owner," "Advertiser," and "Validator" personas.
    *   Minimal global navigation links (e.g., "Dashboard" for the active persona).
*   **Main Content Area:** Where all specific page content will be displayed.

### 5.2. Initial Landing Page (Homepage)

*   **Purpose:** Introduce the platform and its value proposition.
*   **Content:** Compelling headline, brief platform description, call-to-action buttons ("Become an AI Agent Hoster," "Start Advertising").
*   **Layout:** Simple, clean, visually engaging.

### 5.3. AI Agent Owner Dashboard

*   **Purpose:** Overview of integrated agents, monetization settings, and earnings.
*   **Content:** Dashboard header ("Welcome, [Agent Owner Name/ID]"), list of registered AI agents (name, status), summary of earnings/impressions, "Register New Agent" and "Configure Monetization" CTAs.
*   **Interactions:** "View Details" buttons for agents, CTA buttons.

### 5.4. Register New Agent Page

*   **Purpose:** Provide details for a new AI agent and generate an API key.
*   **Content:** Form fields for: Agent Name (essential), Agent Description (optional), Agent API Endpoint (essential). "Generate API Key" button, display area for generated key with "Copy to Clipboard" button, instructions.
*   **Interactions:** Form input, API key generation.

### 5.5. Monetization Configuration Page

*   **Purpose:** Select ad content categories an AI agent is willing to integrate.
*   **Content:** "Configure Monetization Preferences" heading, list of content categories as checkboxes/toggles ("PG," "Family-Friendly," "Adult," "Informative," "Promotional," "Unsuitable"), brief explanation of each category. "Save Preferences" button.
*   **Interactions:** Checkbox/toggle selection, save action.

### 5.6. Advertiser Dashboard

*   **Purpose:** Overview of active and past campaigns, status, and performance metrics.
*   **Content:** Dashboard header ("Welcome, [Advertiser Name/ID]"), list of active campaigns (name, status, budget spent, link opens), summary of overall ad performance, "Create New Campaign" CTA.
*   **Interactions:** "View Details" buttons for campaigns, "Create New Campaign" button.

### 5.7. Create New Campaign Page

*   **Purpose:** Create a new ad campaign.
*   **Content:** Form fields for: Campaign Name (essential), Ad Content/Copy (essential), Tracked Link (essential), Ad Content Category (essential). Optional fields: Budget, Desired Duration, Targeting Keywords/Topics, Bid Amount. "Create Campaign" button.
*   **Interactions:** Form input, campaign creation.

### 5.8. Validator Dashboard

*   **Purpose:** Display a clear list of ads awaiting review.
*   **Content:** Dashboard header ("Welcome, [Validator Name/ID]"), "Ads Awaiting Review" section, list of ads needing grading (Ad ID, Advertiser, Submission Date), count of pending ads.
*   **Interactions:** "Review Ad" buttons/links.

### 5.9. Ad Review Page

*   **Purpose:** View ad content and assign a grade.
*   **Content:** Ad content display (Ad Copy/Creative, Tracked Link), grading section ("Assign a content category to this ad" prompt), radio buttons/dropdown for categories ("PG," "Family-Friendly," "Adult," "Unsuitable"). "Submit Grade" button.
*   **Interactions:** Grade selection, submission.

## 6. Interaction & UX Details (High-Level MVP Strategy)

For the MVP, we will prioritize functionality and clarity over extensive micro-interactions.

*   **Immediate Feedback:** All user actions (button clicks, form submissions) will have clear, immediate visual feedback (e.g., loading spinners, simple success/error messages, immediate UI updates).
*   **Clear Navigation:** Transitions between pages and within workflows will be straightforward and predictable.
*   **Responsiveness:** The UI will be generally responsive across basic screen sizes (desktop and mobile).
*   **Error & Empty States:** Basic error messages for form validations or failed API calls will be implemented. Simple "no data" messages will be displayed for empty lists.

## 7. API Design

### 7.1. AI Agent Owner Endpoints

1.  **Register New AI Agent:**
    *   `POST /api/agents`
    *   **Request:** `{ agentName: string (required), description: string (optional), apiEndpoint: string (required) }`
    *   **Response (201):** `{ agentId: uuid-string, apiKey: generated-api-key }`
2.  **Get AI Agent Details:**
    *   `GET /api/agents/{agentId}`
    *   **Response (200):** `{ agentId: uuid-string, agentName: string, description: string, apiEndpoint: string, monetizationCategories: string[], earningsSummary: { total: number, lastMonth: number } }`
3.  **Update Agent Monetization Categories:**
    *   `PUT /api/agents/{agentId}/monetization`
    *   **Request:** `{ monetizationCategories: string[] (required) }`
    *   **Response (200):** `{ message: string }`

### 7.2. Advertiser Endpoints

1.  **Create New Ad Campaign:**
    *   `POST /api/campaigns`
    *   **Request:** `{ campaignName: string (required), adContent: string (required), trackedLink: string (required), contentCategory: string (required), budget: number (optional), durationStart: date-time (optional), durationEnd: date-time (optional), targetingKeywords: string[] (optional), bidAmount: number (optional) }`
    *   **Response (201):** `{ campaignId: uuid-string, status: string }`
2.  **Get Advertiser Campaigns:**
    *   `GET /api/campaigns`
    *   **Response (200):** `[ { campaignId: uuid-string, campaignName: string, status: string, budget: number, spent: number, linkOpens: number, contentCategory: string, creationDate: date-time }, ... ]`
3.  **Get Specific Campaign Details:**
    *   `GET /api/campaigns/{campaignId}`
    *   **Response (200):** `{ campaignId: uuid-string, campaignName: string, adContent: string, trackedLink: string, contentCategory: string, budget: number, durationStart: date-time, durationEnd: date-time, targetingKeywords: string[], bidAmount: number, status: string, spent: number, linkOpens: number }`

### 7.3. Validator Endpoints

1.  **Get Ads Awaiting Review:**
    *   `GET /api/validator/ads-for-review`
    *   **Response (200):** `[ { adId: uuid-string, campaignId: uuid-string, adContent: string, trackedLink: string, submissionDate: date-time }, ... ]`
2.  **Submit Ad Grade:**
    *   `POST /api/validator/ads/{adId}/grade`
    *   **Request:** `{ grade: string (required), comments: string (optional) }`
    *   **Response (200):** `{ message: string, adId: uuid-string, assignedGrade: string }`

## 8. Database Structure (Drizzle ORM with Neon Postgres)

### 8.1. `Users` Table

*   **Purpose:** Store basic user information to link hardcoded judge accounts to persona-specific data.
*   **Columns:**
    *   `id`: UUID (Primary Key)
    *   `personaType`: ENUM ('AI_AGENT_OWNER', 'ADVERTISER', 'VALIDATOR')
    *   `name`: string (optional)
    *   `createdAt`: timestamp (NOT NULL)
    *   `updatedAt`: timestamp (NOT NULL)

### 8.2. `Agents` Table

*   **Purpose:** Store details about each AI agent registered.
*   **Columns:**
    *   `id`: UUID (Primary Key)
    *   `userId`: UUID (Foreign Key to `Users.id`)
    *   `name`: string (NOT NULL)
    *   `description`: string (optional)
    *   `apiEndpoint`: string (NOT NULL)
    *   `apiKey`: string (UNIQUE, NOT NULL)
    *   `createdAt`: timestamp (NOT NULL)
    *   `updatedAt`: timestamp (NOT NULL)

### 8.3. `MonetizationPreferences` Table

*   **Purpose:** Store content categories an AI agent is open to.
*   **Columns:**
    *   `id`: UUID (Primary Key)
    *   `agentId`: UUID (Foreign Key to `Agents.id`)
    *   `category`: ENUM ('PG', 'Family-Friendly', 'Adult', 'Informative', 'Promotional', 'Unsuitable') (NOT NULL)
    *   `createdAt`: timestamp (NOT NULL)
    *   `updatedAt`: timestamp (NOT NULL)
*   **Constraints:** `(agentId, category)` as a composite UNIQUE key.

### 8.4. `Campaigns` Table

*   **Purpose:** Store details about each ad campaign.
*   **Columns:**
    *   `id`: UUID (Primary Key)
    *   `userId`: UUID (Foreign Key to `Users.id`)
    *   `name`: string (NOT NULL)
    *   `adContent`: text (NOT NULL)
    *   `trackedLink`: string (NOT NULL)
    *   `advertiserSubmittedCategory`: ENUM ('PG', 'Family-Friendly', 'Adult', 'Informative', 'Promotional', 'Unsuitable') (NOT NULL)
    *   `budget`: decimal (optional, default 0.00)
    *   `spent`: decimal (default 0.00)
    *   `durationStart`: timestamp (optional)
    *   `durationEnd`: timestamp (optional)
    *   `targetingKeywords`: array of strings (optional)
    *   `bidAmount`: decimal (optional)
    *   `status`: ENUM ('Pending Review', 'Active', 'Paused', 'Rejected', 'Completed') (NOT NULL, default 'Pending Review')
    *   `createdAt`: timestamp (NOT NULL)
    *   `updatedAt`: timestamp (NOT NULL)

### 8.5. `Ads` Table (Validated Ad Instances)

*   **Purpose:** To represent individual ad instances with their *validated* content category.
*   **Columns:**
    *   `id`: UUID (Primary Key)
    *   `campaignId`: UUID (Foreign Key to `Campaigns.id`)
    *   `adContent`: text (NOT NULL)
    *   `trackedLink`: string (NOT NULL)
    *   `advertiserSubmittedCategory`: ENUM (NOT NULL)
    *   `validatorGrade`: ENUM ('PG', 'Family-Friendly', 'Adult', 'Informative', 'Promotional', 'Unsuitable') (optional, NULL until graded)
    *   `status`: ENUM ('Pending Validation', 'Approved', 'Rejected') (NOT NULL, default 'Pending Validation')
    *   `pineconeVectorId`: string (optional, UNIQUE) - ID from Pinecone after vector embedding.
    *   `createdAt`: timestamp (NOT NULL)
    *   `updatedAt`: timestamp (NOT NULL)

### 8.6. `AdLinkOpens` Table (for Verification)

*   **Purpose:** Track when a user opens a link from an ad for verification and billing.
*   **Columns:**
    *   `id`: UUID (Primary Key)
    *   `adId`: UUID (Foreign Key to `Ads.id`)
    *   `agentId`: UUID (Foreign Key to `Agents.id`, optional)
    *   `timestamp`: timestamp (NOT NULL)
    *   `ipAddress`: string (optional)
*   **Indexing:** `adId` and `timestamp`.

## 9. System Design/Architecture (MVP)

The system will be built as a single Next.js application, strategically leveraging its capabilities for both frontend and backend operations.

### 9.1. Frontend (Next.js with TypeScript)

*   **Purpose:** User interface for all personas.
*   **Components:** Next.js application, utilizing Shadcn UI components for a consistent and efficient design.
*   **Communication:** Interacts with the backend via a combination of Next.js API Routes and Server Actions. Judge account switching will primarily impact client-side persona context, but data retrieval will always go through the appropriate backend logic.

### 9.2. Backend (Next.js Application with API Routes and Server Actions)

*   **Purpose:** Handles all business logic, API endpoint management, data persistence, and external service integrations.
*   **Communication Strategy:**
    *   **Next.js API Routes:** Used for exposing REST APIs to the frontend, particularly when interacting with **external services** like **Hedera Blockchain** (via Hedera SDK) and **Pinecone** (for vector embedding and retrieval).
    *   **Next.js Server Actions:** Used for direct, **internal interactions** with **Neon Postgres** via **Drizzle ORM** for all data persistence (Agents, Campaigns, Ads, etc.). This ensures type safety and optimized database operations.
*   **Key Services/Modules:**
    *   **Authentication/Authorization:** Basic logic for hardcoded judge accounts and role-based access control.
    *   **Agent Management:** Registering, updating agents, API key generation.
    *   **Campaign Management:** Creating, listing, and updating ad campaigns.
    *   **Ad Serving Logic:** Retrieves relevant ads from Pinecone (via API Route), considering agent context and preferences, and manages simplified bidding.
    *   **Validation Logic:** Handles retrieving ads for validators and recording grades.
    *   **Ad Verification:** Records link opens and updates campaign performance.
    *   **Hedera Interaction Service:** Manages smart contract calls and HBAR transactions (via API Routes).
    *   **Pinecone Integration Service:** Handles embedding ad content and querying Pinecone for semantic matches (via API Routes).

### 9.3. Database (Neon Postgres)

*   **Purpose:** Stores all application data.
*   **Technology:** Neon (serverless Postgres).
*   **Communication:** Accessed by the Backend via Drizzle ORM.

### 9.4. Vector Database (Pinecone)

*   **Purpose:** Stores vector embeddings of ad content for efficient semantic search (RAG).
*   **Communication:** Accessed by the Backend (via API Routes) for indexing new ads and querying for relevant ads based on AI agent context.

### 9.5. Hedera Blockchain

*   **Purpose:** Provides the decentralized layer for transactions (payments, rewards) and potentially immutable records.
*   **Communication:** Interacted with by the Backend (via API Routes) using the Hedera SDK.

### 9.6. Non-Functional Considerations (MVP)

*   **Scalability:** Next.js (SSR/SSG), Neon Postgres (serverless), and Pinecone (managed service) inherently offer good scalability for an MVP.
*   **Security:** Focus on secure API key generation/storage, input validation, and secure Hedera transaction handling.
*   **Maintainability:** Modular architecture within the Next.js app, type safety with TypeScript and Drizzle ORM.
*   **Deployment Strategy:** A single Next.js application deployed to a platform like Vercel for simplicity. Managed services for Neon and Pinecone.

## 10. Technology Stack

*   **Frontend Framework:** Next.js
*   **Language:** TypeScript
*   **UI Components:** Shadcn UI
*   **Styling:** Tailwind CSS and `@/app/globals.css`
*   **Database:** Neon (Postgres)
*   **ORM:** Drizzle ORM
*   **Vector Database/RAG:** Pinecone
*   **Blockchain:** Hedera
*   **Package Manager:** npm
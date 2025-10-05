# XRPotato - Read-to-Earn Academic Publishing

Revolutionary academic publishing platform built on XRPL blockchain where authors earn from every read, reviewers get compensated fairly, and knowledge flows freely.

## 🚀 What's Built (MVP Frontend)

This is the **frontend foundation** for the XRPotato hackathon project. The interface demonstrates the complete user journey and workflow visualization.

### ✅ Completed Features

- **Landing Page**: Hero section explaining Read-to-Earn model with gradient design
- **Authentication UI**: Dual auth flow (Auth0 + XUMM wallet connect)
- **Author Dashboard**: Track papers, earnings, reads, and citations
- **Paper Submission**: Upload interface with metadata forms and workflow steps
- **Design System**: Blockchain-inspired colors (purple/blue gradients + orange accents)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Custom Button Variants**: Hero, wallet, and academic variants using design tokens

### 🎨 Design Highlights

- **Primary Colors**: Deep purple-blue gradients (#6366F1 → #8B5CF6)
- **Accent**: Warm orange (#F59E0B - potato theme!)
- **Semantic Tokens**: All colors use HSL CSS variables from design system
- **Smooth Animations**: Glow effects, transitions, and hover states
- **Professional + Modern**: Academic credibility meets Web3 innovation

## 🏗️ Architecture Overview

```
Frontend (Current)           Backend (To Build)
├─ Next.js 14 App           ├─ Node.js + Express
├─ React + TypeScript       ├─ PostgreSQL + Prisma
├─ Tailwind + shadcn/ui     ├─ XRPL.js (Testnet)
├─ Zustand (state)          ├─ IPFS (Pinata/Web3.storage)
└─ Auth0 + XUMM UI          ├─ AWS S3 Backup
                            ├─ BullMQ (Redis) Jobs
                            └─ Auth0 + XUMM SDK
```

## 🔗 Backend Integration Roadmap

To complete the full dApp, implement these backend components:

### 1. **Database Schema (Prisma + PostgreSQL)**
```prisma
model User {
  id              String   @id @default(uuid())
  email           String?  @unique
  name            String
  role            Role     @default(AUTHOR)
  walletAddress   String?  @unique
  authProvider    AuthProvider
  reputationScore Int      @default(0)
  papers          Paper[]
  reviews         Review[]
}

model Paper {
  id             String       @id @default(uuid())
  title          String
  abstract       String
  keywords       String[]
  pdfCid         String       // IPFS CID
  s3Key          String       // S3 backup
  status         PaperStatus  @default(DRAFT)
  version        Int          @default(1)
  contentHash    String       // SHA-256
  nftTokenId     String?
  nftIssuer      String?
  finalCid       String?
  doi            String?
  ownerId        String
  owner          User         @relation(fields: [ownerId], references: [id])
  reviews        Review[]
  paymentEvents  PaymentEvent[]
  createdAt      DateTime     @default(now())
}

enum PaperStatus {
  DRAFT
  READY_FOR_REVIEW
  UNDER_REVIEW
  REVISION_REQUESTED
  ACCEPTED
  PUBLISHED
}
```

### 2. **XRPL Integration (xrpl.js)**

```typescript
// Core XRPL operations needed:
- mintNFT(paper: Paper): Promise<{ tokenId, issuer, txHash }>
- sendMicropayment(from, to, drops): Promise<txHash>
- createEscrow(reviewerWallet, amount, deadline): Promise<txHash>
- splitReadRevenue(readerWallet, recipients, amounts): Promise<txHashes[]>
```

### 3. **IPFS + S3 Storage**

```typescript
// Storage pipeline:
1. Upload PDF to S3 (backup)
2. Push to IPFS via Pinata/Web3.storage
3. Compute SHA-256 hash
4. Store CID + S3 key + hash in database
5. On publish: Create metadata JSON → IPFS → NFT URI
```

### 4. **API Endpoints**

Key routes to implement:

```
POST   /api/papers              - Upload paper with PDF
POST   /api/papers/:id/ready    - Mark ready for review
POST   /api/agreements           - Create journal agreement (writes XRPL memo)
POST   /api/reviews              - Submit review (writes XRPL memo)
POST   /api/papers/:id/publish   - Mint NFT and publish
POST   /api/papers/:id/read      - Trigger read micropayments
GET    /api/analytics/:id        - Fetch paper analytics
```

### 5. **State Machine Workflow**

Enforce transitions:
```
DRAFT → READY_FOR_REVIEW → UNDER_REVIEW → REVISION_REQUESTED → ACCEPTED → PUBLISHED
```

Block invalid transitions server-side with Zod validation.

### 6. **Micropayment Revenue Split**

On paper read:
```typescript
const defaultSplit = {
  authors: 0.60,    // 60%
  journal: 0.20,    // 20%
  reviewers: 0.15,  // 15% (weighted by quality)
  platform: 0.05    // 5%
};

// Execute as sequential XRPL Payment txs
// Store all tx hashes in PaymentEvent record
```

## 🔐 Environment Variables Needed

Create `.env` file:

```bash
# Auth
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_secret
AUTH0_AUDIENCE=https://xrpotato.com/api
XUMM_API_KEY=your_xumm_key
XUMM_API_SECRET=your_xumm_secret

# XRPL
XRPL_NETWORK=testnet
XRPL_JSONRPC=https://s.altnet.rippletest.net:51234/
PLATFORM_HOT_WALLET_SEED=sXXXXXXXXX  # DEV ONLY - never commit!

# Storage
WEB3STORAGE_TOKEN=your_token
# OR
PINATA_JWT=your_jwt
AWS_S3_BUCKET=xrpotato-papers
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/xrpotato
REDIS_URL=redis://localhost:6379
```

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:8080
```

## 📦 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State**: Zustand (when needed)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🎯 Next Steps for Full Implementation

1. **Enable Lovable Cloud** - Get instant backend infrastructure
2. **Implement XRPL Integration** - Add xrpl.js package and testnet connection
3. **Setup IPFS Storage** - Configure Pinata or Web3.storage
4. **Build API Endpoints** - Create Express routes with Prisma
5. **Add Auth0 + XUMM** - Complete authentication flows
6. **Deploy to Testnet** - Fund test wallets and demo full flow

## 📖 Key Resources

- [XRPL.js Docs](https://js.xrpl.org/)
- [XLS-20 NFT Standard](https://xrpl.org/nft-concepts.html)
- [XUMM SDK](https://xumm.readme.io/)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
- [Web3.storage](https://web3.storage/docs/)

## 🏆 Hackathon Demo Flow

1. **Author Login** → Dashboard showing mock papers
2. **Submit Paper** → Upload PDF + metadata
3. **View Status** → See "Under Review" state with workflow
4. **Publish** → Mint NFT (demonstrate tx hash)
5. **Read Event** → Trigger micropayment split
6. **Analytics** → Show earnings and impact metrics

## 📝 Notes

- All XRPL transactions currently show toast notifications with placeholder tx hashes
- File uploads are simulated - backend will handle actual IPFS/S3 uploads
- Revenue splits and NFT minting require backend integration
- Testnet faucet: https://xrpl.org/xrp-testnet-faucet.html

---

**Built for XRPL Hackathon** • [Testnet Explorer](https://testnet.xrpl.org/) • [Project Demo](#)

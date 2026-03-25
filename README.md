# 🏢 TIGGY: Enterprise Tech Due Diligence & AI Copilot

![TIGGY Banner](https://picsum.photos/seed/nexus-banner/1200/300?blur=2)

**TIGGY** is a highly secure, multi-tenant Technology Due Diligence platform tailored specifically for Bain TIG (Technology & Innovation Group) professionals. Built for the high-stakes, fast-paced environment of Private Equity M&A, it combines real-time collaboration, secure document management, and a context-aware AI Copilot powered by Google's Gemini 3.1 Pro to accelerate tech diligence, automate risk scoring, and generate actionable IC memo insights.

---

## 🏗️ Detailed System Architecture

The application follows a modern, serverless, event-driven architecture utilizing Firebase for real-time backend services and Google Gen AI for intelligent, agentic features.

```text
+-----------------------------------------------------------------------------------+
|                               CLIENT APPLICATION                                  |
|               (React 18 + Vite + Tailwind CSS + shadcn/ui + motion)               |
|                                                                                   |
|  +----------------+  +----------------+  +----------------+  +-----------------+  |
|  |  Auth Context  |  |   Deal State   |  |   Chat State   |  |  Real-time UI   |  |
|  +-------+--------+  +-------+--------+  +-------+--------+  +--------+--------+  |
|          |                   |                   |                    ^           |
+----------|-------------------|-------------------|--------------------|-----------+
           | (OAuth)           | (CRUD)            | (Prompt/Tools)     | (onSnapshot)
           v                   v                   v                    |
+-------------------+ +---------------------------------------+         |
|   FIREBASE AUTH   | |           FIRESTORE (NoSQL)           |---------+
| (Google Provider) | |                                       |
| Extracts Domain   | | +-------+ +-------+ +-------+ +-----+ |
| for Tenant ID     | | | Users | | Deals | | Memos | | ... | |
+---------+---------+ | +-------+ +-------+ +-------+ +-----+ |
          |           |                                       |
          | (Token)   | [ SECURITY LAYER: Firestore Rules ]   |
          v           +--------------------+------------------+
+-------------------+                      | (Context & History)
|   RBAC & TENANT   |                      v
|   ISOLATION       | +---------------------------------------+
|   ENFORCEMENT     | |          GOOGLE GEMINI AI API         |
+-------------------+ |  (Gemini 3.1 Pro Preview + Tooling)   |
                      |  - Function Calling (Memos, Tasks)    |
                      |  - Grounding (Google Search)          |
                      |  - Multimodal Analysis                |
                      +---------------------------------------+
```

---

## 🧠 Core Technical Implementations

### 1. Agentic AI Copilot (Gemini 3.1 Pro)
The AI integration goes beyond simple text generation. It acts as an autonomous agent within the deal room using the **Gemini Interactions API** and **Function Calling (Tools)**.
*   **Gemini Interactions API:** We leverage the latest `@google/genai` SDK and the Gemini Interactions API to facilitate real-time, streaming conversations (`generateContentStream`) between the user and the AI, providing a seamless, low-latency chat experience.
*   **Tool Invocations:** The AI is equipped with `FunctionDeclaration` objects allowing it to execute backend operations directly from the chat interface. Tools include `createMemoFunction`, `readMemoFunction`, `updateTaskFunction`, `analyzeDataRoomFileFunction`, and `updateDealMemoryFunction`.
*   **Context Window Management:** The chat component fetches the entire `messages` collection scoped to the specific `dealId` and formats it into a continuous conversation history for the Gemini model, ensuring deep contextual awareness of the deal's diligence phase.
*   **Grounding:** Utilizes Google Search grounding to pull in real-time market data and news regarding target companies.

### 2. Zero-Downtime Multi-Tenant Migration Engine
To support enterprise scaling, the app employs a strict domain-based multi-tenant architecture. To handle legacy data without downtime or manual database scripts, a **Client-Side Auto-Migration Engine** is implemented:
*   **In-Memory Filtering:** The client fetches data ordered by creation date and filters it in-memory (`!d.tenantId || d.tenantId === tenantId`) to ensure legacy data remains visible to the original creators.
*   **Background Upgrades:** As legacy data is loaded into the UI, a background `useEffect` process iterates through documents missing a `tenantId` and executes an `updateDoc` to stamp them with the user's current tenant ID, seamlessly upgrading the database schema in real-time.

### 3. Real-Time Reactivity (`onSnapshot`)
The application relies heavily on Firebase's WebSocket-based `onSnapshot` listeners rather than traditional REST polling.
*   When a user opens a Deal Room, multiple listeners are attached to `files`, `memos`, `tasks`, and `messages` collections.
*   Any mutation (from the user, a collaborator, or the AI Copilot) instantly triggers a React state update, providing a synchronous multiplayer experience.

---

## 🛡️ Advanced Security & Compliance

Security is enforced at the database level using complex Firestore Security Rules, ensuring compliance with financial institution standards (SOC 2, ISO 27001).

### Strict Tenant Isolation & Legacy Support
Rules dynamically check the user's JWT token to extract their email domain and enforce tenant boundaries, while safely allowing the migration of legacy data:

```javascript
function getTenantId() {
  return request.auth.token.email.split('@')[1];
}

function isLegacyOrSameTenant(resourceData) {
  // Allows access if the document belongs to the user's firm, 
  // OR if it's a legacy document pending auto-migration.
  return isAuthenticated() && (!('tenantId' in resourceData) || resourceData.tenantId == getTenantId());
}
```

### Immutable Audit Trails & Schema Validation
Every collection enforces strict schema validation and prevents tampering with audit fields (`createdAt`, `createdBy`).

```javascript
// Example: Task Update Validation
allow update: if isLegacyOrSameTenant(resource.data) && 
              isValidTask(request.resource.data) &&
              isSameTenant(request.resource.data.tenantId) &&
              request.resource.data.dealId == resource.data.dealId && // Immutable relationship
              request.resource.data.createdBy == resource.data.createdBy && // Immutable author
              request.resource.data.createdAt == resource.data.createdAt; // Immutable timestamp
```

---

## 🗄️ Database Schema (TypeScript Definitions)

The NoSQL database is strictly typed on the client and validated on the server.

```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'consultant';
  tenantId: string; // e.g., "bain.com"
  createdAt: ISOString;
}

interface Deal {
  id: string;
  name: string;
  targetCompany: string;
  status: 'sourcing' | 'diligence' | 'closed' | 'passed';
  ev: number; // Enterprise Value
  tenantId: string;
  createdBy: string; // User UID
  createdAt: ISOString;
  updatedAt: ISOString;
}

interface Message {
  id: string;
  dealId: string;
  role: 'user' | 'model';
  content: string;
  tenantId: string;
  userId?: string; // Only present for 'user' role
  groundingUrls?: string[]; // Present if AI used Google Search
  createdAt: ISOString;
}
```

---

## 💻 Development Guide

### Prerequisites
*   Node.js 18+
*   Firebase Project (Authentication, Firestore enabled)
*   Google Gemini API Key

### Setup Instructions

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   # Google Gen AI
   GEMINI_API_KEY=your_gemini_api_key

   # Firebase Configuration (Vite Prefix)
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Deploy Security Rules:**
   Ensure your Firestore rules are up to date to prevent permission errors:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The Vite HMR server will start on `http://localhost:3000`.

### Build for Production
```bash
npm run build
```
This compiles the React application using `tsc` and bundles it via Vite into the `/dist` directory, ready for static hosting.

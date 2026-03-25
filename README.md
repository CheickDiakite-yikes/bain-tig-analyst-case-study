# 🏢 Nexus: Enterprise M&A Deal Room & AI Copilot

![Nexus Banner](https://picsum.photos/seed/nexus-banner/1200/300?blur=2)

**Nexus** is a highly secure, multi-tenant Private Equity and M&A Deal Management platform. Built for top-tier consulting firms and investment banks, it combines real-time collaboration, secure document management, and a context-aware AI Copilot powered by Google's Gemini to accelerate the due diligence phase.

---

## ✨ Key Features

*   **🏢 Strict Multi-Tenant Architecture:** Data is strictly isolated at the database level using domain-based tenant IDs (e.g., `@bain.com` users can never access `@mckinsey.com` data).
*   **🤖 AI-Powered Deal Copilot:** Integrated with Google Gemini 3.1 Pro to analyze data room files, draft investment memos, and answer complex questions about target companies.
*   **📊 Deal Pipeline Management:** Kanban-style tracking of deals through Sourcing, Diligence, Closed, and Passed phases.
*   **🔐 Enterprise-Grade Security:** Robust Firestore Security Rules enforcing Role-Based Access Control (RBAC) and tenant isolation.
*   **⚡ Real-Time Collaboration:** Live updates for tasks, memos, and files using Firestore's real-time snapshot listeners.
*   **🔄 Auto-Migration Engine:** Seamlessly upgrades legacy data to the new multi-tenant architecture without user intervention or downtime.

---

## 🏗️ System Architecture

The application follows a modern, serverless architecture utilizing Firebase for backend services and Google Gen AI for intelligent features.

```text
+-----------------------------------------------------------------------+
|                           CLIENT APPLICATION                          |
|         (React 18 + Vite + Tailwind CSS + shadcn/ui + motion)         |
|                                                                       |
|  [ Dashboard ]  [ Deal Room ]  [ AI Chat ]  [ Data Room ]  [ Tasks ]  |
+-----------------------------------+-----------------------------------+
                                    |
                                    | (Real-time WebSockets & REST)
                                    v
+-----------------------------------------------------------------------+
|                      FIREBASE AUTHENTICATION                          |
|             (Google OAuth -> Extracts Domain for Tenant ID)           |
+-----------------------------------+-----------------------------------+
                                    |
                                    | (Secure JWT + Tenant ID)
                                    v
+-----------------------------------------------------------------------+
|                    FIRESTORE DATABASE (NoSQL)                         |
|                                                                       |
|  +-------------------------+       +-------------------------+        |
|  | Tenant A (e.g. bain.com)|       | Tenant B (e.g. mck.com) |        |
|  |-------------------------|       |-------------------------|        |
|  | - Users                 |       | - Users                 |        |
|  | - Deals                 |       | - Deals                 |        |
|  | - Files                 |       | - Files                 |        |
|  | - Memos                 |       | - Memos                 |        |
|  | - Tasks                 |       | - Tasks                 |        |
|  | - Messages              |       | - Messages              |        |
|  +-------------------------+       +-------------------------+        |
|                                                                       |
|      [ SECURITY LAYER: Strict Domain-Based Isolation Rules ]          |
+-----------------------------------+-----------------------------------+
                                    |
                                    | (Context & Prompts)
                                    v
+-----------------------------------------------------------------------+
|                       GOOGLE GEMINI AI API                            |
|    (Context-Aware Deal Analysis, Memo Generation, Data Extraction)    |
+-----------------------------------------------------------------------+
```

---

## 🛡️ Security & Compliance

Security is the foundational pillar of Nexus, designed to meet the rigorous standards of financial institutions (ISO 27001, SOC 2).

### 1. Multi-Tenancy & Data Isolation
Every document in the database is tagged with a `tenantId` derived from the user's authenticated email domain. Firestore Security Rules physically block cross-tenant reads and writes.

```javascript
// Example of our strict tenant isolation rule
function isSameTenant(tenantId) {
  return isAuthenticated() && 
         request.auth.token.email != null && 
         tenantId == request.auth.token.email.split('@')[1];
}
```

### 2. Role-Based Access Control (RBAC)
*   **Consultants:** Can create, read, and update deals, files, and tasks within their firm's tenant.
*   **Admins:** Have elevated privileges to delete records and manage firm-wide settings. Users cannot self-escalate to Admin status.

### 3. Immutable Audit Trails
Critical fields such as `createdAt`, `createdBy`, and `uploadedBy` are locked at the database level. Once a record is created, these fields cannot be tampered with, ensuring a reliable audit trail for compliance.

### 4. Schema Validation
Firestore rules enforce strict schema validation. Documents cannot be saved if they contain unexpected fields, preventing NoSQL injection and schema pollution.

---

## 🗄️ Data Model

The database is structured to optimize for real-time reads and deep AI context generation:

*   **`users`**: Profiles, roles (`admin` | `consultant`), and tenant associations.
*   **`deals`**: Core M&A targets, enterprise value (EV), status, and AI memory context.
*   **`files`**: Metadata for uploaded data room documents (PDFs, Excel, etc.).
*   **`memos`**: Collaborative investment memos and due diligence reports.
*   **`tasks`**: Deal-specific action items with priority and status tracking.
*   **`messages`**: AI Copilot chat history, scoped per deal for continuous context.

---

## 💻 Tech Stack

*   **Frontend Framework:** React 18, Vite
*   **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide Icons, Framer Motion
*   **Backend & Database:** Firebase (Firestore, Authentication)
*   **AI Integration:** `@google/genai` (Gemini 3.1 Pro Preview)
*   **Routing:** React Router DOM
*   **Markdown Rendering:** `react-markdown`

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Ensure your `.env` file contains your Firebase configuration and Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

*Built with precision for the future of Private Equity and M&A.*

# Project Development Strategy

# ChillerPage - Implementation Plan & Tasks (MVP)

**Overall Goal:** Develop the MVP (Minimum Viable Product) for the ChillerPage web application based on the finalized PRD (`docs/product_requirement_docs.md`), initial schema (`prisma/schema.prisma`), and API design outline (`docs/api_design.md`).

**Visual Theme Reference:** The static prototype `docs/ui_prototype.html` serves as the reference for the general dark theme (dark blue/grey backgrounds, gold accents) and layout structure.

**Phased Approach:**

Reference Documents:
*   Product Requirements Document: `docs/product_requirement_docs.md`
*   API Design (tRPC Routers): `docs/api_design.md`

## Phase 1: Foundation & Authentication

**Goal:** Set up the basic project structure, core dependencies, database connection, authentication, and initial UI layout.

*   **1.1:** Setup Next.js project (App Router, TypeScript).
*   **1.2:** Integrate Tailwind CSS & configure `tailwind.config.js`.
*   **1.3:** Initialize Shadcn/ui & install Lucide Icons.
*   **1.4:** Install Prisma and configure `prisma/schema.prisma`.
*   **1.5:** Set up `DATABASE_URL` environment variable for Supabase connection.
*   **1.6:** Run initial Prisma migration (`prisma migrate dev`) to create database tables.
*   **1.7:** Install and configure tRPC (router setup, context creation, basic middleware) - *Refer to `docs/api_design.md`*.
*   **1.8:** Install and configure NextAuth.js with Prisma adapter and Email/Password provider. Update schema/migrate if needed.
*   **1.9:** Create basic site layout components (`RootLayout`, `Header`, `Footer`).
*   **1.10:** Create basic Member Area layout with persistent Left Navbar component.
*   **1.11:** Implement Login and Signup pages/components using NextAuth.js functions.
*   **1.12:** Set up basic session context/provider for frontend use.
*   **1.13:** Implement basic protected routes for member areas.

## Phase 2: User & Clan Management Basics

*   **Goal:** Allow users to manage profiles, and enable admins to manage users, clans, roles, and ranks.
*   **Tasks:**
    *   **2.1:** Create User Profile page.
    *   **2.2:** Implement tRPC `user.getProfile` procedure.
    *   **2.3:** Build Profile editing form (Display Name, Language, Country).
    *   **2.4:** Implement tRPC `user.updateProfile` procedure.
    *   **2.5:** Build Game Alias management UI within Profile page.
    *   **2.6:** Implement tRPC alias management procedures (`user.getGameAliases`, `user.addGameAlias`, `user.removeGameAlias`).
    *   **2.7:** Implement tRPC `user.checkAliasMatch` and integrate visual feedback.
    *   **2.8:** Implement tRPC `user.getKnownPlayers` for alias selection dropdown.
    *   **2.9:** Create Prisma seed script for `Role` and `Rank` tables. Run seed.
    *   **2.10:** Create basic Admin Panel layout/page structure (permission protected).
    *   **2.11:** Implement User List component in Admin Panel (Shadcn Table).
    *   **2.12:** Implement tRPC `admin.listUsers` procedure with filtering.
    *   **2.13:** Build UI in Admin Panel for assigning Role/Rank/Clan.
    *   **2.14:** Implement tRPC procedures for user assignment (`admin.assignUserRole`, `admin.assignUserRank`, `admin.assignUserClan`, `admin.removeUserClan`).
    *   **2.15:** Implement basic Clan management UI in Admin Panel (List, Create, Edit).
    *   **2.16:** Implement tRPC procedures for Clan CRUD (`admin.createClan`, `admin.updateClan`).
    *   **2.17:** Implement tRPC permission checking middleware.

## Phase 3: Core Data Flow (Import & Rules)

*   **Goal:** Implement the data import pipeline, including parsing, preview, validation, correction, scoring, rule management, and committing data.
*   **Tasks:**
    *   **3.1:** Design and build Admin Rule Management page UI (unified interface).
    *   **3.2:** Implement tRPC procedures for Validation Rule CRUD (`rules.listValidationRules`, etc.).
    *   **3.3:** Implement tRPC procedures for Correction Rule CRUD (`rules.listCorrectionRules`, etc.).
    *   **3.4:** Implement tRPC procedures for Scoring Rule CRUD (`rules.listScoringRules`, etc. incl. order).
    *   **3.5:** Implement tRPC procedure `data.rescoreChestData`.
    *   **3.6:** Create Data Import page UI.
    *   **3.7:** Implement backend parsing logic for Pattern 1 CSV (`data.parseAndPreviewData`).
    *   **3.8:** Implement backend parsing logic for Pattern 2 Text (incl. level/range/date) (`data.parseAndPreviewData`).
    *   **3.9:** Design data structure returned by `parseAndPreviewData`.
    *   **3.10:** Build client-side Preview Table component (Shadcn Table).
    *   **3.11:** Implement Validation Rule application logic in backend/preview.
    *   **3.12:** Implement Correction Rule application logic in backend/preview.
    *   **3.13:** Implement Scoring Rule application logic in backend/preview (with precedence).
    *   **3.14:** Implement UI for applying corrections in Preview Table.
    *   **3.15:** Implement visual highlighting in Preview Table.
    *   **3.16:** Implement Admin Rule Toggle setting UI/API (`admin.getRuleToggleSettings`, `admin.setRuleToggleSettings`).
    *   **3.17:** Implement "Commit Data" functionality (tRPC `data.commitPreviewData` with metadata).
    *   **3.18:** Implement UI feedback mechanisms for import process.

## Phase 4: Data Display & Content Basics

*   **Goal:** Allow viewing and editing of committed data, display stats/charts, and set up basic content features.
*   **Tasks:**
    *   **4.1:** Create dedicated Data Viewing page.
    *   **4.2:** Implement Data Viewing table component (Shadcn Table) with server-side sorting, filtering, pagination.
    *   **4.3:** Implement tRPC `data.listChestData` procedure.
    *   **4.4:** Implement inline editing UI/logic in Data Viewing table.
    *   **4.5:** Implement tRPC `data.updateChestDataEntry` procedure.
    *   **4.6:** Implement row selection and Batch Delete UI/logic.
    *   **4.7:** Implement tRPC `data.batchDeleteChestData` procedure.
    *   **4.8:** Implement Audit Log creation for data modifications.
    *   **4.9:** Create basic Dashboard layout component.
    *   **4.10:** Implement tRPC `data.getChestDataStats` procedure.
    *   **4.11:** Build Dashboard component: Personal Stats display.
    *   **4.12:** Build Dashboard component: Clan Stats display.
    *   **4.13:** Select and install Charting library (e.g., Recharts).
    *   **4.14:** Integrate basic charts into Dashboard components.
    *   **4.15:** Create dedicated Charts/Stats page structure.
    *   **4.16:** Implement detailed charts/tables on dedicated page.
    *   **4.17:** Create News/Announcement listing page/component (`content.listArticles`).
    *   **4.18:** Create Article viewing page component (`content.getArticle`).
    *   **4.19:** Select and integrate Rich Text Editor component.
    *   **4.20:** Build Article creation/editing form UI.
    *   **4.21:** Implement tRPC `content.createArticle` & `content.updateArticle` procedures.
    *   **4.22:** Implement Article Approval UI elements.
    *   **4.23:** Implement tRPC `content.submitArticleForApproval` & `content.publishArticle` procedures.
    *   **4.24:** Implement Comment list display component.
    *   **4.25:** Implement Comment creation form UI.
    *   **4.26:** Implement tRPC `content.addComment` procedure (handle threading).
    *   **4.27:** Implement Comment up-voting/emote UI.
    *   **4.28:** Implement tRPC `content.upvoteContent` & `content.addReaction` procedures.
    *   **4.29:** Implement Comment sorting/searching UI.

## Phase 5: Polish & Remaining MVP

*   **Goal:** Implement remaining MVP features (directory, calendar, messaging, etc.) and focus on polish, testing, and deployment prep.
*   **Tasks:**
    *   **5.1:** Create Member Directory page UI.
    *   **5.2:** Implement tRPC `clan.getClanMembers` and integrate display/filtering.
    *   **5.3:** Create Event Calendar page UI.
    *   **5.4:** Select and integrate Calendar component library.
    *   **5.5:** Implement Event CRUD UI.
    *   **5.6:** Implement tRPC procedures for Event CRUD (`event.*`).
    *   **5.7:** Implement basic Notification display UI.
    *   **5.8:** Implement backend logic to create Notifications.
    *   **5.9:** Implement tRPC `notification.listNotifications` & `notification.getUnreadCount` procedures.
    *   **5.10:** Implement automatic "mark as read" for notifications.
    *   **5.11:** Implement basic Private Messaging UI.
    *   **5.12:** Implement tRPC `message.sendMessage` & `message.listMessages` procedures.
    *   **5.13:** Implement Admin Broadcast UI.
    *   **5.14:** Implement tRPC `message.sendBroadcast` procedure.
    *   **5.15:** Setup i18n library (`next-i18next` recommended) and create locale files.
    *   **5.16:** Refactor key UI components for translation. Populate translations.
    *   **5.17:** Implement Language switcher in User Profile.
    *   **5.18:** Setup Storybook and create initial stories for core components.
    *   **5.19:** Conduct thorough manual testing.
    *   **5.20:** Review and test permission checks.
    *   **5.21:** Final UI/UX review and polish.
    *   **5.22:** Prepare environment variables for production.
    *   **5.23:** Configure deployment (e.g., Vercel).
    *   **5.24:** Perform initial production deployment.



# Technical Documentation - ChillerPage

This document outlines the key technical decisions, technology stack, and development environment for the ChillerPage project.

## 1. Technology Stack

The application is built using the following primary technologies:

*   **Frontend Framework:** Next.js (v14+ with App Router)
*   **Language:** TypeScript (v5+)
*   **UI Components:** Shadcn/ui (leveraging Radix UI and Tailwind CSS)
*   **Styling:** Tailwind CSS (v3+)
*   **Animation:** Framer Motion (for subtle UI animations)
*   **Icons:** Lucide Icons (via `lucide-react`)
*   **Backend API:** tRPC (v11+, integrated with Next.js API routes)
*   **Database:** Supabase (PostgreSQL v15+)
*   **ORM:** Prisma (v5+)
*   **Authentication:** NextAuth.js (v5 - Beta/Next)
*   **State Management:** Primarily React Server Components / Client Components with standard React state management (`useState`, `useReducer`, `useContext`). Global state management libraries (like Zustand or Jotai) may be considered if complex client-side state needs arise, but are not planned initially.
*   **Charting:** Recharts (or potentially Nivo/Chart.js - final decision during implementation of visualization features)
*   **Component Development/Documentation:** Storybook (v7+)
*   **Internationalization (i18n):** `next-i18next` or similar library compatible with Next.js App Router.
*   **Code Formatting:** Prettier
*   **Linting:** ESLint

## 2. Development Environment

*   **Package Manager:** npm (or yarn/pnpm based on developer preference during setup)
*   **Node.js Version:** LTS version (e.g., v20+) recommended.
*   **Database Migrations:** Managed via `prisma migrate dev`.
*   **Database Seeding:** Managed via Prisma seeding capabilities.

## 3. Key Technical Decisions & Patterns

*   **App Router:** Utilizing the Next.js App Router for improved routing, layout management, and Server Components.
*   **Server Components:** Leveraging React Server Components (RSCs) where possible for performance benefits, fetching data closer to the source. Client Components used for interactivity.
*   **tRPC:** End-to-end typesafe APIs between frontend and backend, colocated within the Next.js application.
*   **Prisma:** Typesafe database access and schema management.
*   **NextAuth.js:** Handling user authentication and session management, integrating with Supabase or other providers as needed.
*   **Shadcn/ui:** Providing unstyled, accessible base components that are composed and styled locally using Tailwind CSS, allowing full control over the final appearance.
*   **Tailwind CSS:** Utility-first CSS framework for styling. Theme configuration will follow `docs/ui_prototype.html`.

## 4. Deployment (Initial Thoughts - TBD)

*   **Platform:** Vercel (recommended for Next.js applications) or potentially another platform supporting Node.js and database connections.
*   **Database:** Supabase hosted PostgreSQL.
*   **Build Process:** Standard Next.js build process (`next build`).
*   **Environment Variables:** Managing secrets and configuration (API keys, database URLs) via environment variables.

## 5. Developer Setup

*   Clone the repository and install dependencies:

    ```bash
    git clone https://github.com/your-org/ChillerPage.git
    cd ChillerPage
    npm install
    ```

*   Copy the environment template and configure `.env.local`:

    ```bash
    cp .env.example .env.local
    # then update values in .env.local
    ```

*   Run database migrations and seed initial data:

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

*   Start the development server:

    ```bash
    npm run dev
    ```

## 6. CI/CD Workflows

*   CI/CD pipelines are defined under `.github/workflows/`:
    1. **Build:** install dependencies, lint, and type-check (`npm run lint && npm run typecheck`)
    2. **Test:** execute unit and integration tests (`npm test`)
    3. **Migrations:** deploy Prisma migrations (`npx prisma migrate deploy`)
    4. **Deploy:** run Next.js build (`npm run build`) and trigger Vercel automatic deploy on `main`

## 7. Code Quality & Tooling

*   **ESLint:** enforced via `.eslintrc.js` for code standards and import rules
*   **Prettier:** formatting configured in `.prettierrc` to maintain consistent style
*   **TypeScript:** strict mode enabled in `tsconfig.json` (`"strict": true`), with path aliases defined

## 8. Testing Strategy

*   **Directory Structure:** all tests live under the `test/` folder in the project root, organized by type:
    *   `test/unit/` for isolated Jest unit tests
    *   `test/integration/` for tRPC and API integration tests

*   **Example Unit Test (Jest):**

    ```ts
    // test/unit/sum.test.ts
    import { sum } from '../src/lib/utils/math';

    test('adds two numbers', () => {
      expect(sum(1, 2)).toBe(3);
    });
    ```

*   **Example tRPC Integration Test:**

    ```ts
    // test/integration/trpc.test.ts
    import { appRouter } from '../src/lib/api/router';

    test('getAllClanChests returns an array', async () => {
      const caller = appRouter.createCaller({ session: null });
      const result = await caller.getAllClanChests();
      expect(Array.isArray(result)).toBe(true);
    });
    ```

## 9. Environment Variables & Secrets

*   Define keys in `.env.example` and populate `.env.local` (not committed):

    ```bash
    DATABASE_URL="postgresql://user:pass@host:port/dbname"
    NEXTAUTH_SECRET="your-random-secret"
    SUPABASE_URL="https://xyz.supabase.co"
    SUPABASE_KEY="supabase-service-role-key"
    GITHUB_ID=""
    GITHUB_SECRET=""
    ```

*   **Vercel Secrets:** configure via Vercel Dashboard or CLI (`vercel env add`) for production/staging environments.

# Chronicle: Comprehensive Implementation & Architecture Plan

This document outlines the technical architecture, library selections, and step-by-step implementation plan for transitioning Chronicle from a local-state React prototype to a scalable, production-ready event intelligence platform. 

The recommendations are backed by current (2025/2026) enterprise architecture standards for React ecosystems.

---

## Phase 1: Foundation (Infrastructure & Core Models)

**Goal:** Replace `localStorage` and global UI state with a secure, persistent architecture.

### Technical Stack Decisions
*   **Hosting / Framework:** Migrate from Vite SPA to **Next.js (App Router)**. 
    *   *Why:* Public attendee portals (`/e/:slug`) require SEO and fast initial server-renders. Next.js provides server-side rendering (SSR), API routes for secure backend logic, and file-based routing out of the box.
*   **Database:** **Supabase (PostgreSQL)**.
    *   *Why:* Provides a highly scalable managed Postgres database, Row Level Security (RLS) to enforce data boundaries between different event organizers, and real-time subscriptions.
*   **ORM:** **Drizzle ORM**.
    *   *Why:* Extremely fast, highly type-safe, and runs natively in edge environments.
*   **Authentication:** **Clerk**.
    *   *Why:* Drop-in B2B authentication. Easily handles separating "Organizer" accounts (with org-level billing and roles) from "Attendees" (who may be anonymous or use lightweight OAuth/magic links).

### Implementation Steps
1.  **Framework Migration:** Initialize Next.js, move `src/components` over, and replace `App.tsx` global state with Next.js App Router (`app/(organizer)/dashboard/page.tsx`, `app/e/[slug]/page.tsx`).
2.  **Database Provisioning:** Define Drizzle schemas for `User`, `Organization`, `Event`, `EventSettings`.
3.  **Auth Integration:** Protect the `/(organizer)/*` routes with Clerk middleware.
4.  **Data Hydration:** Replace mock data arrays with Server Components fetching directly from Postgres via Drizzle.

---

## Phase 2: Core Chronicle Engine (AI, Storage, Core Workflows)

**Goal:** Implement real attendee data pipelines, file handling, and actual AI orchestration.

### Technical Stack Decisions
*   **Blob Storage:** **Supabase Storage** or **AWS S3**.
    *   *Why:* Scalable object storage. We will use **Presigned URLs** so attendees upload photos directly from their browser to the bucket, bypassing our server and preventing bandwidth bottlenecks.
*   **AI Orchestration:** **Google Vertex AI / Gemini API** (`@google/genai`).
    *   *Why:* Class-leading multimodal context. Must be executed strictly on the backend to protect API keys and prevent prompt injection.
*   **Validation:** **Zod**.
    *   *Why:* Enforces strict TypeScript schemas. We will use Zod to validate attendee inputs and to strictly parse structured JSON outputs from the LLM.

### Implementation Steps
1.  **Attendee Upload Flow:** Create an API route that generates an S3/Supabase presigned URL. The frontend uploads the file and writes a `Photo` record to the database.
2.  **AI Prompt Pipeline:** Move `generateSmartLinkedInPost` to a secure Next.js Server Action. It will retrieve the event context, attendee photos, and takeaways from the DB, construct the system prompt, and call the Gemini API.
3.  **Output Parsing:** Use Zod to ensure the LLM returns the expected `{ post: string, hashtags: string[], tone_used: string }` format.
4.  **Persistence:** Save the generated result as a `Generation` entity linked to the `AttendeeSession`.

---

## Phase 3: Measurement & Telemetry (Event Intelligence)

**Goal:** Transform mocked dashboard metrics into a real-time event analytics engine.

### Technical Stack Decisions
*   **Product Analytics:** **PostHog**.
    *   *Why:* Open-source, developer-friendly analytics. It supports custom event tracking (e.g., `post_generated`, `linkedin_share_clicked`), funnels, and session replays to see how attendees interact with the portal.
*   **Dashboard Aggregations:** **Postgres Materialized Views**.
    *   *Why:* Calculating live metrics (total attendees, conversion rates) across thousands of rows can be slow. Materialized views pre-compute these stats for the Organizer Dashboard, ensuring sub-50ms load times.

### Implementation Steps
1.  **Telemetry Setup:** Install PostHog provider. Dispatch events from the attendee portal: `page_viewed`, `upload_started`, `generation_completed`, `post_copied`.
2.  **Conversion Pipeline:** Create a Postgres view that calculates `(total_generations / unique_sessions) * 100` per event.
3.  **Theme Extraction (NLP):** Run a lightweight background cron job that periodically passes the day's `Takeaways` to an LLM to extract "Top Themes" and updates a `ContentInsights` table.

---

## Phase 4: Production Hardening (Security & Reliability)

**Goal:** Protect the platform from abuse, ensure high uptime, and prepare for public launch.

### Technical Stack Decisions
*   **Rate Limiting:** **Upstash Redis**.
    *   *Why:* AI APIs are expensive. We must strictly rate-limit generation endpoints (e.g., max 3 generations per attendee IP per hour) using a fast, edge-compatible Redis store.
*   **Observability:** **Sentry**.
    *   *Why:* Captures unhandled frontend errors and backend API failures with full stack traces.
*   **Testing:** **Playwright** (E2E) + **Vitest** (Unit/Integration).
    *   *Why:* Maintain the existing UI tests, but expand Playwright to test actual DB states and mocked AI API responses.

### Implementation Steps
1.  **Middleware Security:** Implement Upstash Redis rate limiting in the Next.js middleware.
2.  **Error Boundaries:** Wrap React trees in Sentry Error Boundaries to prevent full app crashes.
3.  **CI/CD Pipeline:** Set up GitHub Actions to run TypeScript checks, ESLint, and Playwright tests before every deployment to Vercel.

---

## Phase 5: Experience Differentiation (The "Wow" Factor)

**Goal:** Elevate the product from functional to magical.

### Technical Stack Decisions
*   **Animation Engine:** **Motion (Framer Motion)**.
    *   *Why:* Already integrated. We will expand its use to orchestrated layout transitions across the new routing paradigm.
*   **WebSockets:** **Supabase Realtime**.
    *   *Why:* Provides live updates. When an attendee generates a post, the Organizer's dashboard "Live Activity Timeline" should update instantly without a page refresh.

### Implementation Steps
1.  **Real-Time Subscriptions:** Hook the Organizer Dashboard to a Supabase Realtime channel listening for `INSERT` events on the `Generation` table.
2.  **Signature AI Polish:** Enhance the "Generating" state with dynamic streaming text (using React Server Components streaming) so the user sees the AI "thinking" and writing their post character-by-character.
3.  **Dynamic Theming:** Use CSS variables tied to the `EventBranding` database entity so the attendee portal automatically adopts the organizer's exact hex codes and typography.

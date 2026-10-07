# DECISION REGISTER

## ADR-001 — Framework Migration
**Decision:** Migrate from Vite SPA to Next.js (App Router).
**Context:** Chronicle currently uses Vite. Public attendee pages need SEO and fast initial loads, and AI logic must run securely on the server.
**Consequences:** Requires moving src/ to app/ and setting up Server Components.

## ADR-002 — Database & Backend
**Decision:** Use Supabase (Postgres) and Drizzle ORM.
**Context:** Chronicle needs persistent multi-user data. Supabase provides managed Postgres with RLS. Drizzle offers edge-compatible type-safe querying.
**Consequences:** Replaces localStorage.

## ADR-003 — Authentication
**Decision:** Use Clerk for Organizer auth; anonymous sessions for attendees.
**Context:** Need B2B auth with organization support.
**Consequences:** Introduces Clerk middleware and webhooks.

## ADR-004 — Media Storage
**Decision:** Supabase Storage via Presigned URLs.
**Context:** Photos must be uploaded securely without bottlenecking our API servers.
**Consequences:** Clients upload directly to the storage bucket.

## ADR-005 — AI Orchestration
**Decision:** Google Vertex AI / Gemini API via Server Actions.
**Context:** Deep context reasoning required. Must ensure structured JSON output.
**Consequences:** Use Zod for parsing responses.

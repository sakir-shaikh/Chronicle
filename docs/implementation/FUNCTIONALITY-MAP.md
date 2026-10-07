# Chronicle Functionality Map

This map provides a structural, topological view of the Chronicle product. While the `TASK-TREE.md` organizes work by implementation phases (when things get built), this map organizes work by **Functional Product Areas** (what things do).

```mermaid
mindmap
  root((Chronicle App))
    Organizer Experience
      Authentication & Access
        Clerk Provider Setup (AUTH-001)
        Login / Signup (AUTH-003)
        User DB Sync Webhooks (AUTH-002)
      Dashboard & Operations
        Protected Route Layout (ARCH-002)
        Realtime Postgres Views (ANALYTICS-003)
      Event Creation
        User & Event Schemas (DB-002)
        Settings & Branding Configuration
    Attendee Experience
      Event Portal
        Public Dynamic Routing (ARCH-003)
        Event Metadata Hydration
      Media Capture
        Storage Buckets & Policies (PHOTO-001)
        Presigned URL Dispenser (PHOTO-001)
        Multipart Client Upload Hook (PHOTO-002)
      AI Storytelling
        Attendee Session Schema (DB-003)
        Gemini Server Action Setup (AI-001)
        Zod JSON Output Validation (AI-002)
        Upstash Abuse Rate Limiting (AI-003)
    Platform Infrastructure
      Core Application
        Next.js App Router Setup (ARCH-001)
      Data Layer
        Supabase Connection & Drizzle (DB-001)
      Telemetry & Tracking
        PostHog Provider Wrap (ANALYTICS-001)
```

## Why this map is valuable

1. **Contextual Awareness:** A developer picking up task `AI-002` (Zod Output Validation) can instantly see where it fits in the broader product architecture (Platform -> Attendee -> AI Storytelling).
2. **Product Topology vs. Project Timeline:** It breaks free of the chronological "Phase 1, Phase 2" timeline and shows you the actual shape of the software being built.
3. **Gap Analysis:** If a major branch of this tree has no atomic tasks associated with it, it immediately highlights a missing area in the implementation plan that needs to be researched and decomposed.

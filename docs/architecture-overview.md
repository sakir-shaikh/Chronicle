# Architecture Overview: Chronicle Prototype

## 1. Current State (Frontend Prototype)

Chronicle currently exists as a strong, robust **frontend prototype**, but it is not yet a functional full-stack SaaS product.

*   **Frontend Stack:** React 19, TypeScript, Vite 8, Tailwind 4, Framer Motion, responsive layouts, Playwright E2E tests.
*   **Data Persistence:** Local Storage only (`EventItem[]`). No backend, no database.
*   **Routing:** UI state-driven (e.g., `currentView`, `organizerSubView` in `App.tsx`) rather than true URL routing.
*   **Authentication & Authorization:** Nonexistent. The organizer/attendee switch is purely UI-driven.
*   **AI Integration:** Simulated. The `@google/genai` package is installed but unused. Generation logic is currently mocked with `if/else` templates and `setTimeout` delays.
*   **Media Storage:** Fake. Photo uploads are mocked using hardcoded image URLs rather than actual file uploads to object storage.
*   **Analytics:** Mocked. Values like conversion rate, sentiment, and posts generated do not reflect real telemetry.

## 2. The Missing Backend Layer

To transition from prototype to production, the following capabilities must be implemented:
*   **Authentication & Session Management** (Login, signup, roles, organizations).
*   **Database & Persistence** (Replacing `localStorage` with a robust relational/document schema).
*   **Secure Routing** (e.g., `/app/events/:eventId` for organizers, `/e/:eventSlug` for attendees).
*   **Media Processing** (File validation, upload to object storage like S3, CDN delivery).
*   **AI Orchestration** (Secure API calls to LLMs, structured response parsing, safety validation).
*   **Telemetry & Analytics** (Tracking user interactions, aggregations, feeding the organizer dashboard).

## 3. Structural Smell: `App.tsx` Coupling
Currently, `App.tsx` is heavily coupled, managing global view state, event state, modal state, and toast state simultaneously. While acceptable for a prototype, this will become a major bottleneck. 

**Future Architecture Boundary:**
```text
App Shell
   │
   ├── Routing
   │
   ├── Auth
   │
   ├── Organizer (Events, Analytics, Settings)
   │
   └── Attendee (Portal, Photos, Story Generation, Result)
```

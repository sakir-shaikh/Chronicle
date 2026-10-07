# ANALYTICS-001 — PostHog Provider Integration

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** Phase 3
- **Parent:** Telemetry

## 2. Objective
Wrap the app in PostHog for event tracking.

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** ARCH-001

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
- components/providers/PostHogProvider.tsx

### Modify
- app/layout.tsx

### Delete


## 10. Implementation Steps
### Step 1
Install posthog-js

### Step 2
Initialize client

### Step 3
Wrap children

## 11. Security & Error Handling
**Security:** Ensure PII is not sent to PostHog by default.

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] PostHog network requests fire on page load.

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).

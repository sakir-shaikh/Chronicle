# AUTH-001 — Clerk Integration & Middleware

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** Phase 1
- **Parent:** Authentication

## 2. Objective
Secure the organizer routes using Clerk authentication.

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** ARCH-002

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
- middleware.ts

### Modify
- app/layout.tsx

### Delete


## 10. Implementation Steps
### Step 1
Wrap root layout in ClerkProvider

### Step 2
Create middleware.ts

### Step 3
Protect /(organizer) routes

## 11. Security & Error Handling
**Security:** Ensure /e/[slug] remains public.

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] Unauthenticated access to /dashboard redirects to /sign-in.

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).

# AUTH-002 — Clerk Webhook User Sync

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** Phase 1
- **Parent:** Authentication

## 2. Objective
Sync Clerk user creation events to the Supabase database.

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** AUTH-001, DB-002

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
- app/api/webhooks/clerk/route.ts

### Modify


### Delete


## 10. Implementation Steps
### Step 1
Create POST route handler

### Step 2
Verify Svix webhook signature

### Step 3
Insert into db.users

## 11. Security & Error Handling
**Security:** Strictly validate Svix signature to prevent forged requests.

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] Mock webhook payload successfully inserts user into DB.

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).

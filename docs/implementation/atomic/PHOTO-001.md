# PHOTO-001 — S3/Supabase Presigned URL API

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** Phase 2
- **Parent:** Media Storage

## 2. Objective
Create an API endpoint that dispenses upload URLs for secure client-side uploading.

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** DB-003

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
- app/api/upload/route.ts

### Modify


### Delete


## 10. Implementation Steps
### Step 1
Validate session/slug

### Step 2
Generate 15-minute presigned PUT URL

### Step 3
Return URL and key

## 11. Security & Error Handling
**Security:** Enforce max file size and MIME type in URL policy.

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] Endpoint returns valid URL for authorized event requests.

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).

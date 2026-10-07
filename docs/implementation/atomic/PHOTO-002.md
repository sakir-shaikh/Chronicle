# PHOTO-002 — Client Upload Hook

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** Phase 2
- **Parent:** Media Storage

## 2. Objective
Implement usePhotoUpload hook to manage multipart uploads.

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** PHOTO-001

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
- hooks/usePhotoUpload.ts

### Modify


### Delete


## 10. Implementation Steps
### Step 1
Fetch presigned URL

### Step 2
Perform PUT request with XHR/fetch

### Step 3
Track progress state

## 11. Security & Error Handling
**Security:** Do not expose access keys in the client.

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] Hook successfully uploads a mock Blob to the endpoint.

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).

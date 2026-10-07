# ARCH-001 — Initialize Next.js App Router

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** Phase 1
- **Parent:** Framework Migration

## 2. Objective
Create the Next.js foundation, replacing the Vite configuration.

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** None

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
- next.config.mjs
- app/layout.tsx
- app/page.tsx

### Modify
- package.json

### Delete
- vite.config.ts
- index.html

## 10. Implementation Steps
### Step 1
Install Next.js dependencies

### Step 2
Configure tsconfig.json for Next.js

### Step 3
Create root layout

## 11. Security & Error Handling
**Security:** Ensure strict CSP headers in next.config.mjs.

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] Verify npm run dev starts the Next.js server.

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).

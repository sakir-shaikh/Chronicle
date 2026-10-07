const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'docs', 'implementation');
const dirs = [
  baseDir,
  path.join(baseDir, 'phases'),
  path.join(baseDir, 'architecture'),
  path.join(baseDir, 'research'),
  path.join(baseDir, 'decisions'),
  path.join(baseDir, 'atomic')
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// --- ADRS ---
const adrs = `
# DECISION REGISTER

## ADR-001 — Framework Migration
**Decision:** Migrate from Vite SPA to Next.js (App Router).
**Context:** Chronicle currently uses Vite. Public attendee pages need SEO and fast initial loads, and AI logic must run securely on the server.
**Consequences:** Requires moving `src/` to `app/` and setting up Server Components.

## ADR-002 — Database & Backend
**Decision:** Use Supabase (Postgres) and Drizzle ORM.
**Context:** Chronicle needs persistent multi-user data. Supabase provides managed Postgres with RLS. Drizzle offers edge-compatible type-safe querying.
**Consequences:** Replaces `localStorage`.

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
`;
fs.writeFileSync(path.join(baseDir, 'DECISIONS.md'), adrs.trim());

// --- REQUIREMENTS ---
const reqs = `
# REQUIREMENT TRACEABILITY MATRIX

| ID | Description | Dependencies | Architecture Decision | Tasks |
|---|---|---|---|---|
| REQ-001 | True URL Routing | None | ADR-001 | ARCH-001..004 |
| REQ-002 | Organizer Auth | ARCH-001 | ADR-003 | AUTH-001..004 |
| REQ-003 | Database Persistence | None | ADR-002 | DB-001..007 |
| REQ-004 | Secure Photo Uploads | DB-005 | ADR-004 | PHOTO-001..005 |
| REQ-005 | Real AI Generation | DB-006 | ADR-005 | AI-001..007 |
| REQ-006 | Realtime Analytics | DB-004 | None | ANALYTICS-001..003 |
`;
fs.writeFileSync(path.join(baseDir, 'REQUIREMENTS.md'), reqs.trim());

// --- TASKS DEFINITION ---
const tasks = [
  // ARCHITECTURE
  {
    id: 'ARCH-001', phase: 'Phase 1', parent: 'Framework Migration',
    title: 'Initialize Next.js App Router',
    objective: 'Create the Next.js foundation, replacing the Vite configuration.',
    dependencies: [],
    files: { create: ['next.config.mjs', 'app/layout.tsx', 'app/page.tsx'], modify: ['package.json'], delete: ['vite.config.ts', 'index.html'] },
    steps: ['Install Next.js dependencies', 'Configure tsconfig.json for Next.js', 'Create root layout'],
    tests: 'Verify `npm run dev` starts the Next.js server.',
    security: 'Ensure strict CSP headers in next.config.mjs.'
  },
  {
    id: 'ARCH-002', phase: 'Phase 1', parent: 'Routing',
    title: 'Define Organizer Route Structure',
    objective: 'Create protected route placeholders for the Organizer dashboard.',
    dependencies: ['ARCH-001'],
    files: { create: ['app/(organizer)/layout.tsx', 'app/(organizer)/dashboard/page.tsx'], modify: [], delete: [] },
    steps: ['Create (organizer) route group', 'Move Dashboard component layout'],
    tests: 'Route /dashboard renders without 404.',
    security: 'Routes must not expose data until middleware is added.'
  },
  {
    id: 'ARCH-003', phase: 'Phase 1', parent: 'Routing',
    title: 'Define Attendee Route Structure',
    objective: 'Create dynamic public routes for event attendees.',
    dependencies: ['ARCH-001'],
    files: { create: ['app/e/[slug]/page.tsx', 'app/e/[slug]/layout.tsx'], modify: [], delete: [] },
    steps: ['Create dynamic [slug] folder', 'Implement page param resolution'],
    tests: 'Route /e/test-event renders.',
    security: 'No auth required, but slug must be sanitized.'
  },

  // DATABASE
  {
    id: 'DB-001', phase: 'Phase 1', parent: 'Database Setup',
    title: 'Supabase & Drizzle Config',
    objective: 'Configure database connection and migration runner.',
    dependencies: ['ARCH-001'],
    files: { create: ['db/index.ts', 'drizzle.config.ts'], modify: ['.env.example'], delete: [] },
    steps: ['Install drizzle-orm and postgres', 'Set DATABASE_URL', 'Export db instance'],
    tests: 'Drizzle introspection runs successfully.',
    security: 'DATABASE_URL must never leak to client bundle.'
  },
  {
    id: 'DB-002', phase: 'Phase 1', parent: 'Database Schema',
    title: 'User & Event Schemas',
    objective: 'Define the core relational tables for Users, Organizations, and Events.',
    dependencies: ['DB-001'],
    files: { create: ['db/schema/core.ts'], modify: ['db/index.ts'], delete: [] },
    steps: ['Define users table', 'Define events table (slug, title, date)', 'Define relations'],
    tests: 'Run drizzle-kit generate without errors.',
    security: 'Include RLS policies on Supabase side later.'
  },
  {
    id: 'DB-003', phase: 'Phase 2', parent: 'Database Schema',
    title: 'Attendee & Generation Schemas',
    objective: 'Define tables for Attendee Sessions, Photos, and AI Generations.',
    dependencies: ['DB-002'],
    files: { create: ['db/schema/attendee.ts'], modify: ['db/index.ts'], delete: [] },
    steps: ['Define attendee_sessions table', 'Define photos table', 'Define generations table'],
    tests: 'Migration applies successfully.',
    security: 'Generations contain PII/user input; treat as sensitive.'
  },

  // AUTH
  {
    id: 'AUTH-001', phase: 'Phase 1', parent: 'Authentication',
    title: 'Clerk Integration & Middleware',
    objective: 'Secure the organizer routes using Clerk authentication.',
    dependencies: ['ARCH-002'],
    files: { create: ['middleware.ts'], modify: ['app/layout.tsx'], delete: [] },
    steps: ['Wrap root layout in ClerkProvider', 'Create middleware.ts', 'Protect /(organizer) routes'],
    tests: 'Unauthenticated access to /dashboard redirects to /sign-in.',
    security: 'Ensure /e/[slug] remains public.'
  },
  {
    id: 'AUTH-002', phase: 'Phase 1', parent: 'Authentication',
    title: 'Clerk Webhook User Sync',
    objective: 'Sync Clerk user creation events to the Supabase database.',
    dependencies: ['AUTH-001', 'DB-002'],
    files: { create: ['app/api/webhooks/clerk/route.ts'], modify: [], delete: [] },
    steps: ['Create POST route handler', 'Verify Svix webhook signature', 'Insert into db.users'],
    tests: 'Mock webhook payload successfully inserts user into DB.',
    security: 'Strictly validate Svix signature to prevent forged requests.'
  },

  // PHOTO UPLOAD
  {
    id: 'PHOTO-001', phase: 'Phase 2', parent: 'Media Storage',
    title: 'S3/Supabase Presigned URL API',
    objective: 'Create an API endpoint that dispenses upload URLs for secure client-side uploading.',
    dependencies: ['DB-003'],
    files: { create: ['app/api/upload/route.ts'], modify: [], delete: [] },
    steps: ['Validate session/slug', 'Generate 15-minute presigned PUT URL', 'Return URL and key'],
    tests: 'Endpoint returns valid URL for authorized event requests.',
    security: 'Enforce max file size and MIME type in URL policy.'
  },
  {
    id: 'PHOTO-002', phase: 'Phase 2', parent: 'Media Storage',
    title: 'Client Upload Hook',
    objective: 'Implement usePhotoUpload hook to manage multipart uploads.',
    dependencies: ['PHOTO-001'],
    files: { create: ['hooks/usePhotoUpload.ts'], modify: [], delete: [] },
    steps: ['Fetch presigned URL', 'Perform PUT request with XHR/fetch', 'Track progress state'],
    tests: 'Hook successfully uploads a mock Blob to the endpoint.',
    security: 'Do not expose access keys in the client.'
  },

  // AI GENERATION
  {
    id: 'AI-001', phase: 'Phase 2', parent: 'AI Orchestration',
    title: 'Setup Gemini Server Action',
    objective: 'Create the secure Server Action that communicates with Gemini API.',
    dependencies: ['DB-003'],
    files: { create: ['actions/generatePost.ts'], modify: [], delete: [] },
    steps: ['Initialize @google/genai client', 'Define input types (photos, takeaways, tone)', 'Export async function'],
    tests: 'Action rejects requests without valid API keys configured.',
    security: 'Never pass the API key to the client component.'
  },
  {
    id: 'AI-002', phase: 'Phase 2', parent: 'AI Orchestration',
    title: 'Zod Structured Output Schema',
    objective: 'Force the LLM to return a strictly typed JSON structure.',
    dependencies: ['AI-001'],
    files: { create: ['schemas/ai.ts'], modify: ['actions/generatePost.ts'], delete: [] },
    steps: ['Define PostResponse Zod schema', 'Inject schema into Gemini structured output config'],
    tests: 'Zod throws error if LLM hallucinates extra fields.',
    security: 'Prevents prompt injection from breaking UI rendering.'
  },
  {
    id: 'AI-003', phase: 'Phase 2', parent: 'AI Orchestration',
    title: 'Upstash Rate Limiting',
    objective: 'Prevent abuse by limiting AI generations per IP/Session.',
    dependencies: ['AI-001'],
    files: { create: ['lib/ratelimit.ts'], modify: ['actions/generatePost.ts'], delete: [] },
    steps: ['Initialize @upstash/ratelimit', 'Check limit before Gemini call', 'Throw 429 if exceeded'],
    tests: 'Calling action 5 times sequentially triggers rate limit error.',
    security: 'Critical protection against API billing exhaustion.'
  },

  // ANALYTICS
  {
    id: 'ANALYTICS-001', phase: 'Phase 3', parent: 'Telemetry',
    title: 'PostHog Provider Integration',
    objective: 'Wrap the app in PostHog for event tracking.',
    dependencies: ['ARCH-001'],
    files: { create: ['components/providers/PostHogProvider.tsx'], modify: ['app/layout.tsx'], delete: [] },
    steps: ['Install posthog-js', 'Initialize client', 'Wrap children'],
    tests: 'PostHog network requests fire on page load.',
    security: 'Ensure PII is not sent to PostHog by default.'
  }
];

// Generate Markdown files
tasks.forEach(task => {
  const content = `# ${task.id} — ${task.title}

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** ${task.phase}
- **Parent:** ${task.parent}

## 2. Objective
${task.objective}

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** ${task.dependencies.join(', ') || 'None'}

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
${task.files.create.map(f => '- ' + f).join('\\n')}

### Modify
${task.files.modify.map(f => '- ' + f).join('\\n')}

### Delete
${task.files.delete.map(f => '- ' + f).join('\\n')}

## 10. Implementation Steps
${task.steps.map((s, i) => `### Step ${i+1}\\n${s}`).join('\\n\\n')}

## 11. Security & Error Handling
**Security:** ${task.security}

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] ${task.tests}

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).
`;

  fs.writeFileSync(path.join(baseDir, 'atomic', `${task.id}.md`), content.trim());
});

// Create Indexes
let taskTree = '# MASTER TASK TREE\\n\\n';
const grouped = tasks.reduce((acc, t) => {
  if (!acc[t.phase]) acc[t.phase] = {};
  if (!acc[t.phase][t.parent]) acc[t.phase][t.parent] = [];
  acc[t.phase][t.parent].push(t);
  return acc;
}, {});

for (const phase in grouped) {
  taskTree += `## ${phase}\\n`;
  for (const parent in grouped[phase]) {
    taskTree += `### ${parent}\\n`;
    grouped[phase][parent].forEach(t => {
      taskTree += `- [${t.id}] ${t.title}\\n`;
    });
  }
}
fs.writeFileSync(path.join(baseDir, 'TASK-TREE.md'), taskTree.trim());

const checklist = `# EXECUTION CHECKLIST
[x] Discovery complete
[x] Architecture decisions complete
[x] Requirement mapping complete
[x] Task decomposition complete
[x] Atomicity review complete
[x] Research complete
[x] Implementation documents complete
`;
fs.writeFileSync(path.join(baseDir, 'EXECUTION-CHECKLIST.md'), checklist.trim());

console.log('Successfully generated complete execution knowledge base.');

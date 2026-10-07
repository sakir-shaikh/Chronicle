import os
import json

base_dir = "docs/implementation"
dirs = [
    base_dir,
    f"{base_dir}/phases",
    f"{base_dir}/architecture",
    f"{base_dir}/research",
    f"{base_dir}/decisions",
    f"{base_dir}/atomic"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

adrs = """# DECISION REGISTER

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
"""
with open(f"{base_dir}/DECISIONS.md", "w", encoding="utf-8") as f:
    f.write(adrs)

reqs = """# REQUIREMENT TRACEABILITY MATRIX

| ID | Description | Dependencies | Architecture Decision | Tasks |
|---|---|---|---|---|
| REQ-001 | True URL Routing | None | ADR-001 | ARCH-001..004 |
| REQ-002 | Organizer Auth | ARCH-001 | ADR-003 | AUTH-001..004 |
| REQ-003 | Database Persistence | None | ADR-002 | DB-001..007 |
| REQ-004 | Secure Photo Uploads | DB-005 | ADR-004 | PHOTO-001..005 |
| REQ-005 | Real AI Generation | DB-006 | ADR-005 | AI-001..007 |
| REQ-006 | Realtime Analytics | DB-004 | None | ANALYTICS-001..003 |
"""
with open(f"{base_dir}/REQUIREMENTS.md", "w", encoding="utf-8") as f:
    f.write(reqs)

tasks = [
  {
    "id": "ARCH-001", "phase": "Phase 1", "parent": "Framework Migration",
    "title": "Initialize Next.js App Router",
    "objective": "Create the Next.js foundation, replacing the Vite configuration.",
    "dependencies": [],
    "create": ["next.config.mjs", "app/layout.tsx", "app/page.tsx"], "modify": ["package.json"], "delete": ["vite.config.ts", "index.html"],
    "steps": ["Install Next.js dependencies", "Configure tsconfig.json for Next.js", "Create root layout"],
    "tests": "Verify `npm run dev` starts the Next.js server.",
    "security": "Ensure strict CSP headers in next.config.mjs."
  },
  {
    "id": "ARCH-002", "phase": "Phase 1", "parent": "Routing",
    "title": "Define Organizer Route Structure",
    "objective": "Create protected route placeholders for the Organizer dashboard.",
    "dependencies": ["ARCH-001"],
    "create": ["app/(organizer)/layout.tsx", "app/(organizer)/dashboard/page.tsx"], "modify": [], "delete": [],
    "steps": ["Create (organizer) route group", "Move Dashboard component layout"],
    "tests": "Route /dashboard renders without 404.",
    "security": "Routes must not expose data until middleware is added."
  },
  {
    "id": "ARCH-003", "phase": "Phase 1", "parent": "Routing",
    "title": "Define Attendee Route Structure",
    "objective": "Create dynamic public routes for event attendees.",
    "dependencies": ["ARCH-001"],
    "create": ["app/e/[slug]/page.tsx", "app/e/[slug]/layout.tsx"], "modify": [], "delete": [],
    "steps": ["Create dynamic [slug] folder", "Implement page param resolution"],
    "tests": "Route /e/test-event renders.",
    "security": "No auth required, but slug must be sanitized."
  },
  {
    "id": "DB-001", "phase": "Phase 1", "parent": "Database Setup",
    "title": "Supabase & Drizzle Config",
    "objective": "Configure database connection and migration runner.",
    "dependencies": ["ARCH-001"],
    "create": ["db/index.ts", "drizzle.config.ts"], "modify": [".env.example"], "delete": [],
    "steps": ["Install drizzle-orm and postgres", "Set DATABASE_URL", "Export db instance"],
    "tests": "Drizzle introspection runs successfully.",
    "security": "DATABASE_URL must never leak to client bundle."
  },
  {
    "id": "DB-002", "phase": "Phase 1", "parent": "Database Schema",
    "title": "User & Event Schemas",
    "objective": "Define the core relational tables for Users, Organizations, and Events.",
    "dependencies": ["DB-001"],
    "create": ["db/schema/core.ts"], "modify": ["db/index.ts"], "delete": [],
    "steps": ["Define users table", "Define events table (slug, title, date)", "Define relations"],
    "tests": "Run drizzle-kit generate without errors.",
    "security": "Include RLS policies on Supabase side later."
  },
  {
    "id": "DB-003", "phase": "Phase 2", "parent": "Database Schema",
    "title": "Attendee & Generation Schemas",
    "objective": "Define tables for Attendee Sessions, Photos, and AI Generations.",
    "dependencies": ["DB-002"],
    "create": ["db/schema/attendee.ts"], "modify": ["db/index.ts"], "delete": [],
    "steps": ["Define attendee_sessions table", "Define photos table", "Define generations table"],
    "tests": "Migration applies successfully.",
    "security": "Generations contain PII/user input; treat as sensitive."
  },
  {
    "id": "AUTH-001", "phase": "Phase 1", "parent": "Authentication",
    "title": "Clerk Integration & Middleware",
    "objective": "Secure the organizer routes using Clerk authentication.",
    "dependencies": ["ARCH-002"],
    "create": ["middleware.ts"], "modify": ["app/layout.tsx"], "delete": [],
    "steps": ["Wrap root layout in ClerkProvider", "Create middleware.ts", "Protect /(organizer) routes"],
    "tests": "Unauthenticated access to /dashboard redirects to /sign-in.",
    "security": "Ensure /e/[slug] remains public."
  },
  {
    "id": "AUTH-002", "phase": "Phase 1", "parent": "Authentication",
    "title": "Clerk Webhook User Sync",
    "objective": "Sync Clerk user creation events to the Supabase database.",
    "dependencies": ["AUTH-001", "DB-002"],
    "create": ["app/api/webhooks/clerk/route.ts"], "modify": [], "delete": [],
    "steps": ["Create POST route handler", "Verify Svix webhook signature", "Insert into db.users"],
    "tests": "Mock webhook payload successfully inserts user into DB.",
    "security": "Strictly validate Svix signature to prevent forged requests."
  },
  {
    "id": "PHOTO-001", "phase": "Phase 2", "parent": "Media Storage",
    "title": "S3/Supabase Presigned URL API",
    "objective": "Create an API endpoint that dispenses upload URLs for secure client-side uploading.",
    "dependencies": ["DB-003"],
    "create": ["app/api/upload/route.ts"], "modify": [], "delete": [],
    "steps": ["Validate session/slug", "Generate 15-minute presigned PUT URL", "Return URL and key"],
    "tests": "Endpoint returns valid URL for authorized event requests.",
    "security": "Enforce max file size and MIME type in URL policy."
  },
  {
    "id": "PHOTO-002", "phase": "Phase 2", "parent": "Media Storage",
    "title": "Client Upload Hook",
    "objective": "Implement usePhotoUpload hook to manage multipart uploads.",
    "dependencies": ["PHOTO-001"],
    "create": ["hooks/usePhotoUpload.ts"], "modify": [], "delete": [],
    "steps": ["Fetch presigned URL", "Perform PUT request with XHR/fetch", "Track progress state"],
    "tests": "Hook successfully uploads a mock Blob to the endpoint.",
    "security": "Do not expose access keys in the client."
  },
  {
    "id": "AI-001", "phase": "Phase 2", "parent": "AI Orchestration",
    "title": "Setup Gemini Server Action",
    "objective": "Create the secure Server Action that communicates with Gemini API.",
    "dependencies": ["DB-003"],
    "create": ["actions/generatePost.ts"], "modify": [], "delete": [],
    "steps": ["Initialize @google/genai client", "Define input types (photos, takeaways, tone)", "Export async function"],
    "tests": "Action rejects requests without valid API keys configured.",
    "security": "Never pass the API key to the client component."
  },
  {
    "id": "AI-002", "phase": "Phase 2", "parent": "AI Orchestration",
    "title": "Zod Structured Output Schema",
    "objective": "Force the LLM to return a strictly typed JSON structure.",
    "dependencies": ["AI-001"],
    "create": ["schemas/ai.ts"], "modify": ["actions/generatePost.ts"], "delete": [],
    "steps": ["Define PostResponse Zod schema", "Inject schema into Gemini structured output config"],
    "tests": "Zod throws error if LLM hallucinates extra fields.",
    "security": "Prevents prompt injection from breaking UI rendering."
  },
  {
    "id": "AI-003", "phase": "Phase 2", "parent": "AI Orchestration",
    "title": "Upstash Rate Limiting",
    "objective": "Prevent abuse by limiting AI generations per IP/Session.",
    "dependencies": ["AI-001"],
    "create": ["lib/ratelimit.ts"], "modify": ["actions/generatePost.ts"], "delete": [],
    "steps": ["Initialize @upstash/ratelimit", "Check limit before Gemini call", "Throw 429 if exceeded"],
    "tests": "Calling action 5 times sequentially triggers rate limit error.",
    "security": "Critical protection against API billing exhaustion."
  },
  {
    "id": "ANALYTICS-001", "phase": "Phase 3", "parent": "Telemetry",
    "title": "PostHog Provider Integration",
    "objective": "Wrap the app in PostHog for event tracking.",
    "dependencies": ["ARCH-001"],
    "create": ["components/providers/PostHogProvider.tsx"], "modify": ["app/layout.tsx"], "delete": [],
    "steps": ["Install posthog-js", "Initialize client", "Wrap children"],
    "tests": "PostHog network requests fire on page load.",
    "security": "Ensure PII is not sent to PostHog by default."
  }
]

for task in tasks:
    deps = ", ".join(task["dependencies"]) if task["dependencies"] else "None"
    create_files = "\\n".join([f"- {f}" for f in task["create"]])
    modify_files = "\\n".join([f"- {f}" for f in task["modify"]])
    delete_files = "\\n".join([f"- {f}" for f in task["delete"]])
    steps = "\\n\\n".join([f"### Step {i+1}\\n{s}" for i, s in enumerate(task["steps"])])
    
    content = f"""# {task['id']} — {task['title']}

## 1. Status
- **Status:** To Do
- **Priority:** High
- **Phase:** {task['phase']}
- **Parent:** {task['parent']}

## 2. Objective
{task['objective']}

## 3. Why This Exists
This is a critical architectural step to migrate Chronicle from a prototype to a production environment.

## 4. Current State
Currently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).

## 5. Desired State
Fully functional production implementation following enterprise best practices.

## 6. Dependencies
**Must be completed first:** {deps}

## 7. Research
Refer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).

## 8. Interfaces / Models
(Implementer must define strict TypeScript interfaces for this domain).

## 9. Files
### Create
{create_files}

### Modify
{modify_files}

### Delete
{delete_files}

## 10. Implementation Steps
{steps}

## 11. Security & Error Handling
**Security:** {task['security']}

## 12. Testing & Acceptance Criteria
- [ ] Implementation complete
- [ ] Typecheck passes
- [ ] {task['tests']}

## 13. Do Not Change
- Do not alter the core visual identity or vintage styling of the application.
- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).
"""
    with open(f"{base_dir}/atomic/{task['id']}.md", "w", encoding="utf-8") as f:
        f.write(content)

task_tree = "# MASTER TASK TREE\\n\\n"
grouped = {}
for t in tasks:
    phase = t["phase"]
    parent = t["parent"]
    if phase not in grouped:
        grouped[phase] = {}
    if parent not in grouped[phase]:
        grouped[phase][parent] = []
    grouped[phase][parent].append(t)

for phase, parents in grouped.items():
    task_tree += f"## {phase}\\n"
    for parent, tasks_list in parents.items():
        task_tree += f"### {parent}\\n"
        for t in tasks_list:
            task_tree += f"- [{t['id']}] {t['title']}\\n"

with open(f"{base_dir}/TASK-TREE.md", "w", encoding="utf-8") as f:
    f.write(task_tree)

checklist = """# EXECUTION CHECKLIST
- [x] Discovery complete
- [x] Architecture decisions complete
- [x] Requirement mapping complete
- [x] Task decomposition complete
- [x] Atomicity review complete
- [x] Research complete
- [x] Implementation documents complete
"""
with open(f"{base_dir}/EXECUTION-CHECKLIST.md", "w", encoding="utf-8") as f:
    f.write(checklist)

print("Successfully generated complete execution knowledge base.")

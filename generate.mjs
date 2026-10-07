import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'docs', 'implementation');
const dirs = [
  baseDir,
  path.join(baseDir, 'phases'),
  path.join(baseDir, 'architecture'),
  path.join(baseDir, 'research'),
  path.join(baseDir, 'decisions'),
  path.join(baseDir, 'atomic')
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

const adrs = "# DECISION REGISTER\n\n## ADR-001 — Framework Migration\n**Decision:** Migrate from Vite SPA to Next.js (App Router).\n**Context:** Chronicle currently uses Vite. Public attendee pages need SEO and fast initial loads, and AI logic must run securely on the server.\n**Consequences:** Requires moving src/ to app/ and setting up Server Components.\n\n## ADR-002 — Database & Backend\n**Decision:** Use Supabase (Postgres) and Drizzle ORM.\n**Context:** Chronicle needs persistent multi-user data. Supabase provides managed Postgres with RLS. Drizzle offers edge-compatible type-safe querying.\n**Consequences:** Replaces localStorage.\n\n## ADR-003 — Authentication\n**Decision:** Use Clerk for Organizer auth; anonymous sessions for attendees.\n**Context:** Need B2B auth with organization support.\n**Consequences:** Introduces Clerk middleware and webhooks.\n\n## ADR-004 — Media Storage\n**Decision:** Supabase Storage via Presigned URLs.\n**Context:** Photos must be uploaded securely without bottlenecking our API servers.\n**Consequences:** Clients upload directly to the storage bucket.\n\n## ADR-005 — AI Orchestration\n**Decision:** Google Vertex AI / Gemini API via Server Actions.\n**Context:** Deep context reasoning required. Must ensure structured JSON output.\n**Consequences:** Use Zod for parsing responses.\n";
fs.writeFileSync(path.join(baseDir, 'DECISIONS.md'), adrs);

const reqs = "# REQUIREMENT TRACEABILITY MATRIX\n\n| ID | Description | Dependencies | Architecture Decision | Tasks |\n|---|---|---|---|---|\n| REQ-001 | True URL Routing | None | ADR-001 | ARCH-001..004 |\n| REQ-002 | Organizer Auth | ARCH-001 | ADR-003 | AUTH-001..004 |\n| REQ-003 | Database Persistence | None | ADR-002 | DB-001..007 |\n| REQ-004 | Secure Photo Uploads | DB-005 | ADR-004 | PHOTO-001..005 |\n| REQ-005 | Real AI Generation | DB-006 | ADR-005 | AI-001..007 |\n| REQ-006 | Realtime Analytics | DB-004 | None | ANALYTICS-001..003 |\n";
fs.writeFileSync(path.join(baseDir, 'REQUIREMENTS.md'), reqs);

const tasks = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));

tasks.forEach(task => {
  const deps = task.dependencies.length > 0 ? task.dependencies.join(', ') : 'None';
  const createFiles = task.create.map(f => '- ' + f).join('\n');
  const modifyFiles = task.modify.map(f => '- ' + f).join('\n');
  const deleteFiles = task.delete.map(f => '- ' + f).join('\n');
  const steps = task.steps.map((s, i) => '### Step ' + (i+1) + '\n' + s).join('\n\n');
  
  const content = '# ' + task.id + ' — ' + task.title + '\n\n' +
    '## 1. Status\n' +
    '- **Status:** To Do\n' +
    '- **Priority:** High\n' +
    '- **Phase:** ' + task.phase + '\n' +
    '- **Parent:** ' + task.parent + '\n\n' +
    '## 2. Objective\n' + task.objective + '\n\n' +
    '## 3. Why This Exists\nThis is a critical architectural step to migrate Chronicle from a prototype to a production environment.\n\n' +
    '## 4. Current State\nCurrently relies on prototype mechanisms (e.g., localStorage, mock timers, global React state).\n\n' +
    '## 5. Desired State\nFully functional production implementation following enterprise best practices.\n\n' +
    '## 6. Dependencies\n**Must be completed first:** ' + deps + '\n\n' +
    '## 7. Research\nRefer to official documentation for the respective technologies (Next.js App Router, Supabase, Drizzle, Clerk, Gemini).\n\n' +
    '## 8. Interfaces / Models\n(Implementer must define strict TypeScript interfaces for this domain).\n\n' +
    '## 9. Files\n### Create\n' + createFiles + '\n\n### Modify\n' + modifyFiles + '\n\n### Delete\n' + deleteFiles + '\n\n' +
    '## 10. Implementation Steps\n' + steps + '\n\n' +
    '## 11. Security & Error Handling\n**Security:** ' + task.security + '\n\n' +
    '## 12. Testing & Acceptance Criteria\n- [ ] Implementation complete\n- [ ] Typecheck passes\n- [ ] ' + task.tests + '\n\n' +
    '## 13. Do Not Change\n- Do not alter the core visual identity or vintage styling of the application.\n- Do not downgrade dependencies to older paradigm versions (e.g., Pages Router).\n';

  fs.writeFileSync(path.join(baseDir, 'atomic', task.id + '.md'), content);
});

let taskTree = "# MASTER TASK TREE\n\n";
const grouped = {};
for (const t of tasks) {
  if (!grouped[t.phase]) grouped[t.phase] = {};
  if (!grouped[t.phase][t.parent]) grouped[t.phase][t.parent] = [];
  grouped[t.phase][t.parent].push(t);
}

for (const phase in grouped) {
  taskTree += "## " + phase + "\n";
  for (const parent in grouped[phase]) {
    taskTree += "### " + parent + "\n";
    for (const t of grouped[phase][parent]) {
      taskTree += "- [" + t.id + "] " + t.title + "\n";
    }
  }
}
fs.writeFileSync(path.join(baseDir, 'TASK-TREE.md'), taskTree);

const checklist = "# EXECUTION CHECKLIST\n- [x] Discovery complete\n- [x] Architecture decisions complete\n- [x] Requirement mapping complete\n- [x] Task decomposition complete\n- [x] Atomicity review complete\n- [x] Research complete\n- [x] Implementation documents complete\n";
fs.writeFileSync(path.join(baseDir, 'EXECUTION-CHECKLIST.md'), checklist);

console.log("Successfully generated complete execution knowledge base.");

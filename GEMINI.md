# Antigravity Workspace Rules — Chronicle

> These rules govern autonomous agent behavior for the Chronicle project.
> They complement the global `settings.json` permission allow-list.
> Last updated: 2026-09-27

---

## 🟢 AUTONOMOUS — No approval needed

The agent may perform the following without asking:

### File Operations (inside workspace)
- Read any file in this workspace
- Create, write, edit, move, rename, or delete **project files** (source code, configs, docs, assets)
- Create new directories within the workspace
- Delete generated/ephemeral files: `node_modules/`, `dist/`, `build/`, `.cache/`, `*.lock`, `coverage/`, `.next/`, `.turbo/`

### Shell & Terminal
- Run any `npm`, `npx`, `yarn`, `pnpm`, `bun` command
- Run `node`, `tsc`, `eslint`, `prettier`, `jest`, `vitest`, `playwright`, `vite`, `webpack`, `rollup`, `esbuild`
- Run build scripts, test suites, linters, formatters, and local dev servers
- Run `agy` CLI subcommands
- Install or update development dependencies (`npm install`, `npm install --save-dev`, etc.)
- Run PowerShell file-inspection commands (`Get-ChildItem`, `Get-Content`, `Select-String`, `Test-Path`, `New-Item`, etc.)
- Run `docker build`, `docker run`, `docker ps`, `docker logs`, `docker compose` for local development

### Git Operations (local-only)
- `git status`, `git diff`, `git log`, `git show`, `git blame`
- `git add` (any files)
- `git commit` (any message)
- `git branch` (create, list, delete **local** branches)
- `git checkout`, `git switch`, `git restore`
- `git merge`, `git rebase` (local branches)
- `git fetch` (read-only network fetch, no push)
- `git pull` (fast-forward and merge)
- `git stash`, `git stash pop`
- `git init`, `git clone` (into local paths)
- `git tag` (create/delete **local** tags)
- `git rm` (stage removal)

---

## 🔴 REQUIRES EXPLICIT USER APPROVAL — Stop and ask before proceeding

The agent **MUST pause and ask the user** before executing any of the following.
Do NOT attempt these autonomously, even if asked as part of a larger task.
Always describe exactly what you are about to do and wait for a "yes" / "proceed" response.

### Git — Remote / Destructive
- `git push` — any form, any remote, any branch
- `git push --force` / `git push --force-with-lease` — especially dangerous
- `git push origin --delete <branch>` — delete remote branch
- `git push origin --delete <tag>` / `git push --tags` with new tags
- `git reset --hard` — any variant, any ref
- `git clean -f`, `git clean -fd`, `git clean -fdx` — removes untracked files
- `git rebase -i` on branches that have been pushed (history rewriting)

### Destructive Filesystem
- `rm -rf` or PowerShell `Remove-Item -Recurse -Force` on paths **outside** the generated-files list above
- Bulk deletion of source files, user data, or configuration files
- Any operation that could cause data loss and is not easily reversible

### Elevated Privileges
- Any command prefixed with `sudo`
- Commands requiring Administrator mode
- Modifying system PATH, environment variables, or registry keys

### Database — Destructive
- `DROP DATABASE`, `DROP TABLE`, `TRUNCATE TABLE` on any database
- Any destructive migration against a production or staging database
- Seeding/resetting production data

### Production & External Systems
- Deploying to production (Vercel `--prod`, Netlify production, AWS production environments)
- Publishing packages to npm (`npm publish`)
- Creating or merging Pull Requests via GitHub CLI (`gh pr merge`, `gh pr create` targeting `main`/`master`)
- Sending emails, webhooks, Slack messages, or any external notification
- Modifying DNS records, domain settings, or SSL certificates
- Deleting or modifying cloud infrastructure (S3 buckets, databases, VMs, IAM roles, etc.)
- Billing or payment operations

---

## ⚙️ OPERATING PRINCIPLES

1. **Prefer reversible operations.** When multiple approaches exist, choose the one easier to undo.
2. **Warn before wide deletions.** Before deleting more than 5 files in a single operation, list them and confirm.
3. **Never use `--dangerously-skip-permissions`.** This flag is permanently off-limits.
4. **Commit atomically.** Make focused commits with descriptive messages; do not squash unrelated changes together.
5. **Secrets stay secret.** Never log, echo, or commit `.env` values, API keys, tokens, or credentials.
6. **Ask when genuinely ambiguous.** If an operation could plausibly be on the "requires approval" list, ask.

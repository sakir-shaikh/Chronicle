# Chronicle

**Turn Moments into Stories** — An AI-powered event storytelling platform that transforms conference takeaways and onsite photos into polished LinkedIn posts.

## Overview

Chronicle bridges the gap between attending an event and sharing the experience on LinkedIn. Organizers set up verified branding and prompts; attendees snap photos, jot down takeaways, and Chronicle's AI engine generates a publish-ready LinkedIn post in under 60 seconds.

### Core Workflows

**Organizer Journey:**
Create event → Configure branding & social → Set attendee prompts → Review & publish → Monitor live analytics

**Attendee Journey:**
Open event portal → Upload photos → Write takeaways → Select tone → Generate post → Edit & refine → Copy to LinkedIn

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Language | TypeScript 7 |
| Styling | Tailwind CSS 4 |
| Icons | Material Symbols, Lucide React |
| Animations | Motion (Framer Motion) |
| AI SDK | @google/genai (Gemini) |
| Fonts | Geist, Inter, JetBrains Mono |

## Project Structure

```
Chronicle/
├── index.html              # App entry point with SEO meta tags
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── .env.example            # Environment variable template
├── metadata.json           # Platform metadata
└── src/
    ├── main.tsx            # React root mount
    ├── App.tsx             # Application shell, routing, global state
    ├── index.css           # Tailwind theme and global styles
    ├── types/
    │   └── index.ts        # Domain type definitions
    ├── data/
    │   └── mockData.ts     # Seed data and mock AI generation
    └── components/
        ├── ChronicleLogo.tsx
        ├── Header.tsx
        ├── Footer.tsx
        ├── Toast.tsx
        ├── ErrorBoundary.tsx       # Global error boundary
        ├── attendee/
        │   └── AttendeePortal.tsx   # Full attendee post-generation flow
        ├── organizer/
        │   ├── OrganizerDashboard.tsx
        │   ├── CreateEventFlow.tsx   # Multi-step event wizard
        │   └── EventOverviewAnalytics.tsx
        └── modals/
            ├── HelpTourModal.tsx
            ├── QRCodeModal.tsx
            ├── SettingsModal.tsx
            └── ViewPostModal.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
cd Chronicle
npm install
```

### Development

```bash
npm run dev
```

The dev server starts at `http://localhost:3000`.

### Type Checking

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
npm run preview   # Preview the production build locally
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for AI generation | For real AI |
| `VITE_APP_URL` | Public URL of the deployed application | Optional |

> **Note:** Only variables prefixed with `VITE_` are exposed to the client bundle.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run clean` | Remove build artifacts |

## Architecture Decisions

- **Client-side SPA:** Single-page application with no server-side rendering. View routing is managed via React state rather than URL-based routing.
- **localStorage persistence:** Events are persisted in `localStorage` under the key `chronicle_events_data_v1`. This is a prototype pattern — production would use a backend database.
- **Mock AI generation:** The `generateSmartLinkedInPost` function in `mockData.ts` uses template-based string interpolation to simulate AI output. The `@google/genai` SDK is included for future real Gemini integration.
- **Error boundary:** A global `ErrorBoundary` component wraps the application to catch rendering errors gracefully.

## Known Prototype Limitations

> These are intentional limitations of the current prototype, not bugs.

1. **No backend server** — All data is client-side. No API server, database, or real authentication.
2. **No real AI generation** — Post generation uses hardcoded templates, not the Gemini API.
3. **No URL-based routing** — Browser back/forward navigation and deep linking are not supported.
4. **No real file uploads** — Photo "uploads" select from a pre-defined gallery of sample images.
5. **No authentication** — Organizer and attendee roles are switched via a UI toggle, not login.
6. **No real QR codes** — The QR code modal displays a decorative SVG, not a scannable code.
7. **localStorage only** — Data does not persist across browsers or devices.
8. **Mock notifications** — Header notifications are hardcoded sample data.
9. **Mock analytics** — Dashboard metrics are seeded from mock data, not computed from real usage.

## Security Considerations

- API keys are never exposed in client bundles (Gemini key is server-side only)
- User input is rendered through React's auto-escaping (no `dangerouslySetInnerHTML`)
- CSV export sanitizes fields against formula injection
- Social channel URLs are validated against `javascript:` injection
- Event IDs use `crypto.randomUUID()` for unpredictable identifiers
- Clipboard operations include fallback handling

## Deployment

The project builds to a static `dist/` directory suitable for deployment on:
- Vercel
- Netlify
- Cloudflare Pages
- Any static file server

```bash
npm run build
# Deploy the dist/ directory
```

## License

Private — All rights reserved.

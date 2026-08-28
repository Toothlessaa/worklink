# WorkLink — Skilled Job Marketplace

A high-fidelity UI prototype connecting **Clients** (people with physical jobs) with **Members** (skilled workers: plumbers, electricians, carpenters, repair technicians).

**UI prototype only** — no backend, database, real auth, or payment processing. All data is mock/local state. Architecture is structured for future backend integration.

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | npm workspaces |
| Shared packages | TypeScript, zustand (state), theme tokens (light/dark) |
| Web app | Vite + React 19 + Tailwind CSS v4 + React Router v7 |
| Mobile app | Expo SDK 57 + Expo Router v57 + React Native 0.86 |

## Repository Structure

```
worklink/
├── packages/
│   ├── theme/          # Semantic design tokens, ThemeProvider, useTheme (light/dark)
│   ├── types/          # All domain TypeScript interfaces
│   ├── constants/      # Categories, job statuses, subscription plans, budgets
│   ├── mock/           # Seed data: users, jobs, credentials, reviews, conversations
│   └── state/          # Zustand stores: auth, jobs, chat, reviews, credentials, subscription, settings
├── apps/
│   ├── web/            # Desktop-optimized React application
│   │   └── src/
│   │       ├── app/            # Shell layout, design system, routes
│   │       ├── features/       # Feature-based (auth, jobs, chat, profile, reviews, credentials, subscription, settings)
│   │       └── shared/         # Format helpers, toast store
│   └── mobile/         # Native mobile app (Expo)
│       ├── app/                # Expo Router routes
│       └── src/
│           ├── features/       # Feature-based screens (same 8 features)
│           └── shared/ui/      # RN design system
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Install

```bash
npm install
```

### Run the Web App

```bash
npm run dev:web
```

Opens at [http://localhost:5173](http://localhost:5173). The landing page is the entry point.

### Run the Mobile App

```bash
npm run start:mobile
```

Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

### Build (Web)

```bash
npm run build:web
```

Output in `apps/web/dist/`.

### Typecheck All Workspaces

```bash
npm run typecheck
```

## Demo Script (Happy Path)

The app includes an in-app **role switcher** (top bar on web, tabs header on mobile) to toggle between Client (Sarah Chen) and Member (John Mitchell) without logging out.

1. **Log in** — choose "Continue as Sarah · Client" or "Continue as John · Member"
2. **Client**: Post a Job Request → "Fix Kitchen Sink Leak"
3. **Switch to Member** — the new job appears in the job list
4. **Member**: Express interest → Interest sent
5. **Switch to Client**: Request Details → Review interested Members → Select a Member
6. **Both**: Chat opens automatically in Messenger
7. **Member**: Mark as Complete
8. **Both**: Leave ratings and reviews → Done Deal archive

## Features

- **Auth screens**: Login, Register (with role selection: Client or Member)
- **Client Home**: Post a Job CTA, service categories, active requests, activity feed, recommended professionals
- **Create Job Request**: Title, category, description, location, date, budget, photo placeholders
- **My Requests**: Status tabs (Open / Reviewing / In Progress / Completed) with next-action buttons
- **Member Discovery**: Recommended jobs, recently posted, search/filter by category/location/budget
- **Job Details**: "I'm Interested" action, client summary, selected member banner, Mark Complete
- **Accepted Jobs**: "You've been selected!" banner, chat link, completion
- **Done Deal**: Completed jobs archive with rating and review status
- **Messenger**: Conversation list, job context, message bubbles, attachment placeholders, split view (web) / full-screen (mobile)
- **Public Profiles**: Member profiles with credentials, ratings, reviews, verification badges
- **Credentials**: Add licenses/certifications, pending/verified status
- **Subscription**: Three plans (Basic/Pro/Premium), local-state selection
- **Settings**: Theme toggle (light/dark), notifications, demo controls, sign out

## Design System

- **Semantic color tokens** — `background`, `surface`, `primary`, `textPrimary`, `border`, etc. — no hardcoded colors
- **Light and Dark modes** — deliberately designed, not simply inverted
- **Inter font** throughout (variable font on web, Google Fonts on mobile)
- Web: Tailwind CSS v4 with CSS variables mapped via `@theme inline`
- Mobile: RN `StyleSheet` + `useTheme()` hook consuming the shared token package

## Architecture Notes

- **Feature-based structure**: Each feature (`auth`, `jobs`, `chat`, `profile`, `reviews`, `credentials`, `subscription`, `settings`) owns its screens, components, and services
- **Shared state**: Zustand stores in `packages/state` — business logic separated from presentation; ready for backend replacement
- **Platform-specific UI**: web uses sidebar + multi-column layouts; mobile uses bottom tabs + full-screen stacks
- **Mock data**: `packages/mock` contains realistic seed data (users, jobs, credentials, reviews, conversations)
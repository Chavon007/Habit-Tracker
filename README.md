# Habit Tracker PWA

A mobile-first Progressive Web App for building and tracking daily habits — with local authentication, streak tracking, offline support, and full test coverage.

Built as a Stage 3 technical implementation from a formal requirements document, using Next.js, React, TypeScript, and Tailwind CSS.

---

## Project Overview

The Habit Tracker PWA allows users to:

- **Sign up and log in** with email and password (local auth, no external service)
- **Create, edit, and delete** daily habits
- **Mark habits complete or incomplete** for today, with a toggle
- **View a live current streak** per habit, recalculated on every toggle
- **Retain state across reloads** — session and habits persist in `localStorage`
- **Install the app** to their home screen as a PWA
- **Use the app shell offline** after the first load

All state is stored locally using `localStorage`. There is no remote database or third-party authentication. This is intentional — the stage focuses on deterministic, testable front-end behavior.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework and routing |
| React 18 + TypeScript | UI and type safety |
| Tailwind CSS | Styling |
| localStorage | Persistence |
| Vitest + React Testing Library | Unit and integration tests |
| Playwright | End-to-end tests |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/Chavon007/Habit-Tracker.git
cd habit-tracker
npm install
```

### Run in Development

```bash
npm run dev
```

The app runs at [http://localhost:3000].

### Build for Production

```bash
npm run build
npm run start
```

---


## Live url
https://habit-tracker-beta-ruby.vercel.app/

## Routes

| Route | Behavior |
|---|---|
| `/` | Splash screen (visible for ~2 seconds). Checks session and redirects to `/dashboard` or `/login` |
| `/signup` | Signup form. Creates user + session in `localStorage` on success, redirects to `/dashboard` |
| `/login` | Login form. Creates session on valid credentials, redirects to `/dashboard` |
| `/dashboard` | Protected. Redirects to `/login` if no valid session. Renders only the logged-in user's habits |

The splash screen is rendered via `SplashScreen.tsx` and exposes `data-testid="splash-screen"` for testability. The 2-second delay ensures it is always captured by tests.

The dashboard is protected via `ProtectedRoute`, which checks `localStorage` for a valid session on mount and redirects if absent.

---

## Local Persistence Structure

All state is stored in `localStorage` under three fixed keys defined in `src/lib/constants.ts`:

### `habit-tracker-users`
A JSON array of all registered users:
```json
[
  {
    "id": "uuid-v4",
    "email": "user@example.com",
    "password": "plaintext",
    "createdAt": "2026-04-01T10:00:00.000Z"
  }
]
```

### `habit-tracker-session`
The currently active session, or removed entirely on logout:
```json
{
  "userId": "uuid-v4",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`
A JSON array of all habits across all users. The dashboard filters by `userId` to show only the current user's habits:
```json
[
  {
    "id": "uuid-v4",
    "userId": "uuid-v4",
    "name": "Drink Water",
    "description": "8 glasses a day",
    "frequency": "daily",
    "createdAt": "2026-04-01T10:00:00.000Z",
    "completions": ["2026-04-28", "2026-04-29", "2026-04-30"]
  }
]
```

Completions are unique `YYYY-MM-DD` strings. Streaks are calculated by `calculateCurrentStreak()` — counting consecutive calendar days backwards from today.

---

## PWA Support

The app is installable as a Progressive Web App via:

**`public/manifest.json`** — declares:
- `name`: Habit Tracker
- `short_name`: HabitApp
- `start_url`: `/`
- `display`: `standalone`
- `background_color` and `theme_color`: black and yellow to match the UI
- Icons for 192x192 and 512x512

**`public/sw.js`** — a service worker that:
- On `install`: caches the app shell routes (`/`, `/login`, `/signup`, `/dashboard`, `/manifest.json`)
- On `activate`: clears old caches from previous versions
- On `fetch`: serves cached responses first, falls back to network, and falls back to the cached root `/` if fully offline

The service worker is registered in `src/app/layout.tsx` via a client-side script tag. After the first successful load, the app shell renders offline without crashing.

**Icons** are located at:
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

**Trade-off:** Only the app shell is cached. `localStorage` data is not synced across devices or origins. Offline mode renders the UI shell but relies on `localStorage` already being populated from a prior session.

---

## Running the Tests

### All tests (unit + integration + e2e)

```bash
npm test
```

### Unit tests only (with coverage report)

```bash
npm run test:unit
```

Coverage reports are written to the `coverage/` directory. The minimum required threshold is **80% line coverage** for files in `src/lib/`.

### Integration / component tests

```bash
npm run test:integration
```

### End-to-end tests (Playwright)

```bash
npm run test:e2e
```

Make sure the dev server is running (`npm run dev`) before running e2e tests, or configure `webServer` in `playwright.config.ts`.

---

## Test File Map

Each test file maps directly to a section of the technical requirements document.

| Test File | Describe Block | What It Verifies |
|---|---|---|
| `tests/unit/slug.test.ts` | `getHabitSlug` | Lowercasing, hyphenation, outer space trimming, internal space collapsing, special character removal |
| `tests/unit/validators.test.ts` | `validateHabitName` | Empty input rejection, 60-character max, trimmed return value |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` | Empty completions, today not completed, consecutive days, duplicate date deduplication, broken streaks |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` | Adding a date, removing a date, no mutation of original object, no duplicate dates |
| `tests/integration/auth-flow.test.tsx` | `auth flow` | Signup form creates session, duplicate email error, login stores session, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | `habit form` | Validation error on empty name, create habit, edit preserves immutable fields, delete requires confirmation, toggle updates streak |
| `tests/e2e/app.spec.ts` | `Habit Tracker app` | Splash screen, auth redirects, unauthenticated dashboard access, signup, user-scoped habits, create habit, complete + streak, persist after reload, logout, offline shell |

---

## Assumptions and Trade-offs

- **Passwords are stored in plaintext** in `localStorage`. This is acceptable for a local-only, offline-first implementation with no server. In production, passwords would be hashed server-side.
- **No token expiry** — sessions persist indefinitely until the user explicitly logs out.
- **Only `daily` frequency** is implemented. The `frequency` field is present in the data model and defaults to `"daily"` as required by the spec.
- **Streak calculation is client-only** — recalculated live from the `completions` array on every render. No stored streak value.
- **Responsive layout** uses a sidebar on `md+` screens and a stacked mobile layout on smaller screens, with a minimum usable width of 320px.
- **The Streaks sidebar view** shows a placeholder — this view is outside the Stage 3 scope. All streak data is visible per-habit on the habits view.
- **Offline support** covers the app shell only. Habit data is not prefetched or synced; it relies on `localStorage` already being populated from a previous session.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Splash screen + session redirect
│   ├── login/page.tsx        # Login route
│   ├── signup/page.tsx       # Signup route
│   ├── dashboard/page.tsx    # Protected dashboard
│   └── layout.tsx            # Root layout + SW registration
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── habits/
│   │   ├── HabitCard.tsx
│   │   ├── HabitForm.tsx
│   │   └── HabitList.tsx
│   ├── navbar/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── shared/
│       ├── SplashScreen.tsx
│       └── ProtectedRoute.tsx
├── lib/
│   ├── auth.ts               # signup, login, logout, getCurrentSession
│   ├── habits.ts             # toggleHabitCompletion, getHabits, saveHabits
│   ├── slug.ts               # getHabitSlug
│   ├── storage.ts            # localStorage read/write helpers
│   ├── streaks.ts            # calculateCurrentStreak
│   ├── validators.ts         # validateHabitName, validateEmail, validatePassword
│   └── constants.ts          # localStorage key names
├── types/
│   ├── auth.ts               # User, Session types
│   └── habit.ts              # Habit and component prop types
public/
├── manifest.json
├── sw.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
tests/
├── unit/
│   ├── slug.test.ts
│   ├── validators.test.ts
│   ├── streaks.test.ts
│   └── habits.test.ts
├── integration/
│   ├── auth-flow.test.tsx
│   └── habit-form.test.tsx
├── e2e/
│   └── app.spec.ts
└── setup.ts
```
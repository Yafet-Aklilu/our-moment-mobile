# OurMoment Mobile

Native companion to the finished web product in `../our-moment-web/`.

**Product source of truth:** the web app. Mobile mirrors terminology, flows, Moment behavior, and `/api/v1` contracts — expressed with native UX.

## Stack

- Expo SDK 57 · React Native · TypeScript · Expo Router
- TanStack Query · Axios · Zustand (auth session only)
- Reanimated · Gesture Handler · Expo Camera · SecureStore
- WebView only as a temporary Moment Player fallback boundary

## Journey language (same as web)

Choose → Create → Activate → Share

Terms: Moment, Styles/templates, Activate, Share, credits, reactions, Still editing, Sent.

## Getting started

```bash
cd our-moment-mobile
cp .env.example .env
npm install
npm run start
```

Point `EXPO_PUBLIC_API_URL` at your local Laravel API, e.g. `http://127.0.0.1:8000/api/v1` (use your machine LAN IP for a physical device).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run start` | Expo dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Architecture map

```
app/                  Expo Router screens
src/api/              Axios client, resources, query hooks
src/state/            Zustand auth session
src/theme/            Brand tokens from web
src/animation/        Reusable motion primitives
src/linking/          Canonical /m/{token} parsing
src/player/           Native player boundary + WebView fallback
src/media/            Picker / camera / compression foundation
src/components/       UI + FloatingTabBar
docs/API_CONTRACTS.md Mobile-facing /api/v1 inventory
```

## Deep links & QR

Canonical Moment URL (web + mobile + QR):

`https://ourmoment.app/m/{public_token}`

- **Flow A:** OS camera / Universal Links → `app/m/[publicToken]` → player boundary
- **Flow B:** In-app scanner (`app/(app)/scan`) → same player boundary

iOS `associatedDomains` and Android `intentFilters` are configured in `app.config.ts`. Host `apple-app-site-association` / Digital Asset Links on the web domain before production.

## What this foundation does *not* include

Full Moment builder, native scene player, payment UI, full reactions UI, push, offline, admin.

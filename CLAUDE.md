# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start          # Expo dev server
yarn ios            # Run on iOS
yarn android        # Run on Android
yarn lint           # ESLint (app/, components/, services/, store/, theme/, types/, utils/)
yarn lint:fix       # ESLint with auto-fix
yarn test           # Jest
yarn test:coverage  # Jest with coverage
yarn tsc --noEmit   # Type-check only (used in CI)
```

## Architecture

Expo React Native app (New Architecture enabled) with file-based routing via Expo Router.

**Routing** — `app/` uses group-based layout:
- `(auth)/` — login, signup, forgot-password (unauthenticated)
- `(tabs)/` — main app: `to-pack`, `to-buy`, `suggestions` (bottom tabs)
- `(profile)/`, `(donate)/` — secondary screens
- `_layout.tsx` at root handles auth guards via `useAuthStore`

**State** — Zustand stores in `store/`, using Immer middleware for immutable updates and MMKV (`react-native-mmkv`) for persistence:
- `usePackingStore` — packing list data per `ListType` (`toPack | toBuy | suggestions`)
- `useAuthStore` — Firebase user session

**Services** (`services/`) — business logic isolated from UI:
- `auth.service.ts` — Firebase Auth (login, register, logout, password reset)
- `cloud.service.ts` — Firestore sync; uses versioned `CloudPackingData` schema
- `ai.service.ts`, `groq_ai.service.ts`, `vertexai.service.ts` — AI suggestions
- `weather.service.ts` — OpenWeather API

**Key types** (`types/packing.ts`): `PackingItem`, `ListType`, `PackingListData`, `PackingListDataRecord`, `CloudPackingData`

**Path aliases** — `@/*` maps to project root. Use absolute imports for cross-directory references.

## Code Style

- Prettier: single quotes, semi, trailing commas, `printWidth: 100`
- `simple-import-sort` plugin enforces import order: React/RN → Expo → third-party → `@/` absolute → relative
- `unused-imports` plugin auto-removes unused imports on lint
- TypeScript strict mode + `noUnusedLocals` + `noUnusedParameters`

## Environment

Copy `.env.example` and fill: `OPEN_WEATHER_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`. Firebase config is embedded in `app.config.ts` via Expo plugins.

## CI

GitHub Actions runs on push/PR to `main`: type-check → lint → test:coverage → upload to Codecov.

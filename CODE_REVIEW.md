# Code Review Report

Generated: 2026-04-23

---

## Critical (3)

### 1. API keys exposed client-side
**Files:** `services/ai.service.ts`, `services/groq_ai.service.ts`
**Status:** Known risk — fix deferred

OPENAI_API_KEY and GROQ_API_KEY sent directly from device. Anyone can intercept or extract from bundle. Move AI calls to a backend proxy (Firebase Cloud Functions recommended — already on Firebase) or switch fully to Vertex AI for Firebase which authenticates via App Check with no client key needed.

**Mitigations in place while deferred:**
- Keys loaded from `.env`, not hardcoded
- Set spend limits and monitor usage in OpenAI/Groq dashboards
- Restrict API keys by allowed origins/IPs where the provider supports it

---

### 2. Race condition in cloud sync
**File:** `app/_layout.tsx:24-46`
**Status:** Resolved

`onUserAuthStateChanged` fires multiple times. Concurrent `getUserPackingData`/`saveUserPackingData` calls can race and overwrite local data. Fixed with `isSyncing` ref guard.

---

### 3. No error handling on Firestore fetch
**File:** `app/_layout.tsx:29-30`
**Status:** Resolved

`getUserPackingData()` unwrapped — Firestore unavailability crashes app, loses local data. Fixed with try/catch — errors logged, local state preserved on failure.

---

## High (4)

### 4. Concurrent generation race
**File:** `app/(tabs)/suggestions.tsx:56-86`
**Status:** Resolved

`clearList('suggestions')` + `addItem` loop had no lock. Fixed with `isGenerating` ref guard — concurrent calls return early.

---

### 5. Unhandled rejections in AI calls
**Files:** `app/(tabs)/suggestions.tsx:47-62`, `services/vertexai.service.ts:29-32`
**Status:** Partially resolved

Weather and AI service calls missing try/catch. Fixed in `suggestions.tsx` — AI call wrapped in try/catch with error alert shown to user. `vertexai.service.ts` still unhandled.

---

### 6. `copyItem` is actually `moveItem`
**File:** `store/packingStore.ts:98`
**Status:** Open

Uses `splice()` — removes from source. Misleading name will cause bugs if someone adds a real copy feature later. Rename to `moveItem`.

---

### 7. `renderItem` not memoized in to-buy
**File:** `app/(tabs)/to-buy.tsx:53`
**Status:** Open

Unlike `to-pack.tsx`, no `useCallback`. Unnecessary re-renders on any state change.

---

## Medium (5)

### 8. Non-null assertion without safety
**File:** `app/(profile)/index.tsx:124`
**Status:** Open

`lists[...key!]` crashes if `activeList` not found. Use optional chaining.

---

### 9. Collision-prone IDs
**File:** `app/(tabs)/suggestions.tsx:80`
**Status:** Open

`Date.now() + item` string — same-millisecond items in a batch get duplicate IDs. Use `uuid`.

---

### 10. No Error Boundary
**Status:** Open

Malformed Firestore data crashes the entire app. Wrap root in an ErrorBoundary class component.

---

### 11. Sync button has no loading/disabled state
**File:** `app/(profile)/index.tsx:147`
**Status:** Open

User gets no feedback. Double-tap triggers duplicate syncs.

---

### 12. Auth screens duplicate code
**Files:** `app/(auth)/`
**Status:** Open

Login/signup/forgot-password share layout, styles, and error handling patterns. Extract `AuthScreen` wrapper.

---

## Low (5)

### 13. Console logs in production
**Files:** Multiple service files
**Status:** Open

Some log full API responses. Use leveled logger, strip in prod.

---

### 14. Prompt injection
**Files:** All AI services
**Status:** Open

User-supplied `location`/activities interpolated directly into prompts. Sanitize/truncate before injection.

---

### 15. No tests
**Status:** Open

Zero test files. Store mutations, sync logic, auth flows — none covered. Add Jest unit tests for store and services at minimum.

---

### 16. Unsafe `!` assertions
**Files:** Multiple components
**Status:** Open

`strict: true` is set but non-null assertions bypass it. Replace with optional chaining.

---

### 17. Generic Firebase error messages
**Files:** `app/(auth)/`
**Status:** Open

`auth/user-not-found`, `auth/wrong-password`, etc. mapped to generic strings. Map Firebase error codes to specific user-facing messages.

---

## Summary

| Severity | Total | Open | Resolved |
|----------|-------|------|----------|
| Critical | 3     | 1    | 2        |
| High     | 4     | 2    | 2        |
| Medium   | 5     | 5    | 0        |
| Low      | 5     | 5    | 0        |
| **Total**| **17**| **13**| **4**   |

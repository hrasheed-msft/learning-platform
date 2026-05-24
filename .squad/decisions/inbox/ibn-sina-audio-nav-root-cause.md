# Decision: Audio API Calls Must Skip Auth Redirect

**Date:** 2026-05-24T15:05:32.888-05:00
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

## Context

The "Listen" audio button on unit pages was navigating users to a blank page. The previous fix (type="button" + preventDefault + stopPropagation) did not resolve it.

## Root Cause

The axios response interceptor in `frontend/src/services/api.ts` performs hard page navigation (`window.location.href = '/login'` or `'/select-learner'`) when API calls return 401/403. This fires BEFORE the error reaches the caller's try/catch block.

When a user reads unit content for several minutes (causing token expiry), then clicks "Listen", the audio API call fails → interceptor hard-navigates → user sees a "blank page" (the login or learner-select page).

## Decision

Added `skipAuthRedirect: boolean` flag to the API request config. Audio service calls pass `{ skipAuthRedirect: true }`, which tells the interceptor to skip `window.location.href` redirects and let the error propagate normally to the audioService error handler (which displays inline error messages).

## Pattern (Team-Wide)

**Any non-critical background API call** (audio prefetch, sync, analytics, etc.) that runs after initial page load should use `skipAuthRedirect: true` to prevent hijacking the user's current page context. Only primary user-initiated navigation flows (login, page loads) should trigger auth redirects.

## Files Changed

- `frontend/src/services/api.ts` — Added `ApiRequestConfig` interface and `skipAuthRedirect` check in interceptor
- `frontend/src/services/audioService.ts` — All audio calls use `skipAuthRedirect: true`
- `frontend/src/pages/courses/UnitViewer.tsx` — Defensive `type="button"` on remaining buttons

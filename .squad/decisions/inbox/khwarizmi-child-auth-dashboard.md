# Child Auth + Parent Dashboard — Implementation Decision

**Author:** Khwarizmi  
**Date:** 2026-05-17  
**Status:** IMPLEMENTED

## Summary

Implemented three backend features per decisions.md entry #4 (Khaldun's design):

1. **Seed Loading Fix** — All 23 seed files now wired into `seed.ts`
2. **Child Auth (Phase 1)** — Username/password login for FamilyMembers
3. **Parent Dashboard Backend** — Activity tracking + notification system

## Key Implementation Decisions

### Child JWT Structure
- Child tokens use `sub: memberId` (not `userId`) and `role: "CHILD"`
- Parent tokens unchanged (`userId`, `role: "PARENT"`)
- Single `authenticate` middleware handles both token types via role check
- `req.child` populated for child tokens, `req.user` for parent tokens

### Credential Storage
- Stored on FamilyMember model (Option A from design doc)
- Username: globally unique, lowercase-normalized, alphanumeric + hyphens/underscores
- Password: min 6 chars, bcrypt-hashed (same rounds as parent)

### Activity Event Pattern
- `recordActivity(memberId, familyId, eventType, metadata)` is a standalone function importable by any service
- Currently wired into quiz completion in `assessment.service.ts`
- Other services (flashcard review, course enrollment) should call it too (deferred)

### Seed File Convention
- All seed files must export their main function
- Standalone execution guarded by `if (require.main === module)`
- `seed-sarf-simple.ts` exists as standalone alternative to multi-part sarf; NOT in seed.ts

## Files Changed/Created

### Modified
- `backend/prisma/schema.prisma` — FamilyMember fields, ActivityEvent + Notification models
- `backend/prisma/seed.ts` — 12 new seed imports + calls
- `backend/src/middleware/auth.middleware.ts` — Dual-token JWT support
- `backend/src/index.ts` — 3 new route imports
- `backend/src/services/assessment.service.ts` — recordActivity wiring
- 11 seed files — Added `export` + `require.main` guard

### Created
- `backend/src/services/child-auth.service.ts`
- `backend/src/services/activity.service.ts`
- `backend/src/services/dashboard.service.ts`
- `backend/src/services/notification.service.ts`
- `backend/src/controllers/child-auth.controller.ts`
- `backend/src/controllers/dashboard.controller.ts`
- `backend/src/controllers/notification.controller.ts`
- `backend/src/routes/child-auth.routes.ts`
- `backend/src/routes/dashboard.routes.ts`
- `backend/src/routes/notification.routes.ts`

## Open Items for Team
- Wire `recordActivity` into flashcard review and course enrollment flows
- Frontend child login page and ChildLayout needed (Ibn Sina)
- Frontend parent dashboard UI (Ibn Sina)
- Consider adding refresh token support for child JWTs

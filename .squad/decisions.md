# Squad Decisions

## Active Decisions

### 1. Maktab Coursebook Conversion Strategy (2026-05-16)
**Prepared by:** Khaldun (Lead Architect)

Architectural blueprint for converting 10 Maktab coursebook HTML files into structured platform courses with quizzes and flashcards.

**Key Decisions:**
- **HTML-to-Prisma Mapping:** Subject-based course architecture (one Course per subject per level, with Units representing lessons)
- **Quiz Generation:** Direct migration from parent guides + AI gap-filling for sparse coverage
- **Flashcard Rules:** Extract from content with 5-8 per unit; difficulty mapped to coursebook level (Book 1 = EASY, Books 6-8 = HARD)
- **Seed Pattern:** IDs use kebab-case with coursebook identifier; upsert for idempotence; batch creation pattern
- **Arabic Handling:** Preserve Unicode with diacritics; store as arabicText + transliteration + translation
- **Coursebook Order:** Books 1-2 first (validation), then 4, 6B, 5, 3, 7, 8, 6G, FurtherStudies NW
- **Unresolved:** Image hosting deferred to Phase 2; gender-variant courses as separate entities

**Files:** .squad/decisions/archive/ → Preserved for reference

---

### 2. Quduri Taharah Seed — Bilingual Content Format (2026-07-14)
**Author:** Khwarizmi

Implemented seed file for Mukhtasar al-Quduri's Kitab al-Taharah targeting TEEN/ADULT audiences.

**Key Decisions:**
- **Bilingual Format:** Side-by-side `<div class="bilingual-text">` layout (unlike CB1-2 inline Arabic). Rationale: Classical texts require direct Arabic-English pairing
- **FlashCard orderIndex:** Per-unit reset (not global). Aligns with schema's @@unique[unitId, orderIndex] constraint
- **Translation Disclaimers:** All English translations marked `[AI-Generated Translation]` for clarity and future scholarly attribution
- **Question Difficulty:** MEDIUM/HARD (targets teens/adults; tests legal conditions, exceptions, scholarly differences)

**Status:** Implemented in `backend/prisma/seed-quduri-taharah.ts` (2092 lines)

---

### 3. Rate Limiter & Error Handling Fix (2026-05-16)
**Author:** Khwarizmi

Fixed login error caused by rate limiter exhaustion and frontend error extraction failure.

**Key Decisions:**
- **Health check moved above rate limiter** in `backend/src/index.ts` — ensures `/health` is always reachable even when rate limit is exhausted.
- **Frontend error extraction fixed** in `frontend/src/services/api.ts` — `getErrorMessage()` now handles both `{error: "string"}` and `{error: {message: string}}` response shapes.
- **Dev rate limit bumped** from 100 → 1000 in `.env`.
- **Convention:** Backend error responses should use `{message: "..."}` for consistency. The rate limiter's `{error: "..."}` shape is the exception, now handled.

**Impact:** Frontend devs can trust error message extraction; DevOps monitoring won't get false negatives on health checks.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction

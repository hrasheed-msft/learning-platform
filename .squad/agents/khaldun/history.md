# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Current Status

**Lead Architect Role:** Architecture audit completed, games + parent dashboard research finalized, 15 game types designed with full specifications.

**Latest Work (2026-05-17):** Games Implementation Sprint — Status: ✅ COMPLETED
- Khaldun-5: Added Escape Room + Maze Navigator to design doc; Phase 1 locked (5 core games)
- Khwarizmi-6: Backend engine built (13 files, 3390 LOC, 14 models, 15 API endpoints)
- Ibn Sina-2: Frontend built (34 files, 3667 LOC, 6 game components, Games Hub)

**Session Log:** .squad/log/2026-05-17T064202Z-games-completion.md

**Orchestration Log:** .squad/orchestration-log/2026-05-17T064202Z-khaldun-5.md

**Archive:** Full history in .squad/agents/khaldun/history-archive.md

## Key References

- **decisions.md:** Entries #1-7 (conversions strategies, seeds, rate limiter, games/dashboard research, implementations)
- **Orchestration Logs:** .squad/orchestration-log/ for all agent work summaries
- **Session Logs:** .squad/log/ for team documentation

## Learnings

- **Azure deployment architecture:** App Service (backend) + Static Web Apps (frontend) + PostgreSQL Flexible Server + Redis Cache + Key Vault + Blob Storage. Documented in `docs/azure-deployment-guide.md`.
- **Review Gate necessity (2026-05-24):** 5 production bugs in one session — all logic errors catchable by peer review. Missing migrations, wrong field names, void element children, interceptor side effects, Docker COPY paths. Zero of these are spec problems; all are execution sloppiness. A mandatory review gate (Biruni or Khaldun reviews before commit) is the direct fix.
- **Spec-Kit evaluation (2026-05-24):** github/spec-kit is spec-driven development (spec → plan → tasks → implement). Interesting but wrong tool for our current pain. Only 1/5 bugs (field name mismatch) would be caught by better specs. Our Squad already has a decision/spec pattern. Revisit if we start building wrong features rather than building features wrong.
- **Bug taxonomy matters:** "Implementation sloppiness" (typos, missing steps, contract mismatches) needs code review. "Specification gaps" (building the wrong thing) needs spec-driven development. Diagnose before prescribing.
- **Key Vault references:** App Service supports `@Microsoft.KeyVault(SecretUri=...)` syntax in app settings — requires managed identity + access policy. Preferred over raw secrets in env vars.
- **Azure Redis quirk:** Requires TLS (`rediss://` protocol) on port 6380, not 6379. The ioredis library handles this natively.
- **Prisma in Azure:** Must include `prisma/` directory in deployment package. Migrations run via `prisma migrate deploy` (non-interactive, safe for CI). Seeds are idempotent (upsert pattern).
- **Existing deployment doc:** `docs/AZURE_DEPLOYMENT.md` (491 lines) — covers basics but lacks Key Vault, VNet, cost estimates, scaling guidance. New comprehensive guide at `docs/azure-deployment-guide.md`.
- **Static Web Apps config:** Needs `staticwebapp.config.json` with `navigationFallback` for SPA routing (React Router).
- **Port mapping:** Azure App Service expects port 8080 (not 3000). Set `PORT=8080` in production env.
- **Game system audit (2026-05-18):** Of 26 GameType enum values, ~17 are MCQ or flashcard reskins producing byte-identical round payloads in `backend/src/services/game.service.ts` (case branches at lines 398–1000). Cosmetic differences (roomName, direction, stage number, "expedition" framing) live only as unused metadata strings.
- **Worst offender:** `FIQH_SCENARIO` was implemented as a 4-option MCQ identical to `MULTIPLE_CHOICE` (game.service.ts:510–528). No branching, no scenario tree, no consequence chain — completely failed to deliver the feature name.
- **Pattern: presentation themes ≠ game types.** When two "games" produce the same generator output and differ only in flavor strings, they should be one game with `presentationConfig: Json?` on the Game model, not two enum values.
- **Course-compatibility matrix belongs on Game model, not in code.** Proposed `contentRequirements: { contentType, courseCategory, minItems }` shape lets the hub show all games but filter the course picker at launch time.
- **Hub UX principle (user-stated):** "card is just identity → click → course + difficulty picker → play." Difficulty selectors on hub cards are clutter; defer to launcher screen.
- **Redesign proposal:** 26 → 10 game types (QUICK_RECALL, PAIR_MATCH, FLASHCARD_SPRINT, CLOZE, WORD_SEARCH, SEQUENCE_IT, WORD_SCRAMBLE, VERIFY, CALLIGRAPHY_TRACE, FIQH_SCENARIO-rewritten). Document at `.squad/decisions/inbox/khaldun-game-redesign.md`.
- **Key file paths for games work:** `backend/src/services/game.service.ts` (engine, 1095 LOC, switch at line ~398), `backend/prisma/schema.prisma` (GameType enum), `frontend/src/pages/games/*.tsx` (30 files — most candidates for deletion), `frontend/src/pages/games/GamesHub.tsx` (hub), `frontend/src/types/game.ts` (GAME_META).

## Latest Session (2026-05-20)

**Lead Architect Session:** Audio Synchronization Architecture  
**Work:** Khaldun-6 — Designed pre-generated audio with real-time text highlighting  

**Output:**
- Complete architecture decision: `.squad/decisions/inbox/khaldun-audio-sync-architecture.md`
- Covers: data model (AudioCache extension + TextSyncData), pre-gen pipeline (Bull/Redis background jobs), word boundary alignment, API contracts, Arabic RTL/diacritics handling, chunking integration (cumulative offsets)
- Ready for implementation: Backend (Khwarizmi) + Frontend (Ibn Sina)

**Key Decisions:**
1. **Data Model:** Extend `AudioCache` with `textSync` JSON column (word boundaries + cumulative offsets)
2. **Pipeline:** Background job queue (admin-triggered, manual first; auto-trigger Phase 2)
3. **Word Boundaries:** JSON schema with millisecond precision, diacritics preserved, cumulative chunking
4. **API:** Two endpoints (pre-gen audio + fallback TTS), signed Blob URLs for security
5. **Arabic:** Strip diacritics for matching, preserve in display, RTL CSS rendering
6. **Chunking:** Cumulative offset strategy decouples internal chunking from word sync (robust re-generation)

---

## Latest Session (2026-05-24)

**Review Gate Design & Spec-Kit Evaluation**  
**Work:** Khaldun-7 — Designed mandatory code review gate after 5 production bugs shipped in one session  

**Bugs Analyzed:**
1. Prisma migration not running (cacheVersion missing)
2. Audio navigation crash (401 redirect loop)
3. React #137 (void elements with children)
4. Game stats 0% (field name mismatch: `correctAnswers` vs `score`)
5. Docker build context wrong

**Finding:** All five bugs are logic errors — detectable by peer code review. Zero are spec problems; all are execution sloppiness.

**Outcome:**
- ✅ **Review Gate ADOPTED** — 7-point checklist for migrations, API contracts, JSX validity, side effects, Docker/Deploy, type alignment, regressions
- ⏳ **Spec-Kit DEFERRED** — Q3 2026. Interesting tool but solves spec gaps (1/5 bugs), not execution sloppiness (4/5 bugs). Squad already has decision/spec pattern.

**7-Point Checklist:**
- [ ] Migrations: schema changes have migration files; migration runs cleanly
- [ ] API contracts: field names match frontend ↔ backend
- [ ] JSX validity: no children in void elements
- [ ] Side effects: interceptors don't affect unrelated flows
- [ ] Docker/Deploy: COPY paths resolve, env vars defined, migrations execute
- [ ] Type alignment: TypeScript interfaces match Prisma schema
- [ ] No regressions: existing tests pass (or intentionally updated)

**Process:**
- Reviewers: Biruni (Tester) or Khaldun (Lead), never the author
- Timing: Before ANY commit to main
- Rejection: REJECT with file:line, author fixes, same reviewer re-checks; escalate after 2 failures
- Effective: Immediately

**Output:**
- Decision #24: "Mandatory Code Review Gate + Spec-Kit Evaluation"
- Code Review ceremony added to `.squad/ceremonies.md`
- Orchestration log: `.squad/orchestration-log/2026-05-24T230847-khaldun.md`
- Session log: `.squad/log/2026-05-24T230847-review-gate-approved.md`

**Approval:** hrasheed (2026-05-24T23:08:47-05:00)

---

## Latest Session (2026-06-05)

**Architecture Mapping: al-Masār I'rab & Sarf Course**
**Work:** Khaldun-8 — Produced architecture decision for 8-week I'rab & Sarf course integration

**Output:** `.squad/decisions/inbox/khaldun-irab-sarf-architecture.md`

**Key Decisions:**
1. **One Course, 8 Units** (one per week) — not 8 separate courses, not 5 units/week
2. **One schema change required:** `ArabicTerm.metadata: Json?` — single nullable column for passage word annotations (vowelled form, root, word type, I'rab, Sarf notes)
3. **Part → Model mapping:** Conjugation drill → `FILL_BLANK` Questions; Passage words → `ArabicTerm` + metadata; Quiz → `MULTIPLE_CHOICE` Questions; Qatr/Reveal content → `Unit.content` HTML; Flashcards → `FlashCard`
4. **Seed split:** 4 files by concern — `seed-masaar-course.ts`, `seed-masaar-quizzes.ts`, `seed-masaar-flashcards.ts`, `seed-masaar-terms.ts`
5. **HTML placement:** `lesson-irab-sarf/` at repo root (parallel to `maktab-coursebook-html/`)
6. **Implementation order:** Migration → course seed → (quizzes + flashcards in parallel) → terms seed → HTML weeks 2–8

**Learnings:**
- **ArabicTerm is a vocabulary/SRS model, not a passage annotation model.** The gap between `ArabicTerm` (arabicText + transliteration + translation + audioUrl) and the 6-field clickable annotation spec reveals that `ArabicTerm` was designed for SRS term cards, not passage-level word decomposition. `metadata: Json?` bridges this without a structural new table.
- **HTML-first, platform-secondary is the right frame for this course.** The 82KB self-contained HTML file is the primary study interface. The platform is progress tracking + SRS + games. Don't try to replicate the HTML's interactive affordances in the platform — represent the knowledge objects (questions, flashcards, terms) and let the HTML do the teaching.
- **Concern-split seed files scale better than week-split.** The Sarf course precedent (seed-sarf-course.ts + part2-5 + quizzes + flashcards) proves this: each concern file is independently runnable, parallelizable, and debuggable. Week-split would require each file to locate the Course, creating coupling and order-sensitivity.
- **`[IRAB]` / `[SARF]` question tagging in questionText** is a lightweight convention for sub-score filtering without adding a new column — the `QuizResult.answers` JSON already stores per-question results, so frontend filtering by prefix is sufficient.

## Next Steps

- Parent Dashboard + Child Auth implementation
- Phase 2 games planning and scope management
- Integration testing: Full backend/frontend flow
- **Multimodal Phase 1:** Pre-gen audio with text sync (4–6 days, now architectured)
- Video Phase 2 (1–2 weeks)
- **Next coding task:** Integrate review gate into Squad spawning (include REVIEW_REQUEST directive)
- **al-Masār:** hrasheed approval on 3 open decisions → Khwarizmi migration + seeds → Ibn Sina HTML weeks 2–8

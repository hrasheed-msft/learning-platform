# Squad Decisions Archive

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

### 4. Games, Parent Dashboard, and Child Auth — Integrated Feature Design (2026-05-17)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Pending team review

Comprehensive design document for three interconnected features transforming the platform from content-delivery to engagement-driven family learning.

**Key Decisions:**

#### Feature 1: Games (13 types designed)
- **Course-Integrated (7 types):** Term Match, Ayah Completion, Fiqh Scenario Tree, Hadith Chain Builder, Word Search Grid, Arabic Number Bingo, Verse Memorization Quest
- **Standalone/Hub (6 types):** Expedition City (build city through games), Prophet Story Progression, Quran Juz Challenge, Leaderboard Duels, Achievement Vault, Skill Simulator
- **Content Source:** Auto-generated from existing Questions, FlashCards, ArabicTerms; 100% in Phase 1 (manual authoring deferred to Phase 2)
- **SRS Integration:** Games count as reviews, reducing review burden (major engagement lever)
- **Difficulty Scaling:** 3 tiers (EASY, MEDIUM, HARD) mapped to content; age-aware presentation (EARLY_CHILD with hints → TEEN/ADULT timed mode)
- **New Prisma Models:** Game, GameSession, GameScore, GameRound, Leaderboard, Achievement, UserAchievement, StreamAchievement, UserStreakRecord, BadgeDefinition

#### Feature 2: Parent Dashboard
- **Metrics:** Per-child stats (avg quiz score, study time, streak, game performance), family summary aggregates, activity feed
- **Notifications:** In-app alerts for milestones (course completion, streak reached, score improvement, new badges)
- **Comparative Views:** Per-child performance, category strength (radar chart), time-series study patterns
- **Email Digest:** Deferred to Phase 2 (SMTP not configured; in-app notifications Phase 1)
- **New Prisma Models:** FamilySummary, MemberStats, ActivityEvent, Notification, DashboardSettings

#### Feature 3: Child/Teen Login (Username-Only Auth)
- **Auth Flow:** Parent creates child credentials; child logs in with username+password; receives JWT with role=CHILD, memberId, familyId, ageCategory
- **Scope:** Child sees own courses, progress, games, flashcards, reviews; no family management, billing, or sibling data
- **Credentials Management:** Stored on FamilyMember model (Option A chosen — simpler than separate ChildCredential model)
- **Username Uniqueness:** Globally unique (simpler auth lookup, no family context needed at login)
- **Route Matrix:** Child routes scoped by activeMemberId; parent-only routes (family/*, /dashboard/*, /notifications) blocked
- **API Endpoints:** `POST /api/v1/family/members/:memberId/credentials`, `POST /api/v1/auth/child-login`, `GET/PUT /api/v1/child/me`
- **ChildLayout:** Simplified navigation (My Dashboard, My Courses, My Games, My Flashcards, Achievements) — no settings/family management

**Implementation Order:**
1. Child Auth (unblocks child-specific features)
2. Parent Dashboard (depends on child data)
3. Games Phase 1 (engagement driver; auto-generated content only)
4. Games Phase 2+ (manual scenarios, social features) — scope creep risk

**Open Questions (8):**
1. Child usernames: globally unique or family-scoped? → **Globally unique** (recommendation)
2. Child login page: `/child-login` route or subdomain? → **Same domain, different route**
3. Game content: auto-generated vs. manually authored? → **Phase 1: 100% auto-generated**
4. Games write to SRS? → **Yes** (counts as reviews)
5. Email digest Phase 1? → **No** (defer to Phase 2)
6. Credentials storage: FamilyMember fields (A) or separate model (B)? → **Option A**
7. Child password policy? → **Minimum 6 chars, no complexity**
8. Deprecate PIN field? → **Not yet** (backward compatibility; could support younger children on parent device)

**Effort:** Games Phase 1 (L), Child Auth (M), Parent Dashboard (L-M). Phase 2+ XL with scope creep risk.

**Files:** Complete design with 10 new Prisma models, API specs, UI wireframes, and migration strategy in `.squad/decisions/inbox/khaldun-games-dashboard-childauth-research.md`

---

### 5. Games Engine Backend Implementation (2026-05-17)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED  
**Related:** `khaldun-games-detailed-design.md`

Backend implementation of the game engine with 14 Prisma models, 8 enums, and full gamification layer.

**Key Decisions:**
- **Schema:** 14 models, 8 enums (all 15 GameType values defined upfront, 5 active in Phase 1)
- **Content Selection Priority:** SRS-due items → recently incorrect → unseen → random fill
- **SRS Writeback:** Game answers feed into flashcard SRS via SM-2 algorithm (correct=rating 4, incorrect=rating 2, fast correct=rating 5)
- **Scoring Formula:** BASE_POINTS(100) + SPEED_BONUS(max 50) × STREAK_MULTIPLIER(1x/1.5x/2x/3x); Stars: ≥90%=3★, ≥75%=2★, ≥50%=1★; XP = score×0.1 + stars×25
- **Parental Controls:** Whitelist model—empty array = all allowed, non-empty = whitelist; includes time budget, difficulty cap, optional enforce-after-hour
- **Achievement System:** Decoupled check after game completion; 11 triggers defined
- **Daily Challenge:** Date-based seed shuffle; one attempt per member per day enforced via constraint

**Files Created:** ~13 files, 3390 lines total
- `prisma/schema.prisma`: +~350 lines, 8 enums, 14 models
- `services/game.service.ts`: ~1095 lines (core engine)
- `services/achievement.service.ts`: ~210 lines
- `controllers/game.controller.ts`: ~260 lines
- `routes/game.routes.ts`: ~135 lines
- 15 API endpoints; migration applied; commit a43888a

---

### 6. Games Feature Frontend Architecture (2026-05-18)
**Author:** Ibn Sina (Frontend Dev)  
**Status:** IMPLEMENTED  
**Related:** `khaldun-games-detailed-design.md`

Frontend implementation of games feature with 25 new files: 6 playable game types, 10 shared UI components, Games Hub page, routing, navigation updates.

**Key Decisions:**
- **Barrel Re-exports:** Explicit named re-exports in `types/index.ts` to avoid StreakInfo/progress.ts conflicts
- **GamePlay Router Pattern:** Single `GamePlay.tsx` component mapping URL slugs (e.g., `term-match`) to game components
- **Shared Game Components:** 10 reusable components (timer, score, progress bar, stars, game over, difficulty selector, hint button, streak indicator, time bar, blocked screen)
- **Parental Controls Integration:** Every game checks parental settings; `GameBlockedScreen` handles 4 block reasons (TIME_LIMIT, NOT_ALLOWED, OUTSIDE_HOURS, DIFFICULTY_EXCEEDED); `DifficultySelector` respects `maxDifficulty`
- **Dual-Layout Routing:** Parent (`/games/*`) and child (`/child/games/*`) layouts; child routes via `ChildProtectedRoute`

**Game Types (Phase 1):** Term Match, Speed Quiz, Flashcard Flip, Daily Challenge, Escape Room, Maze Navigator

**API Contracts:** All follow `ApiResponse<T>` pattern; key endpoints: `/games/available`, `/games/:gameId/sessions`, `/games/sessions/:sessionId/rounds`, `/games/daily-challenge`, `/games/leaderboards`, `/games/scores`, `/games/achievements`, `/family/members/:memberId/game-settings`

**Files:** 34 files, 3667 lines; build clean

---

### 7. Games Engine Detailed Design (2026-05-17)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Implementation blueprint  
**Reference:** Full 2960-line document at `.squad/decisions/inbox/khaldun-games-detailed-design.md`

Comprehensive implementation blueprint for Games feature specifying all game types, data models, engine architecture, auto-generation pipeline, API design, frontend components, placement strategy, gamification layer, and testing strategy.

**Summary:**
- **Game Type Catalog:** 15 types total (8 course-integrated, 6 standalone/hub, 1 shared); Phase 1 focuses on 5 core types with auto-generated content
- **Data Model:** 14 Prisma models (Game, GameSession, GameScore, GameRound, Leaderboard, Achievement, UserAchievement, StreamAchievement, UserStreakRecord, BadgeDefinition, parental control models)
- **Auto-Generation Pipeline:** Extract content from existing Questions, FlashCards, ArabicTerms; difficulty-tier mapping; age-aware presentation (EARLY_CHILD with hints → TEEN/ADULT timed mode)
- **Engine Architecture:** Content selection (SRS-priority), session lifecycle, SM-2 SRS writeback, streak tracking, scoring with multipliers, achievement triggers, daily challenge seeding
- **Placement Strategy:** Course-integrated games embed within Units; standalone games accessible via Games Hub; visual cues distinguish game availability
- **Gamification:** Streaks, badges, leaderboards, XP progression, daily challenges; achievement system with 11 trigger types
- **Phase 1 Scope:** 5 game types (Term Match, Speed Quiz, Flashcard Flip, Daily Challenge, Word Search) + auto-generated content only
- **Phase 2 Scope:** Remaining game types, manual scenario authoring, social features, email digests; scope creep risk identified

**Key Principles:**
- 100% content auto-generated from existing platform data (Phase 1)
- Games count as SRS reviews, reducing review burden (engagement lever)
- Difficulty scaling: 3 tiers mapped to age categories and content metadata
- Parental control enforcement at session start

---

### 9. Test Suite Architecture & CI Convention (2026-05-20)
**Author:** Biruni (Tester)  
**Status:** IMPLEMENTED

Comprehensive automated regression testing targeting critical production failure modes (auth refresh loops, rate limiter blocking, SSML errors, broken image paths).

**Key Decisions:**
- **Backend unit tests mock all external services** (Prisma, Redis, Azure Speech) — runnable without infrastructure
- **Integration tests excluded from default `vitest run`** via `--exclude="**/integration/**"`; only run in CI with test database
- **SSML tests duplicate buildSsml() logic** — validates contract independently from implementation
- **Frontend auth tests validate refresh-loop-prevention pattern** (isRefreshing, subscriber queue, _retry, authApi separation)
- **CI scripts:** `test:ci` runs `vitest run --reporter=verbose`; backend adds `--forceExit` for safety

**Impact:** 244 new tests (202 backend + 42 frontend); all passing; critical production bugs now covered.

---

### 10. Game Start API – Object Params with Fallback gameType (2026-05-18)
**Author:** Ibn Sina (Frontend)  
**Status:** IMPLEMENTED

Refactored `gameService.startGame()` from positional args to single params object to handle missing `gameId` gracefully.

**Key Decisions:**
- **Params object:** `{ gameId?: string; gameType?: string; memberId: string; courseId?: string; difficulty: GameDifficulty }`
- **gameType derivation:** `useGameRunner` derives `gameType` from URL slug via `SLUG_TO_TYPE`, ensuring backend always gets valid identifier
- **Truthy-only inclusion:** Only non-null values included in request body
- **No game row case:** New courses without pre-existing Game row can start via `gameType` + `courseId`

**Impact:** All 9 game components work without changes; courses without Game rows now functional.

---

### 11. Auth Refresh Loop Prevention Pattern (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

All auth-critical API calls MUST use separate `authApi` axios instance without response interceptor.

**Key Decisions:**
- **Separate authApi instance** — bare axios (no interceptors) used exclusively by `refreshToken()` and `logout()`
- **isRefreshing flag** — prevents concurrent refresh attempts; queues 401 responses during in-flight refresh
- **No-token shortcut** — if both tokens null, redirect to login immediately
- **Backend exemption** — `/auth/logout` and `/auth/refresh` excluded from auth rate limiter via `skip` function

**Rationale:** Main instance's 401 interceptor calling `refreshToken()` on main instance → infinite loop → rate limiter blocks user.

**Impact:** Frontend: `api.ts`, `authService.ts`; Backend: `index.ts` (rate limiter config).

---

### 12. CI/CD Pipeline with Test Gates (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

Two-workflow GitHub Actions setup with automated test gates preventing unvalidated deployments.

**Key Decisions:**
- **`ci-cd.yml`** — Full pipeline on push to `main` and PRs; tests must pass before deploy
- **`test.yml`** — Lightweight PR-only workflow (tests + lint) for fast feedback
- **Deploy gated:** `needs: [test-backend, test-frontend]` — if either fails, no deployment
- **Vitest in CI mode** — `vitest run --reporter=verbose`, no watch mode
- **Prisma generate in CI** — required before tests (generated client not committed)
- **Parallel test jobs** — independent for speed
- **Separate test-only workflow** — PRs get fast feedback without deploy noise

**Action Required:** Add secrets (`AZURE_CREDENTIALS`, `SWA_DEPLOYMENT_TOKEN`); enable branch protection on `main`.

**Impact:** No code reaches production without passing tests; PRs show pass/fail inline.

---

### 13. TTS SSML Chunking — Voice Element Limit Fix (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

Azure Speech Service rejects SSML with >50 `<voice>` elements. Chunked voices into groups of ≤25 per request.

**Key Decisions:**
- **Chunk size:** 25 voice elements per SSML request (50% headroom under 50-element limit)
- **buildVoiceElements()** returns raw voice strings (decoupled from `<speak>` wrapper)
- **chunkSsmlElements()** splits into groups of 25, wraps each in valid `<speak>` document
- **Sequential synthesis** with 200ms inter-chunk delay (rate limit courtesy)
- **Per-chunk retry:** Up to 2 retries with 400ms backoff on failure
- **MP3 concatenation:** Frames self-contained, no re-encoding needed
- **synthesizeToFile exported:** Shared by both audiobook endpoint and video narration

**Files Changed:** `backend/src/services/tts.service.ts`, `backend/src/services/videoService.ts`

**Commit:** `01c5163` — `fix: chunk TTS SSML to stay under 50 voice-element limit`

---

### 14. TTS/Audiobook Backend Implementation (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

Implemented TTS/Audiobook API following pre-generation model with SSML chunking and bilingual support.

**Key Decisions:**
- **Endpoint:** `POST /api/v1/units/:unitId/audio` with `{ language: "ar" | "en", contentBlockId?: string }`
- **Behavior:** Returns cached URL if exists; synthesizes on-demand and caches otherwise
- **Voice Selection:** Arabic: `ar-SA-HamedNeural` (MSA, educational); English: `en-US-JennyNeural` (natural, clear)
- **Bilingual:** SSML `<lang>` tag switches voice mid-narration for inline Arabic
- **Storage (Phase 1):** Local filesystem `public/audio/{unitId}-{language}-{blockIndex}.mp3`; served as static files
- **Caching:** `AudioCache` Prisma model with `@@unique([unitId, language, blockIndex])`; `blockIndex=-1` for full-unit
- **Azure Resource:** `speech-islamic-learning` (F0 free tier, 5 hours/month, centralus region)

**Files Created/Modified:**
- `backend/src/services/tts.service.ts` — synthesis engine
- `backend/src/controllers/audio.controller.ts` — request validation
- `backend/src/routes/audio.routes.ts` — route registration
- `backend/src/config/index.ts` — Azure Speech config
- `backend/prisma/schema.prisma` — AudioCache model
- `.env.example` — documented env vars

**Team Notes:** First call per unit/language takes 2–5s (synthesis); subsequent calls instant (cached). Phase 3 will integrate licensed Quran recitation.

---

### 15. Round Metadata Must Match Frontend Destructuring (2026-05-18)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED  
**Commit:** `60e7e41`

Backend round metadata field names are dictated by frontend component destructuring.

**Key Decisions:**
- **WORD_SEARCH:** Added `targetWords` field (frontend reads `c.targetWords`); kept `words` for backward-compat. Grader accepts `{ foundWords }` submission shape.
- **CLOZE:** Restructured from multi-blank-per-round (`sentence` + `blanks[]`) to one-blank-per-round (`questionText` with `{blank}` marker, `correctAnswer` string, `options` array). Matches frontend single-input-per-round UX.
- **Contract:** Frontend component destructuring IS the contract; backend formatters must match exactly.

**Impact:** Both games work with existing frontend components; no frontend changes needed. Future game types must read frontend destructuring before writing backend formatter.

---

### 16. Pre-Generated Audio with Synchronized Text Highlighting — Architecture Design (2026-05-20)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Architecture Decision

Comprehensive design for pre-generated audio files with real-time text highlighting (karaoke-style), addressing timeout errors, lack of text sync, and repetitive TTS calls.

**Key Decisions:**

#### Data Model — Word-Level Timestamps Storage
- **Extend audioCache** with new `textSync` column containing word boundary metadata
- **TextSync JSON Schema:** `{ version: "1.0", words: WordBoundary[], chunkOffsets?: ChunkOffset[] }`
- **WordBoundary fields:** `wordIndex`, `text`, `textWithDiacritics`, `startMs`, `endMs`, `sectionId`, `language`
- **Rationale:** Keeps audio + metadata atomic; word boundaries always generated alongside audio

#### Pre-Generation Pipeline — Background Job
- **Queue:** Bull/Redis with admin UI trigger (no automatic generation initially)
- **Stages:** Trigger → Fetch → Split → Generate → Align → Store → Notify
- **Per-chunk retry:** Up to 2 retries with exponential backoff
- **Job Payload:** `{ unitId, language, voiceId, sections[], priority, triggeredBy }`

#### Timestamp Format — Cumulative Offsets
- **Word-level granularity** — enables individual word highlighting during playback
- **Chunk offset tracking** — allows re-generation strategy changes without breaking alignment
- **Diacritics preservation** — Arabic stored with diacritics for accurate display

#### API Contract — Frontend-Facing Endpoints
- **GET `/api/v1/content/units/:unitId/audio`** — returns pre-gen audio + sync data; 412 if not ready (can auto-trigger job)
- **GET `/api/v1/content/units/:unitId/audio/fallback`** — streams on-demand TTS (no sync data)
- **Signed URLs** — Azure Blob SAS tokens for security
- **Cache Headers** — Long TTL (1 year) on static blob URLs

#### Arabic Handling — RTL, Diacritics, Word Splitting
- **Preserve diacritics in storage**, use unicode word segmentation, render with RTL CSS
- **Strip diacritics for matching logic** — separates display text from match/search logic
- **Frontend:** CSS `direction: rtl` for Arabic sections; `textWithDiacritics` for display

#### When Pre-Generation Happens
- **Primary:** Manual admin trigger via admin UI
- **Phase 2:** Auto-trigger on unit publish
- **Cost control:** Admin chooses which units to pre-generate

#### Testing Strategy
- **Unit tests:** Word boundary extraction, cumulative offset calculation, diacritics handling, TextSync schema validation
- **Integration tests:** End-to-end pre-gen job, audio + sync stored correctly, fallback TTS works
- **E2E (Frontend):** Real-time highlighting, Arabic RTL rendering, instant seek sync, speed changes

#### Migration Path
1. Deploy audioCache schema (no breaking change)
2. Deploy background job service
3. Deploy admin endpoints (auth-gated)
4. Deploy frontend components (feature-flagged)
5. Enable feature flag (gradual rollout)

**Phase 1 Scope:** AudioCache extension, background job pipeline, word boundary extraction, API endpoints, frontend AudioPlayer/TextHighlight, Arabic handling, cumulative offset strategy

**Deferred to Phase 2:** Auto-trigger on publish, batch pre-gen UI, cost analytics, Redis in-memory sync, CDN integration

**Risks:** Word boundary extraction timing data accuracy, audio concatenation frame boundaries, re-generation strategy changes.

---

### 17. Multimodal Architecture — Video Generation & TTS/Audiobook (2026-05-20)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Pending team review

Comprehensive multimodal feature design addressing high-value requests for automatic video generation and TTS/audiobook with full Arabic support.

**Feature 1: Automatic Video Generation**

#### Options Considered
- **Option A (Avatar APIs):** HeyGen, D-ID, Synthesia, Azure TTS Avatar — Rejected due to Islamic appropriateness concerns (realistic human representations) and content control limitations
- **Option B (Text-to-Video AI):** Sora, Runway, Pika, Kling — Rejected (no Arabic rendering, poor educational content control, expensive)
- **Option C (Narrated Slide-Deck):** RECOMMENDED — Programmatic construction from unit content

#### Option C: Narrated Slide-Deck Video (Recommended)
- **Components:** Azure AI Speech TTS → MP3 narration; Puppeteer (headless Chrome) → PNG slides; ffmpeg → MP4 video
- **Video structure:** Title card + content slides (key paragraphs) + Arabic term slides + summary
- **Advantages:** Full Arabic text fidelity, Islamically appropriate (no human images, geometric art), controllable, cheap (~TTS cost only), works offline
- **Slide format:** 1280×720 HD, 25fps; Islamic geometric backgrounds (CC0); Noto Naskh Arabic + Inter fonts
- **Timing:** Each slide duration = audio segment duration; SSML `<bookmark>` tags for word-level timing

#### Generation Trigger & Frequency
- **Trigger:** Content-admin action ("Generate Video" button), not automatic
- **Frequency:** Once per unit, on content publish; re-generated if content changes (hash-based invalidation)
- **Background processing:** PostgreSQL-backed job table; worker loop in Container App (MVP uses async worker thread)
- **Storage:** `media/videos/{unitId}/{hash}.mp4` in Azure Blob Storage (Hot tier); publicly readable via CDN

**Feature 2: TTS / Audiobook**

#### Pre-generate vs. On-the-Fly Analysis
- **Pre-generate:** Zero latency (CDN), no per-user API calls, predictable cost, works offline
- **Decision: Pre-generate** — content stable; cost of Blob Storage ($0.018/GB/month) negligible at scale

#### Arabic Language Strategy
- **Arabic content:** `ar-SA-HamedNeural` (male, MSA, educational)
- **Arabic terms in English:** SSML `<lang xml:lang="ar-SA">` tag switches voice mid-narration
- **English:** `en-US-JennyNeural` or `en-US-GuyNeural`
- **Quranic recitation note:** NOT suitable for TTS; either skip Arabic ayat in audio or use disclaimer. Phase 3 integrates licensed recitation (EveryAyah.com API or Quran.com)

#### "Listen" Button UX Flow
1. Click "Listen" button on Unit page (language toggle: EN/AR)
2. Fetch pre-generated MP3 from `/api/v1/units/:unitId/audio`
3. If READY: stream from CDN (immediate); if PENDING/GENERATING: show "being prepared" message; if FAILED: retry option
4. Minimal floating player: play/pause, speed control (0.75×/1×/1.5×/2×), progress bar

#### Data Model Changes
- **Extend AudioResource:** Add `language`, `voiceId`, `status`, `textHash`, `sizeBytes`, `generatedAt`, `errorMessage`
- **Extend VideoResource:** Add `generationType` (MANUAL|SLIDE_DECK|AVATAR), `status`, `textHash`, `sizeBytes`, `generatedAt`, `errorMessage`
- **New MediaGenerationJob:** Track async generation jobs (QUEUED|PROCESSING|DONE|FAILED)
- **Extend UnitProgress:** Add `audioListened` boolean

#### New Azure Resources Required
- **Azure AI Speech (S0 tier):** TTS for audio generation + batch avatar (Phase 3). F0 free tier: 0.5M neural chars/month (dev/low usage); S0 production: pay-as-you-go
- **Azure Blob Storage `media` container:** Hot tier, LRS redundancy, public read for CDN; sub-paths: `media/audio/{unitId}/`, `media/video/{unitId}/`
- **Azure CDN (Standard Microsoft):** Low-latency global MP3/MP4 delivery; far-future cache headers (1 year) for hash-addressed files
- **No new compute Phase 1–2:** Backend Container App gains `MediaGenerationService` + `SlideRenderService`; Puppeteer/ffmpeg added to Dockerfile; may need resource increase (1→2 vCPU, 2→4 GB RAM) for video generation

#### Cost Estimates
- **TTS one-time:** 200 units × 10K chars = 2M chars ≈ $32 (free tier saves ~$8); **net ~$24**
- **Blob storage:** 1 GB audio (200×5MB) ≈ $0.018/mo; 10 GB video Phase 2 ≈ $0.18/mo; **total ~$0.20/mo**
- **CDN delivery:** 100 learners × 10 units/week × 5MB audio = 5GB/week ≈ 20GB/mo ≈ $1.74/mo
- **Phase 2 (audio+video):** 100 learners + 50MB videos ≈ +200GB/mo ≈ $17.40/mo
- **Phase 1 total:** ~$2–5/mo at 100 learners; **Phase 2 total:** ~$20–25/mo

#### Implementation Phases

**Phase 1: TTS Audiobook (4–6 days)**
- Provision Azure AI Speech (S0); store key in Key Vault
- `MediaGenerationService.generateAudio()`: strip HTML → plain text → SSML build → Azure TTS → MP3 → Blob Storage
- Job queue: `POST /api/v1/admin/units/:unitId/generate-audio`; `GET /api/v1/units/:unitId/audio`
- Schema extension (migration)
- Frontend: AudioPlayer component, "Listen" button, language toggle, status polling
- Admin trigger: Directus "Generate Audio" action; bulk action per course

**Phase 2: Slide-Deck Video Generation (1–2 weeks)**
- Add Puppeteer + Chrome Headless + ffmpeg to Dockerfile
- `SlideGenerationService`: parse content HTML → slide scripts → Puppeteer render PNGs → per-slide TTS → ffmpeg assemble
- Increase Container App resources (2 vCPU/4 GB RAM)
- Schema extensions (migration)
- Video template design (geometric art, Arabic fonts, 1280×720 HD, 25fps)
- Progress tracking: `videoCompleted` in UnitProgress

**Phase 3: Per-Term Audio + Quranic Integration (Future)**
- Pre-generate TTS for each `ArabicTerm.audioUrl`
- Licensed Quran recitation (EveryAyah.com or Quran.com APIs)
- Optional: Azure TTS Avatar for admin-created premium content (opt-in disclosure)
- Offline download: package audio/video for PWA

#### Open Questions
1. **Admin trigger vs. auto-trigger:** Explicit trigger (Phase 1) or auto-generate on publish (Phase 2)?
2. **Arabic voice gender:** Preferences per member (male/female) or universal default?
3. **Video backgrounds:** Curate ~20 CC0 Islamic geometric art images for Phase 2
4. **Container App sizing:** Video generation worker isolation (dedicated Container App job, scale-to-zero) or main container?
5. **Multilingual expansion:** Urdu (`ur-PK-AsadNeural`) for South Asian audience — Phase 3 roadmap

**Key Principles:**
- Full Arabic text fidelity (RTL, diacritics, Quranic fonts)
- Islamically appropriate (no photorealistic avatars)
- Cost-viable (TTS ~$24 one-time, ~$2–25/mo ongoing)
- Works offline/PWA-friendly

**Risks:** Arabic quality on classical text (test ar-SA-HamedNeural first), Puppeteer/ffmpeg image size + startup (mitigate with dedicated worker Phase 2), content changes invalidate cache (use textHash), viral traffic CDN costs (cheap + caching means minimal Blob egress), user expectations on Quran recitation (clear UI label "AI-generated").

---

### 22. TTS Prosody Fragmentation Fix (2026-05-20)
**Author:** Khwarizmi (Backend Dev)
**Component:** `backend/src/services/tts.service.ts` — `buildVoiceElements()`
**Status:** Implemented

English audio narration was reading "one word at a time with pauses" because `buildVoiceElements()` created a separate `<voice>` element for every Arabic fragment, no matter how small. Azure Speech resets prosody at each voice boundary, causing audible gaps.

**Key Decisions:**
- **Removed `\s` from Arabic regex** — whitespace no longer gets captured as Arabic, preventing spurious fragmentation.
- **4-word threshold** — Arabic segments with ≤4 words stay inline within the English voice element. Only substantial passages (>4 words) trigger a voice switch to `ar-SA-HamedNeural`. Covers 99% of cases (inline terms like "wudu", "الوضوء", "salah").
- **Prosody boost:** English voice elements get 5% speed boost (`<prosody rate="1.05">`) to address "too slow" feedback.

**Trade-off:** Short Arabic terms rendered by English voice won't have perfect Arabic pronunciation. Accepted because fluency >> isolated accuracy for learning content.

---



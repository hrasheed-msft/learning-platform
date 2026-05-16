# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### Backend Inventory Audit — 2026-05-16

#### Prisma Schema (17 models)
- **Family & User**: Family, User, FamilyMember — family-based multi-tenant model. Users are parents (PARENT/ADMIN), FamilyMembers are learners with age categories (EARLY_CHILD through ADULT), streaks, and points.
- **Course & Content**: Course (category: QURAN/HADITH/FIQH/SEERAH/ARABIC/ISLAMIC_HISTORY), Unit (ordered, rich HTML content), VideoResource, AudioResource, ArabicTerm.
- **Assessment**: Question (MULTIPLE_CHOICE/TRUE_FALSE/MATCHING/FILL_BLANK, supports AI-generated flag), QuizResult (scored 0-100, pass/fail).
- **FlashCard system**: FlashCard (front/back with Arabic support, category/tags, difficulty enum), FlashCardProgress (SM-2 algorithm: easeFactor, interval, repetitions, status enum NEW→LEARNING→REVIEWING→MASTERED). Two enums: FlashCardStatus, FlashCardDifficulty.
- **Progress & Enrollment**: CourseEnrollment (ACTIVE/PAUSED/COMPLETED, 0-100%), UnitProgress (video/reading/quiz completion per unit).
- **SRS (Memorization)**: MemorizationItem (AYAH/HADITH/DUA/TERM), ReviewLog — separate from FlashCard SRS. Uses simplified SM-2 with fixed intervals.
- **Gamification**: Achievement (type-based, earned per FamilyMember).

#### API Routes (7 route groups, ~50+ endpoints)
- **Auth** `/api/v1/auth`: register, login, refresh, logout, forgot-password, reset-password, verify-email, resend-verification
- **Family** `/api/v1/family`: CRUD members, switch member (PIN-based child login), get member progress. All authenticated, write ops require PARENT role.
- **Courses** `/api/v1/courses`: list/get courses (public w/ optional auth), units (authenticated), enrollments (PARENT only for enroll/unenroll), progress tracking.
- **Assessments** `/api/v1/assessments`: get questions by unit, submit quiz, get results, AI question generation (stub).
- **SRS** `/api/v1/srs`: due items, all items, add item, submit review, history, stats — all by memberId.
- **Users** `/api/v1/users`: profile CRUD, password change, settings, achievements.
- **FlashCards** `/api/v1/` (mounted at root v1): Full CRUD (create, batch create, get by unit/course/id, update, delete, reorder), metadata (categories, tags, count), progress (initialize, review, due cards, stats, unit/course progress, recent reviews, reset).

#### Middleware
- **auth.middleware.ts**: JWT Bearer token authentication (`authenticate`), role-based authorization (`requireRole`, `requireParentRole`), optional auth (`optionalAuth`). Verifies user exists in DB on every request.
- **validate.middleware.ts**: express-validator integration, transforms errors to structured map.
- **error.middleware.ts**: Centralized error handler with custom error classes (AppError, BadRequest, Unauthorized, Forbidden, NotFound, Conflict, Validation, InternalServer). Dev mode shows stack traces.
- **notFound.middleware.ts**: 404 catch-all.
- **Rate limiting**: express-rate-limit configured in index.ts (configurable window/max).
- **Security**: helmet, cors (configured origin), body size limit 10mb.

#### Services Implementation
- **auth.service**: Full register (family+user transaction), login, refresh, forgot/reset password, email verify. bcrypt hashing. JWT access+refresh tokens.
- **family.service**: Full CRUD, age category auto-calculation, PIN-based member switching, progress aggregation.
- **course.service**: Paginated listing with filters (category, ageLevel, search), enrollment management, unit progress upsert, auto-calculates course completion %.
- **assessment.service**: Quiz grading with detailed answer feedback, auto-awards points (100 for perfect, 50 for pass, 10 for fail), updates unit progress on pass.
- **srs.service**: SM-2 with fixed interval table [0,1,3,7,14,30,60,120,240 days], review logging, retention rate calculation.
- **flashcard/flashcard.service**: Full CRUD with filtering/pagination, batch create in transaction, reorder, category/tag metadata.
- **flashcard/flashcard-progress.service**: SM-2 algorithm (proper implementation), status transitions with messages, due card retrieval, statistics, reset operations.
- **flashcard/sm2-algorithm.service**: Full SM-2 implementation (ease factor adjustment, interval calculation, status transitions), rating time suggestions, future review prediction, daily target calculator.

#### Seed Data (12 courses total)
**Main seed (seed.ts) — 6 courses:**
1. Introduction to Tawheed (FIQH, CHILD/PRE_TEEN/TEEN) — 3 units with rich HTML, questions
2. Stories of the Prophets (SEERAH, CHILD/PRE_TEEN) — 5 units (Adam, Nuh, Ibrahim, Musa, Isa)
3. Learn Arabic Basics (ARABIC, EARLY_CHILD/CHILD) — units on alphabet, numbers
4. The Five Pillars of Islam (FIQH, CHILD/PRE_TEEN/TEEN) — units on Salah etc.
5. Daily Duas and Adhkar (QURAN, EARLY_CHILD/CHILD/PRE_TEEN) — eating/drinking, protection
6. My First Prayer (FIQH, EARLY_CHILD/CHILD) — wudu, clothes, movements

**Independent seed files — 6 additional courses:**
7. Advanced Sarf - Arabic Morphology (seed-sarf-course.ts + parts 2-5) — multi-part, advanced Arabic morphology
8. Sarf Flashcards (seed-sarf-flashcards.ts) — flashcard data for Sarf course
9. Sarf Quizzes (seed-sarf-quizzes.ts) — comprehensive quiz questions per unit
10. Habits to Win Here and Hereafter (seed-habits-course.ts) — Yaqeen Institute series, TEEN/ADULT
11. Hujjatullah Al-Balighah (seed-hujjatullah-course.ts) — Shah Wali Allah, FIQH, ADULT
12. From the Glories of Our Civilization (seed-rawai-hadaratina-course.ts) — al-Sibai, ISLAMIC_HISTORY, TEEN/ADULT
13. Tazkiyah: Purification of the Soul (seed-tazkiyah-course.ts) — al-Jilani/Ibn Taymiyyah, AQEEDAH, TEEN/ADULT

Note: Sarf seed uses non-standard schema fields (descriptionArabic, titleArabic, level, ageCategory, category:'LANGUAGE', estimatedHours) that don't exist in the current Prisma schema — will fail on seed unless schema is updated or seed is fixed.

#### Database Migrations (2)
1. `20251223212736_v1` — Initial schema (Family, User, FamilyMember, Course, Unit, VideoResource, AudioResource, ArabicTerm, Question, QuizResult, CourseEnrollment, UnitProgress, MemorizationItem, ReviewLog, Achievement)
2. `20251229225721_add_flashcards` — Added FlashCard, FlashCardProgress models with SM-2 fields and enums

#### Directus CMS
- docker-compose.yml running Directus CMS on port 8055, connected to same PostgreSQL database (`islamic_learning_dev`). Shares DB with backend — can be used for content management alongside the API.

#### TODOs / Incomplete Items
1. **Email sending** — auth.service has 3 TODOs: send verification email (register), send reset email (forgotPassword), send verification email (resendVerification). No email transport configured.
2. **Redis token invalidation** — logout just logs, doesn't actually invalidate refresh tokens in Redis.
3. **AI question generation** — assessment.service.generateQuestions returns placeholder; OpenAI integration not implemented.
4. **FlashCard review streak** — flashcard-progress.service has TODO for calculating review streak.
5. **Sarf seed schema mismatch** — seed-sarf-course.ts uses fields not in current Prisma schema (descriptionArabic, titleArabic, level, ageCategory as string, category:'LANGUAGE', estimatedHours). Will fail at runtime.
6. **Two parallel SRS systems** — MemorizationItem+ReviewLog (srs.service) and FlashCard+FlashCardProgress (flashcard services) both implement SM-2 independently. Could be consolidated.
7. **Assessment getQuestions exposes correctAnswer** — returns correctAnswer and explanation in GET response (line assessment.service.ts:41), leaking answers to client before quiz submission.

---

### 2026-05-16 — Orchestration Complete

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-16T08-36-khwarizmi.md`

Backend inventory audit wrapped. Findings merged into team decision archive:
- Decision filed: "Fix Sarf Seed / Schema Mismatch" — Recommends Option 3 (update schema + audit seeds)
- Decision filed: "Consolidate Dual SRS Systems" — Recommends migrating MemorizationItem to FlashCard SRS (FlashCard is more mature, reduces duplication)
- Critical issue identified: Quiz answers exposed in GET endpoint (item 7 above) — should be fixed immediately
- Backend is feature-complete with clear architectural decisions needed on SRS consolidation and schema extensions

### 2026-05-16 — Maktab Coursebook 1 Seed Script

**File:** `backend/prisma/seed-maktab-coursebook1.ts`

#### Seed Script Pattern (for future coursebooks)
- Each coursebook is a standalone seed file exporting a named function (`seedMaktabCoursebook1`) plus a `main()` wrapper for standalone execution (`npx ts-node prisma/seed-maktab-coursebook1.ts`).
- Follows the sarf seed pattern: find demo family first, create course, then units with `orderIndex` starting at 0, then questions/flashcards/arabicTerms via `createMany`.
- Idempotent: checks if course title already exists before seeding.
- Does NOT use non-standard schema fields (learned from sarf seed mismatch). Only uses fields present in the actual Prisma schema: `title`, `description`, `category`, `ageLevels`, `isPublished` for Course; `title`, `description`, `content`, `orderIndex`, `courseId` for Unit.

#### Content Mapping Decisions
- Coursebook has 7 subjects → 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
- Each topic within a subject is embedded as a `<h3>` section inside the unit's HTML `content` field (not separate units) — matches the coursebook's natural hierarchy where subjects have 2-10 topics each.
- Course category set to `FIQH` (closest match — the coursebook is interdisciplinary but Fiqh is the dominant subject).
- Age levels: `['EARLY_CHILD', 'CHILD']` matching the 6-7 year target.
- Arabic text preserved with full tashkeel/diacritics in flashcards, arabicTerms, and content HTML using `<p class="arabic" dir="rtl" lang="ar">` blocks.
- Transliterations use academic convention: ṣ, ṭ, ḍ, ḥ, dh, th, etc.

#### Content Totals
- 41 quiz questions (5-7 per unit, EASY/MEDIUM difficulty, age-appropriate)
- 59 flashcards across all units (vocabulary, rules, definitions, examples, duas)
- 26 Arabic terms with transliteration and translation
- All content sourced from Coursebook1.html with supplemental context from parent guide

### 2026-05-19 — Maktab Coursebook 2 Seed Script

**File:** `backend/prisma/seed-maktab-coursebook2.ts` (~92KB, ~1800 lines)

#### Content
- Course: "Maktab Coursebook 2", ageLevels `['CHILD', 'PRE_TEEN']` (ages 7-8), category `FIQH`
- 7 Units (same subject structure as CB1): Fiqh (wuḍū'/ṣalāh/tayammum), Aḥādīth (6 ḥadīth), Sīrah (revelation to persecution), Tārīkh (Hūd & Ṣāliḥ), Aqā'id (names of Allāh/angels/books), Akhlāq (promises/gratitude/kindness), Ādāb (greeting/speaking/sneezing)
- 41 quiz questions (5-7 per unit, MULTIPLE_CHOICE/TRUE_FALSE/FILL_BLANK, EASY/MEDIUM)
- 58 flashcards with global orderIndex tracking (vocabulary, rules, examples, du'ā's)
- 31 Arabic terms across 6 units (Fiqh 8, Sīrah 4, Tārīkh 4, Aqā'id 8, Akhlāq 4, Ādāb 3)

#### Pattern Consistency
- Identical structure to CB1 seed: imports → export function → idempotency → course → 7 units → questions createMany → flashcards createMany with global index → arabicTerms createMany → summary → main wrapper
- Quiz questions hand-crafted from actual coursebook content (not generic parent guide questions)
- Rich HTML content with h2/h3/p/ul/ol tags, Arabic blocks with dir="rtl", Qur'ānic references

### 2026-07-14 — Mukhtasar al-Quduri: Kitab al-Taharah Seed Script

**File:** `backend/prisma/seed-quduri-taharah.ts` (~128KB, 2092 lines)

#### Content
- Course: "Mukhtasar al-Quduri: Kitab al-Taharah (Book of Purification)", ageLevels `['TEEN', 'ADULT']`, category `FIQH`
- Source: Classical Hanafi fiqh text by Imam Ahmad ibn Muhammad al-Quduri (d. 428 AH), Kitab al-Taharah chapter
- 10 Units: Fard of Wudu, Sunan of Wudu, Nawaqid al-Wudu, Fard/Sunan of Ghusl, Types of Water, Rulings on Wells, Tayammum, Wiping Over Footwear, Menstruation & Nifas, Impurities & Purification
- 65 quiz questions (5-8 per unit, MULTIPLE_CHOICE/TRUE_FALSE/FILL_BLANK, MEDIUM/HARD)
- 53 flashcards with Arabic fiqh terminology (orderIndex resets per unit — @@unique is [unitId, orderIndex])
- 68 Arabic terms with transliteration and translation

#### Pattern Notes
- Uses `<div class="bilingual-text">` format with `<div class="arabic-original" dir="rtl" lang="ar">` + `<div class="english-translation"><em>[AI-Generated Translation]</em>` — different from CB1/CB2 pattern but appropriate for classical text + translation format
- English translations clearly marked as AI-generated (not scholarly) throughout
- Full Arabic diacritics (tashkeel) preserved from source text
- Questions test understanding of RULINGS (Hanafi positions, conditions, exceptions) — not memorization
- FlashCard orderIndex is per-unit (resets to 0), NOT global — confirmed by @@unique([unitId, orderIndex]) constraint

### 2026-07-18 — Maktab Coursebook 3 Seed Script

**File:** `backend/prisma/seed-maktab-coursebook3.ts` (~104KB, ~1962 lines)

#### Content
- Course: "Maktab Coursebook 3", ageLevels `['CHILD', 'PRE_TEEN']` (ages 8-9), category `FIQH`
- 7 Units: Fiqh (key terms/ṭahārah/najāsah/ghusl/ṣalāh method+types/Witr/Qaṣr/Marīḍ), Aḥādīth (10 ḥadīth: ṣalāh/love/steadfastness/life/world/du'ā'/guests/mercy/modesty/shukr), Sīrah (Abyssinia→Mi'rāj), Tārīkh (Ibrāhīm & Ismā'īl: idols/fire/Namrūd/Zamzam/sacrifice/Ka'bah), Aqā'id (prophets/messengers/25 names/Rasūl vs Nabī/signs of Last Day), Akhlāq (thinking good/sharing/parents/truth/good words/ghībah), Ādāb (travelling/studying/Qur'ān/walking/masjid)
- 41 quiz questions (7+6+6+6+5+6+5 per unit, MULTIPLE_CHOICE/TRUE_FALSE/FILL_BLANK, EASY/MEDIUM)
- 60 flashcards with global orderIndex tracking (vocabulary, rules, definitions, examples)
- 30 Arabic terms across all units

#### Source Material Notes
- CB3 HTML (107KB) has significant OCR artifacts from PDF conversion — garbled text in diagram-heavy sections (fiqh key words diagram, ṣalāh table, nawāqiḍ list). Content was cleaned and rewritten.
- Sīrah and Tārīkh content is embedded under the Aḥādīth section in the HTML (articles with "SīrahLearning" and "TārīkhLearning" objectives headers) — mapped to separate units.
- Aḥādīth section has 10 ḥadīth (not 6 like CB1/CB2) — significant jump in content depth for age 8-9.
- Parent guide has 94 questions across 28 topics — quiz questions derived from these but adapted for the seed format.
- Du'ā' Qunūt Arabic text partially garbled in HTML — cleaned version used in seed.

#### Pattern Consistency
- Identical structure to CB1/CB2 seeds: imports → export function → idempotency → course → 7 units → questions createMany → flashcards createMany with global index → arabicTerms createMany → summary → main wrapper
- TypeScript parses cleanly (verified via TS createSourceFile)
- Difficulty mix: EASY and MEDIUM (per conversion strategy: Books 3-5 use both levels)

### 2026-07-22 — Maktab Coursebook 4 Seed Script

**File:** `backend/prisma/seed-maktab-coursebook4.ts` (~91KB, ~1765 lines)

#### Content
- Course: "Maktab Coursebook 4", ageLevels `['CHILD', 'PRE_TEEN']` (ages 9-10), category `FIQH`
- 7 Units: Fiqh (masaḥ 'alal khuffayn/wounds/wājib acts of ṣalāh/sajdah as-sahw/ṣawm rules/tarāwīḥ), Aḥādīth (feeding others/racism/good character/friendship/kindness/trust/keys to Paradise/dhikr/du'ā'), Sīrah (Pledges of 'Aqabah/Hijrah/Cave of Thawr/arrival in Madīnah/Mu'ākhāt/treaties with Jews/Battles: Badr, Uḥud, Aḥzāb), Tārīkh (complete story of Yūsuf عليه السلام), Aqā'id (major signs of Qiyāmah: Mahdī/Dajjāl/protection/descent of 'Īsā/Ya'jūj & Ma'jūj/Beast/Sun from West/Smoke/Trumpet/Shafā'ah/Ṣirāṭ), Akhlāq (amānah/seeking permission/removing harm/good neighbours), Ādāb (du'ā' etiquette/dressing & satr/guests & hosts/gatherings/istinjā')
- 33 quiz questions (5+5+5+5+5+4+4 per unit, MULTIPLE_CHOICE/TRUE_FALSE/FILL_BLANK, EASY/MEDIUM)
- 59 flashcards with global orderIndex tracking
- 33 Arabic terms across all units

#### Source Material Notes
- CB4 HTML (126KB, 935 lines) has OCR artifacts from PDF conversion similar to CB3 — garbled Arabic text in ḥadīth headers
- Content is substantially more complex than CB1-CB3: advanced fiqh (masaḥ conditions, qaḍā'/kaffārah distinctions), detailed military sīrah (three battles with numbers), and comprehensive eschatology (10+ major signs of Qiyāmah)
- Tārīkh unit is a single extended narrative (Story of Yūsuf) vs. multiple prophets — different structure, heavy Qur'ānic quotation from Sūrah 12
- Parent guide quiz questions were generic templates — all quiz questions hand-crafted from actual coursebook content

#### Pattern Consistency
- Identical structure to CB1-CB3 seeds
- Flashcard categories validated against schema: vocabulary, definition, rule, example (fixed non-standard categories: event→definition, person→definition, ḥadīth→example)
- TypeScript parses cleanly (verified via TS createSourceFile)
- Difficulty: primarily MEDIUM with some EASY for basic recall (per conversion strategy for Book 4)

### Maktab Coursebook 5 Seed — 2026-06-24

#### File Created
- `backend/prisma/seed-maktab-coursebook5.ts` — ~1560 lines, 107KB
- Course: "Maktab Coursebook 5", category FIQH, ageLevels ['CHILD', 'PRE_TEEN'], ages 10–11

#### Content Structure (7 units)
0. **Fiqh** — Advanced wuḍū' rulings (farā'iḍ, sunan, makrūhāt, nawāqiḍ), tayammum, ṣalāh sunan (qiyām/rukū'/sajdah/qa'dah), forbidden times, masbūq, qaḍā', 'Īd ṣalāh (6 takbīrs, DROP mnemonic), iḥrām, 'umrah (ṭawāf/sa'y), ḥajj (3 types, day-by-day 8th-13th Dhul Ḥijjah), ziyārah (Madīnah, Rawḍah, Jannatul Baqī')
1. **Aḥādīth** — 10 ḥadīth: promises, tongue, ghībah (muflīs ḥadīth), intoxicants, beauty of Islam, carrying tales, 99 names (iḥṣā'), Mu'awwidhāt, speaking good, good character (Anas serving 10 years)
2. **Sīrah** — Treaty of Ḥudaybiyah, Bay'ah ar-Riḍwān, ambassadors to world leaders, breaking of treaty, conquest of Makkah (10,000 Muslims, general amnesty, Bilāl's adhān), Battle of Ḥunayn, Farewell Sermon
3. **Tārīkh** — Story of Mūsā (magicians, parting of Red Sea, Fir'awn drowned, Tawrāh), Story of 'Īsā (Maryam, miraculous birth, speaking in cradle, miracles, Ḥawāriyyūn, raised to heavens)
4. **Aqā'id** — Death journey (believer vs disbeliever), Munkar and Nakīr, Barzakh, 'Illiyyūn/Sijjīn, Jannah (8 gates, rivers, Ṭūbā tree, seeing Allāh), 'Asharah Mubasharah (10 names), Jahannam (7 gates, Zaqqūm tree), A'rāf, al-Qadr, core beliefs (Allāh/prophets/Ṣaḥābah/Khulafā')
5. **Akhlāq** — Mashwarah (Qur'ān 3:159, story of Yūsuf), Ṣabr (3 types: obedience/abstinence/endurance), family ties (ṣilah al-raḥim), gifts/hospitality, dhikr (Ibn al-Qayyim's benefits)
6. **Ādāb** — Ghusl method, social interaction (comprehensive manners list), writing letters, miswāk (benefits, occasions), visiting the sick (Ḥadīth Qudsī)

#### Content Totals
- 39 quiz questions (7+5+6+5+6+5+5): MC/TF/FILL types, mostly MEDIUM difficulty
- 58 flashcards (10+10+8+8+8+7+7): vocabulary/definition/rule/example categories with Arabic text
- 30 Arabic terms across all units with transliteration and translation

#### Source Material Notes
- CB5 HTML (151KB, 1148 lines) has significant OCR artifacts: `#ajj`, `far}`, `ṣa#ābah`, `*\ﬁ~`, `^|natul` — all cleaned in seed content
- Sīrah and Tārīkh content were embedded inside the Aḥādīth HTML section — extracted and separated into proper units
- Content is the most complex coursebook so far: detailed ḥajj day-by-day itinerary, comprehensive eschatology with 'Illiyyūn/Sijjīn/A'rāf/Barzakh, and two complete prophet narratives
- Parent guide quiz questions were auto-generated (low quality: "What is this?", "What is if a person?") — all quiz questions hand-crafted from content understanding

#### Pattern Consistency
- Identical structure to CB1-CB4 seeds
- Flashcard categories: vocabulary, definition, rule, example
- TypeScript parses cleanly (verified via TS createSourceFile)
- Difficulty: primarily MEDIUM with some EASY (per conversion strategy for Book 5)

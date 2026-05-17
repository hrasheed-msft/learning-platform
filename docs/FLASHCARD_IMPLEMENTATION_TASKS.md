# Flash Cards Feature - Implementation Task List

**Project:** Islamic Learning Platform - Flash Cards Content Type  
**Created:** December 29, 2025  
**Status:** Ready for Implementation  
**Total Estimated Time:** 96 hours (12 developer-days)

---

## Plan Review - Identified Issues & Improvements

### ✅ Plan Completeness Check

**Strengths:**
- ✅ Complete database schema with proper indexing
- ✅ Comprehensive API routes covering all CRUD operations
- ✅ Well-defined spaced repetition algorithm (SM-2)
- ✅ Detailed frontend component structure
- ✅ Clear integration points with existing features
- ✅ Phased migration plan

**Minor Gaps Identified:**
1. **Missing:** Error handling strategy for network failures during review submission
2. **Missing:** Database migration rollback plan
3. **Missing:** TypeScript type definitions location
4. **Missing:** API response format standardization
5. **Missing:** User notification system for daily reviews
6. **Improvement:** Need to specify Redux vs Zustand more clearly (plan mentions Zustand but current app structure unclear)

**Recommended Additions:**
1. Add transaction handling for review submissions (ensure atomicity)
2. Add rate limiting for review endpoints
3. Add data validation schemas (Zod integration)
4. Add offline-first capability plan for future mobile app
5. Add theological review checklist for flash card content

---

## Implementation Task Breakdown

### PHASE 0: Pre-Implementation Setup (2-4 hours)
**Assigned:** @dev-manager

#### Task 0.1: Environment & Dependency Audit
- [ ] Review current Prisma version compatibility
- [ ] Check if Zod validation is already set up
- [ ] Verify Redis is available for caching
- [ ] Confirm authentication middleware supports role-based access
- [ ] Document current TypeScript strict mode settings
- **Verification:** Run `npm list` and review package.json dependencies
- **Owner:** @dev-manager
- **Time:** 1 hour

#### Task 0.2: Create Feature Branch & Project Structure
- [ ] Create feature branch: `feature/flashcards-content-type`
- [ ] Create directory structure:
  - `backend/src/services/flashcard/`
  - `backend/src/controllers/flashcard/`
  - `backend/src/routes/flashcard/`
  - `backend/src/__tests__/flashcard/`
  - `frontend/src/components/flashcards/`
  - `frontend/src/pages/flashcards/`
  - `frontend/src/services/flashcardService.ts`
  - `frontend/src/stores/flashcardStore.ts`
  - `frontend/src/__tests__/flashcards/`
- [ ] Add `.gitkeep` files to empty directories
- **Verification:** Directory structure matches plan
- **Owner:** @dev-manager
- **Time:** 0.5 hours

#### Task 0.3: Set Up Type Definitions
- [ ] Create `backend/src/types/flashcard.types.ts`
- [ ] Create `frontend/src/types/flashcard.types.ts`
- [ ] Define shared interfaces matching Prisma models
- **Verification:** TypeScript compiles without errors
- **Owner:** @dev-manager
- **Time:** 1 hour

#### Task 0.4: Update Project Documentation
- [ ] Add flash cards to README.md features list
- [ ] Update CONTRIBUTING.md with flash card conventions
- [ ] Create FLASHCARD_API.md for API documentation
- **Verification:** Documentation reviewed by team
- **Owner:** @dev-manager
- **Time:** 1 hour

---

### PHASE 1: Database Schema Implementation (6-8 hours)
**Assigned:** @backend-engineer

#### Task 1.1: Prisma Schema Updates
- [ ] Add `FlashCard` model to `schema.prisma`
- [ ] Add `FlashCardProgress` model to `schema.prisma`
- [ ] Add `FlashCardStatus` enum to `schema.prisma`
- [ ] Add relations to `Unit`, `Course`, `Member` models
- [ ] Add all indexes as specified in plan
- [ ] Add comprehensive comments to schema
- **Verification:** Run `npx prisma validate`
- **Owner:** @backend-engineer
- **Time:** 2 hours

#### Task 1.2: Create Migration
- [ ] Run `npx prisma migrate dev --name add_flashcards`
- [ ] Review generated SQL migration
- [ ] Test migration on development database
- [ ] Document any breaking changes
- [ ] Create rollback script if needed
- **Verification:** Migration runs successfully, all relations work
- **Owner:** @backend-engineer
- **Time:** 1.5 hours

#### Task 1.3: Update Prisma Client
- [ ] Run `npx prisma generate`
- [ ] Verify new models available in Prisma Client
- [ ] Test basic CRUD operations in Prisma Studio
- [ ] Check foreign key constraints
- **Verification:** Prisma Studio shows new tables with proper relationships
- **Owner:** @backend-engineer
- **Time:** 0.5 hours

#### Task 1.4: Create Database Seed Helpers
- [ ] Create `backend/prisma/helpers/flashcard-factory.ts`
- [ ] Add helper function: `createFlashCard()`
- [ ] Add helper function: `createFlashCardWithProgress()`
- [ ] Add data validation helpers
- **Verification:** Unit tests for helper functions pass
- **Owner:** @backend-engineer
- **Time:** 2 hours

#### Task 1.5: Write Schema Tests
- [ ] Create `backend/src/__tests__/models/flashcard.model.test.ts`
- [ ] Test FlashCard model constraints
- [ ] Test cascade deletes (unit/course deletion)
- [ ] Test unique constraints on FlashCardProgress
- [ ] Test default values
- **Verification:** All tests pass (100% coverage on models)
- **Owner:** @backend-engineer
- **Time:** 2 hours

#### Code Review Checkpoint 1.x
- [ ] Schema matches plan specification
- [ ] All indexes properly created
- [ ] Migration tested and documented
- [ ] Tests achieve 100% model coverage
- **Reviewer:** @dev-manager
- **Time:** 1 hour

---

### PHASE 2: Backend Services Implementation (14-18 hours)
**Assigned:** @backend-engineer

#### Task 2.1: FlashCard Service - Basic CRUD
- [ ] Create `backend/src/services/flashcard/flashcard.service.ts`
- [ ] Implement `getFlashCards(filters)` with pagination
- [ ] Implement `getFlashCard(id)` with error handling
- [ ] Implement `createFlashCard(data)` with validation
- [ ] Implement `updateFlashCard(id, data)` with validation
- [ ] Implement `deleteFlashCard(id)` with cascade checks
- [ ] Implement `getFlashCardsByIds(ids[])` for batch operations
- [ ] Add input validation using Zod schemas
- [ ] Add proper error handling and logging
- **Verification:** Unit tests for all CRUD operations
- **Owner:** @backend-engineer
- **Time:** 4 hours

#### Task 2.2: FlashCard Progress Service - Core Logic
- [ ] Create `backend/src/services/flashcard/flashcard-progress.service.ts`
- [ ] Implement `getProgress(memberId, flashCardId)`
- [ ] Implement `initializeProgress(memberId, flashCardId)`
- [ ] Implement `getOrCreateProgress()` helper
- [ ] Add proper error handling for race conditions
- **Verification:** Unit tests cover get/create scenarios
- **Owner:** @backend-engineer
- **Time:** 2 hours

#### Task 2.3: SM-2 Spaced Repetition Algorithm
- [ ] Create `backend/src/services/flashcard/sm2-algorithm.service.ts`
- [ ] Implement `calculateNextReview(progress, rating)`
- [ ] Implement interval calculation logic
- [ ] Implement ease factor adjustment
- [ ] Handle edge cases (first review, failures, mastery)
- [ ] Add extensive inline documentation
- [ ] Create algorithm test fixtures
- **Verification:** Unit tests with known inputs/outputs
- **Owner:** @backend-engineer
- **Time:** 3 hours

#### Task 2.4: Review Submission Logic
- [ ] Implement `submitReview(memberId, flashCardId, rating)`
- [ ] Integrate SM-2 algorithm
- [ ] Update progress statistics (totalReviews, correctReviews)
- [ ] Update nextReviewDate based on algorithm
- [ ] Handle status transitions (NEW → LEARNING → REVIEWING → MASTERED)
- [ ] Use database transactions for atomicity
- [ ] Add logging for analytics
- **Verification:** Integration tests with database
- **Owner:** @backend-engineer
- **Time:** 3 hours

#### Task 2.5: Due Cards & Statistics
- [ ] Implement `getDueCards(memberId, filters)`
- [ ] Implement efficient query with proper indexes
- [ ] Implement pagination for large result sets
- [ ] Implement `getStatistics(memberId, courseId?, unitId?)`
- [ ] Calculate cards by status breakdown
- [ ] Calculate mastery percentage
- [ ] Calculate review streak (bonus feature)
- **Verification:** Performance tests with 1000+ cards
- **Owner:** @backend-engineer
- **Time:** 3 hours

#### Task 2.6: Write Service Unit Tests
- [ ] Create `backend/src/__tests__/services/flashcard.service.test.ts`
- [ ] Test all CRUD operations
- [ ] Test filtering and pagination
- [ ] Test error scenarios (not found, invalid data)
- [ ] Create `backend/src/__tests__/services/flashcard-progress.service.test.ts`
- [ ] Test progress tracking
- [ ] Test SM-2 algorithm with various ratings
- [ ] Test edge cases (consecutive failures, mastery threshold)
- [ ] Aim for 95%+ code coverage
- **Verification:** Run `npm test` - all tests pass
- **Owner:** @backend-engineer
- **Time:** 3 hours

#### Code Review Checkpoint 2.x
- [ ] Services follow existing code patterns
- [ ] Error handling is comprehensive
- [ ] SM-2 algorithm matches specification
- [ ] Tests cover edge cases
- [ ] Code coverage > 90%
- **Reviewer:** @dev-manager + @backend-engineer (peer review)
- **Time:** 2 hours

---

### PHASE 3: Backend API Controllers & Routes (8-10 hours)
**Assigned:** @backend-engineer

#### Task 3.1: FlashCard Controllers
- [ ] Create `backend/src/controllers/flashcard/flashcard.controller.ts`
- [ ] Implement `getCourseFlashCards` handler
- [ ] Implement `getUnitFlashCards` handler
- [ ] Implement `getFlashCard` handler
- [ ] Implement `createFlashCard` handler (admin only)
- [ ] Implement `updateFlashCard` handler (admin only)
- [ ] Implement `deleteFlashCard` handler (admin only)
- [ ] Add request validation middleware
- [ ] Add response formatting
- [ ] Add error handling middleware
- **Verification:** Controller tests with mocked services
- **Owner:** @backend-engineer
- **Time:** 3 hours

#### Task 3.2: FlashCard Progress Controllers
- [ ] Create `backend/src/controllers/flashcard/flashcard-progress.controller.ts`
- [ ] Implement `submitReview` handler
- [ ] Implement `getDueCards` handler
- [ ] Implement `getStatistics` handler
- [ ] Validate rating values (1-5)
- [ ] Ensure users can only access own progress
- [ ] Add rate limiting (max 60 reviews/minute)
- **Verification:** Controller tests with auth checks
- **Owner:** @backend-engineer
- **Time:** 2 hours

#### Task 3.3: Define Routes
- [ ] Create `backend/src/routes/flashcard/flashcard.routes.ts`
- [ ] Define course flashcard routes
- [ ] Define unit flashcard routes
- [ ] Define single flashcard routes
- [ ] Apply auth middleware appropriately
- [ ] Apply admin middleware for CUD operations
- [ ] Create `backend/src/routes/flashcard/flashcard-progress.routes.ts`
- [ ] Define review submission route
- [ ] Define due cards route
- [ ] Define statistics route
- **Verification:** Route definitions match API plan
- **Owner:** @backend-engineer
- **Time:** 2 hours

#### Task 3.4: Register Routes in Main Router
- [ ] Update `backend/src/routes/index.ts`
- [ ] Mount flashcard routes at `/api/v1/`
- [ ] Test route resolution
- [ ] Document all endpoints in FLASHCARD_API.md
- **Verification:** Postman/Thunder Client tests for all endpoints
- **Owner:** @backend-engineer
- **Time:** 1 hour

#### Task 3.5: Integration Tests
- [ ] Create `backend/src/__tests__/integration/flashcard.integration.test.ts`
- [ ] Test complete flow: create card → study → review → check stats
- [ ] Test authorization (non-admin cannot create cards)
- [ ] Test user isolation (cannot access others' progress)
- [ ] Test pagination and filtering
- [ ] Test error responses (404, 400, 403)
- **Verification:** All integration tests pass
- **Owner:** @backend-engineer
- **Time:** 3 hours

#### Code Review Checkpoint 3.x
- [ ] API follows RESTful conventions
- [ ] Error responses are consistent
- [ ] Authentication and authorization work correctly
- [ ] Rate limiting is in place
- [ ] API documentation is complete
- **Reviewer:** @dev-manager
- **Time:** 1.5 hours

---

### PHASE 4: Frontend Services & State Management (8-10 hours)
**Assigned:** @frontend-engineer

#### Task 4.1: FlashCard Service (API Client)
- [ ] Create `frontend/src/services/flashcardService.ts`
- [ ] Implement `getFlashCards(unitId?, courseId?, category?)`
- [ ] Implement `getFlashCard(id)`
- [ ] Implement `createFlashCard(data)` (admin)
- [ ] Implement `updateFlashCard(id, data)` (admin)
- [ ] Implement `deleteFlashCard(id)` (admin)
- [ ] Add proper error handling and logging
- [ ] Use existing API client patterns
- **Verification:** Service methods match backend API
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Task 4.2: FlashCard Progress Service
- [ ] Add to `frontend/src/services/flashcardService.ts`
- [ ] Implement `getDueCards(filters?)`
- [ ] Implement `submitReview(flashCardId, rating)`
- [ ] Implement `getProgress(flashCardId)`
- [ ] Implement `getStatistics(courseId?, unitId?)`
- [ ] Handle network errors gracefully
- [ ] Add retry logic for failed review submissions
- **Verification:** Service calls work with backend
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Task 4.3: Zustand Store for FlashCards
- [ ] Create `frontend/src/stores/flashcardStore.ts`
- [ ] Define `FlashCardStore` interface
- [ ] Implement `loadDeck(cards)` action
- [ ] Implement `flipCard()` action
- [ ] Implement `nextCard()` action
- [ ] Implement `previousCard()` action
- [ ] Implement `submitRating(rating)` action
- [ ] Implement `resetSession()` action
- [ ] Track session statistics
- [ ] Add TypeScript types
- **Verification:** Store state updates correctly
- **Owner:** @frontend-engineer
- **Time:** 2.5 hours

#### Task 4.4: Write Service Tests
- [ ] Create `frontend/src/__tests__/services/flashcardService.test.ts`
- [ ] Mock API calls with MSW or similar
- [ ] Test successful API calls
- [ ] Test error handling
- [ ] Test retry logic
- [ ] Create `frontend/src/__tests__/stores/flashcardStore.test.ts`
- [ ] Test all store actions
- [ ] Test state transitions
- **Verification:** All tests pass
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Code Review Checkpoint 4.x
- [ ] Services use existing API patterns
- [ ] Store follows Zustand best practices
- [ ] Error handling is user-friendly
- [ ] TypeScript types are complete
- **Reviewer:** @dev-manager + @frontend-engineer (peer review)
- **Time:** 1 hour

---

### PHASE 5: Frontend Components (16-20 hours)
**Assigned:** @frontend-engineer

#### Task 5.1: FlashCard Component (Single Card)
- [ ] Create `frontend/src/components/flashcards/FlashCard.tsx`
- [ ] Implement front/back content rendering
- [ ] Add 3D flip animation (CSS transforms)
- [ ] Support Arabic text with RTL layout
- [ ] Add click/tap to flip
- [ ] Add category badge
- [ ] Add difficulty indicator
- [ ] Style with Tailwind CSS
- [ ] Make responsive for mobile
- **Verification:** Component renders correctly, flip animation smooth
- **Owner:** @frontend-engineer
- **Time:** 3 hours

#### Task 5.2: FlashCardDeck Component (Container)
- [ ] Create `frontend/src/components/flashcards/FlashCardDeck.tsx`
- [ ] Accept props: `unitId`, `courseId`, `mode`
- [ ] Fetch cards based on mode ('study' | 'review')
- [ ] Manage current card index
- [ ] Track session start time
- [ ] Show progress bar
- [ ] Handle empty state
- [ ] Handle loading state
- **Verification:** Deck loads and navigates between cards
- **Owner:** @frontend-engineer
- **Time:** 3 hours

#### Task 5.3: FlashCardReview Component (Rating)
- [ ] Create `frontend/src/components/flashcards/FlashCardReview.tsx`
- [ ] Add 5 rating buttons (1-5)
- [ ] Show rating descriptions
- [ ] Add visual feedback on hover/click
- [ ] Implement keyboard shortcuts (1-5 keys)
- [ ] Show next review date after rating
- [ ] Disable buttons during submission
- [ ] Show loading state
- **Verification:** Rating submission works, UI provides feedback
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Task 5.4: FlashCardStats Component (Dashboard)
- [ ] Create `frontend/src/components/flashcards/FlashCardStats.tsx`
- [ ] Show cards by status (New, Learning, Reviewing, Mastered)
- [ ] Show cards due today
- [ ] Show mastery percentage
- [ ] Add optional charts (recharts or similar)
- [ ] Make responsive
- [ ] Add loading skeleton
- **Verification:** Stats display correctly with real data
- **Owner:** @frontend-engineer
- **Time:** 2.5 hours

#### Task 5.5: FlashCardList Component (Admin)
- [ ] Create `frontend/src/components/flashcards/FlashCardList.tsx`
- [ ] Display cards in table/grid view
- [ ] Add filter by category dropdown
- [ ] Add search functionality
- [ ] Add pagination controls
- [ ] Show edit/delete buttons (admin only)
- [ ] Handle empty state
- **Verification:** List displays, filters work, pagination works
- **Owner:** @frontend-engineer
- **Time:** 3 hours

#### Task 5.6: Write Component Tests
- [ ] Create tests for FlashCard component
- [ ] Test flip animation triggers
- [ ] Test Arabic text rendering
- [ ] Create tests for FlashCardDeck
- [ ] Test navigation between cards
- [ ] Test loading and error states
- [ ] Create tests for FlashCardReview
- [ ] Test rating submissions
- [ ] Test keyboard shortcuts
- [ ] Aim for 80%+ component coverage
- **Verification:** Run `npm test` - all component tests pass
- **Owner:** @frontend-engineer
- **Time:** 3 hours

#### Code Review Checkpoint 5.x
- [ ] Components follow React best practices
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Responsive design works on mobile
- [ ] Animations are performant
- [ ] Loading and error states handled
- **Reviewer:** @dev-manager + @frontend-engineer
- **Time:** 2 hours

---

### PHASE 6: Frontend Pages (12-14 hours)
**Assigned:** @frontend-engineer

#### Task 6.1: StudySessionPage
- [ ] Create `frontend/src/pages/flashcards/StudySessionPage.tsx`
- [ ] Set up route: `/flashcards/study/:unitId` and `/flashcards/study/:courseId`
- [ ] Integrate FlashCardDeck component
- [ ] Add session timer
- [ ] Add exit/pause functionality
- [ ] Add keyboard shortcuts documentation
- [ ] Full-screen mode option
- [ ] Show session statistics on completion
- **Verification:** Complete study session end-to-end
- **Owner:** @frontend-engineer
- **Time:** 3 hours

#### Task 6.2: ReviewSessionPage
- [ ] Create `frontend/src/pages/flashcards/ReviewSessionPage.tsx`
- [ ] Set up route: `/flashcards/review`
- [ ] Fetch only due cards
- [ ] Show completion message when done
- [ ] Celebrate streak milestones
- [ ] Show next review times
- [ ] Option to continue with non-due cards
- **Verification:** Review session completes, due cards filtered correctly
- **Owner:** @frontend-engineer
- **Time:** 2.5 hours

#### Task 6.3: UnitFlashCardsPage
- [ ] Create `frontend/src/pages/courses/UnitFlashCardsPage.tsx`
- [ ] Set up route: `/courses/:courseId/units/:unitId/flashcards`
- [ ] Show all cards for unit
- [ ] Add "Study All" button
- [ ] Add "Review Due" button with count
- [ ] Show progress: X/Y mastered
- [ ] Integrate FlashCardList component
- **Verification:** Page displays unit's flash cards correctly
- **Owner:** @frontend-engineer
- **Time:** 2.5 hours

#### Task 6.4: CourseFlashCardsPage
- [ ] Create `frontend/src/pages/courses/FlashCardsPage.tsx`
- [ ] Set up route: `/courses/:courseId/flashcards`
- [ ] Show flash cards from all units
- [ ] Add filter by unit dropdown
- [ ] Add filter by category
- [ ] Show course-level statistics
- [ ] Add "Review All Due" button
- **Verification:** Course overview shows aggregated data
- **Owner:** @frontend-engineer
- **Time:** 3 hours

#### Task 6.5: Update Routing
- [ ] Update `frontend/src/App.tsx` or router config
- [ ] Add all flash card routes
- [ ] Add route guards (auth required)
- [ ] Test deep linking
- [ ] Test browser back/forward navigation
- **Verification:** All routes accessible and working
- **Owner:** @frontend-engineer
- **Time:** 1 hour

#### Task 6.6: Write Page Tests
- [ ] Create E2E tests for StudySessionPage
- [ ] Test complete study flow
- [ ] Create E2E tests for ReviewSessionPage
- [ ] Test review submission and progress
- [ ] Create tests for navigation between pages
- **Verification:** E2E tests pass
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Code Review Checkpoint 6.x
- [ ] Pages follow existing design patterns
- [ ] Navigation flows are intuitive
- [ ] Loading states handled
- [ ] Error boundaries in place
- **Reviewer:** @dev-manager
- **Time:** 1.5 hours

---

### PHASE 7: Integration with Existing Features (6-8 hours)
**Assigned:** @frontend-engineer

#### Task 7.1: Unit Page Integration
- [ ] Update `frontend/src/pages/courses/UnitViewer.tsx`
- [ ] Add "Flash Cards" tab/section
- [ ] Show flash card count for unit
- [ ] Add "Study Cards" CTA button
- [ ] Show progress: "12/15 mastered"
- [ ] Link to UnitFlashCardsPage
- **Verification:** Unit page shows flash card info correctly
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Task 7.2: Course Page Integration
- [ ] Update `frontend/src/pages/courses/CoursePage.tsx` or detail page
- [ ] Add Flash Cards overview card
- [ ] Show total cards in course
- [ ] Show cards due today count
- [ ] Show mastery percentage
- [ ] Add "Review Now" CTA
- [ ] Link to CourseFlashCardsPage
- **Verification:** Course page displays flash card summary
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Task 7.3: Dashboard Widget (Optional for MVP)
- [ ] Update dashboard page
- [ ] Add "Daily Flash Cards" widget
- [ ] Show due cards count
- [ ] Show current streak
- [ ] Add quick link to review session
- [ ] Show mini chart of weekly reviews
- **Verification:** Widget displays and links work
- **Owner:** @frontend-engineer
- **Time:** 2.5 hours

#### Code Review Checkpoint 7.x
- [ ] Integrations don't break existing functionality
- [ ] New UI elements match design system
- [ ] Links navigate correctly
- **Reviewer:** @frontend-engineer (peer) + @dev-manager
- **Time:** 1 hour

---

### PHASE 8: Seed Data Creation (6-8 hours)
**Assigned:** @backend-engineer + Content Creator

#### Task 8.1: Create Seed Script Structure
- [ ] Create `backend/prisma/seed-sarf-flashcards.ts`
- [ ] Set up imports and Prisma client
- [ ] Create helper function for batch card creation
- [ ] Add error handling and logging
- [ ] Add progress indicators
- **Verification:** Script structure is clean and reusable
- **Owner:** @backend-engineer
- **Time:** 1 hour

#### Task 8.2: Create Flash Cards for Unit 1 (Introduction)
- [ ] Create 15-20 cards covering:
  - Morphological scale (فَعَلَ)
  - Sarf terminology
  - Root system basics
- [ ] Mix categories: vocabulary, definition, rules
- [ ] Mix difficulties: 30% easy, 50% medium, 20% hard
- [ ] Include Arabic text with diacritics
- [ ] Add to seed script
- **Verification:** Content reviewed for accuracy
- **Owner:** Content Creator + @backend-engineer
- **Time:** 1.5 hours

#### Task 8.3: Create Flash Cards for Units 2-7
- [ ] Unit 2 (Forms I-V): 15-20 cards
- [ ] Unit 3 (Forms VI-X): 15-20 cards
- [ ] Unit 4 (Mithal Verbs): 12-15 cards
- [ ] Unit 5 (Ajwaf Verbs): 12-15 cards
- [ ] Unit 6 (Naqis Verbs): 12-15 cards
- [ ] Unit 7 (Lafeef & Practice): 15-20 cards
- [ ] Ensure variety in question types
- [ ] Include practical examples
- **Verification:** Content reviewed by Islamic scholar
- **Owner:** Content Creator + @backend-engineer
- **Time:** 4 hours

#### Task 8.4: Add Package.json Script
- [ ] Add `"db:seed:sarf:flashcards": "ts-node prisma/seed-sarf-flashcards.ts"`
- [ ] Test script execution
- [ ] Verify cards created in database
- [ ] Check relationships (unit, course) are correct
- **Verification:** Run script, check Prisma Studio
- **Owner:** @backend-engineer
- **Time:** 0.5 hours

#### Task 8.5: Theological Review
- [ ] Submit all flash card content for review
- [ ] Verify Quranic references are correct
- [ ] Verify Arabic diacritics are accurate
- [ ] Verify Islamic terminology is proper
- [ ] Make any requested corrections
- **Verification:** Signed off by Islamic scholar
- **Owner:** Content Creator + Islamic Scholar
- **Time:** 2 hours

#### Code Review Checkpoint 8.x
- [ ] Seed data is comprehensive
- [ ] Arabic text is properly formatted
- [ ] Content is theologically accurate
- [ ] Difficulty levels are appropriate
- **Reviewer:** @dev-manager + Islamic Scholar
- **Time:** 1 hour

---

### PHASE 9: Testing & Quality Assurance (8-10 hours)
**Assigned:** @qa-engineer + All Team

#### Task 9.1: Unit Test Coverage Review
- [ ] Run backend test coverage report
- [ ] Ensure 90%+ coverage on services
- [ ] Run frontend test coverage report
- [ ] Ensure 80%+ coverage on components
- [ ] Fix any failing tests
- [ ] Add tests for uncovered edge cases
- **Verification:** Coverage reports meet thresholds
- **Owner:** @qa-engineer
- **Time:** 2 hours

#### Task 9.2: Integration Testing
- [ ] Test complete flow: create card → study → review
- [ ] Test spaced repetition scheduling
- [ ] Test progress tracking accuracy
- [ ] Test statistics calculation
- [ ] Test concurrent review submissions
- [ ] Test with 100+ cards in deck
- **Verification:** All integration tests pass
- **Owner:** @qa-engineer
- **Time:** 2 hours

#### Task 9.3: End-to-End Testing
- [ ] Test user registration → study session → mastery
- [ ] Test different rating scenarios (1-5)
- [ ] Test navigation between pages
- [ ] Test browser refresh during session
- [ ] Test mobile responsiveness
- [ ] Test keyboard shortcuts
- **Verification:** E2E test suite passes
- **Owner:** @qa-engineer
- **Time:** 2 hours

#### Task 9.4: Performance Testing
- [ ] Test with 500+ flash cards in course
- [ ] Measure API response times (< 200ms)
- [ ] Test pagination performance
- [ ] Test due cards query with 1000+ users
- [ ] Check database query efficiency
- [ ] Profile frontend rendering performance
- **Verification:** Performance meets requirements
- **Owner:** @qa-engineer + @backend-engineer
- **Time:** 2 hours

#### Task 9.5: Accessibility Testing
- [ ] Test with screen reader
- [ ] Test keyboard-only navigation
- [ ] Check color contrast ratios
- [ ] Test with browser zoom (200%)
- [ ] Verify ARIA labels
- [ ] Test focus management
- **Verification:** WCAG 2.1 AA compliance
- **Owner:** @qa-engineer + @frontend-engineer
- **Time:** 1.5 hours

#### Task 9.6: Cross-Browser & Device Testing
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test on tablets
- [ ] Document any browser-specific issues
- **Verification:** Works on all major browsers/devices
- **Owner:** @qa-engineer
- **Time:** 1.5 hours

#### Code Review Checkpoint 9.x
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Accessibility issues resolved
- [ ] Cross-browser compatibility confirmed
- **Reviewer:** @dev-manager + @qa-engineer
- **Time:** 2 hours

---

### PHASE 10: UI/UX Polish & Animations (4-6 hours)
**Assigned:** @frontend-engineer

#### Task 10.1: Card Flip Animation Polish
- [ ] Fine-tune flip animation timing
- [ ] Add subtle entrance animations
- [ ] Add hover effects
- [ ] Test animation performance
- [ ] Reduce motion for accessibility preference
- **Verification:** Animations smooth at 60fps
- **Owner:** @frontend-engineer
- **Time:** 1.5 hours

#### Task 10.2: Keyboard Shortcuts Implementation
- [ ] Document all shortcuts in UI
- [ ] Add shortcut hints overlay (?)
- [ ] Test all keyboard interactions
- [ ] Handle edge cases (modal open, etc.)
- **Verification:** All shortcuts work as documented
- **Owner:** @frontend-engineer
- **Time:** 1 hour

#### Task 10.3: Mobile Swipe Gestures
- [ ] Implement swipe left/right for navigation
- [ ] Implement tap to flip
- [ ] Add visual feedback for gestures
- [ ] Test on actual mobile devices
- **Verification:** Gestures feel natural on mobile
- **Owner:** @frontend-engineer
- **Time:** 2 hours

#### Task 10.4: Loading & Error States
- [ ] Review all loading states
- [ ] Add skeleton loaders where appropriate
- [ ] Improve error messages
- [ ] Add retry buttons for failed actions
- [ ] Add empty state illustrations
- **Verification:** All states provide clear feedback
- **Owner:** @frontend-engineer
- **Time:** 1.5 hours

#### Code Review Checkpoint 10.x
- [ ] Animations enhance UX without being distracting
- [ ] Keyboard shortcuts documented and working
- [ ] Mobile gestures feel natural
- [ ] Loading states provide good feedback
- **Reviewer:** @dev-manager + @frontend-engineer
- **Time:** 1 hour

---

### PHASE 11: Documentation (4-5 hours)
**Assigned:** @dev-manager + All Team

#### Task 11.1: API Documentation
- [ ] Complete FLASHCARD_API.md with all endpoints
- [ ] Add request/response examples
- [ ] Document error codes and messages
- [ ] Add authentication requirements
- [ ] Add rate limiting details
- **Verification:** API docs are complete and accurate
- **Owner:** @backend-engineer + @dev-manager
- **Time:** 1.5 hours

#### Task 11.2: User Documentation
- [ ] Create user guide for flash cards feature
- [ ] Document how to create study sessions
- [ ] Explain spaced repetition system
- [ ] Add tips for effective studying
- [ ] Include screenshots/GIFs
- **Verification:** Documentation is user-friendly
- **Owner:** @dev-manager
- **Time:** 1.5 hours

#### Task 11.3: Developer Documentation
- [ ] Document flash card component architecture
- [ ] Add code examples for common tasks
- [ ] Document state management patterns
- [ ] Add troubleshooting guide
- [ ] Update CONTRIBUTING.md
- **Verification:** Developers can onboard to feature
- **Owner:** @dev-manager + @backend-engineer + @frontend-engineer
- **Time:** 1.5 hours

#### Task 11.4: Update README and CHANGELOG
- [ ] Add flash cards to features list in README
- [ ] Update CHANGELOG with new feature
- [ ] Add migration notes
- [ ] Document breaking changes (if any)
- **Verification:** Documentation reviewed by team
- **Owner:** @dev-manager
- **Time:** 0.5 hours

---

### PHASE 12: Deployment Preparation (3-4 hours)
**Assigned:** @dev-manager + @backend-engineer

#### Task 12.1: Database Migration Plan
- [ ] Review migration scripts for production
- [ ] Create rollback plan
- [ ] Estimate migration time
- [ ] Plan for zero-downtime migration
- [ ] Document migration steps
- **Verification:** Migration plan reviewed and approved
- **Owner:** @backend-engineer + @dev-manager
- **Time:** 1 hour

#### Task 12.2: Environment Configuration
- [ ] Add flash card feature flags (if using)
- [ ] Configure Redis caching settings
- [ ] Set up monitoring for new endpoints
- [ ] Configure logging for analytics
- [ ] Review rate limiting settings
- **Verification:** Configuration documented
- **Owner:** @dev-manager
- **Time:** 1 hour

#### Task 12.3: Deployment Checklist
- [ ] Create pre-deployment checklist
- [ ] Create post-deployment verification steps
- [ ] Define rollback procedure
- [ ] Assign deployment roles
- [ ] Schedule deployment window
- **Verification:** Checklist complete and approved
- **Owner:** @dev-manager
- **Time:** 1 hour

#### Task 12.4: Staging Deployment
- [ ] Deploy to staging environment
- [ ] Run full test suite on staging
- [ ] Perform smoke tests
- [ ] Verify database migration
- [ ] Test with production-like data
- **Verification:** Staging deployment successful
- **Owner:** @dev-manager + All Team
- **Time:** 1.5 hours

---

### PHASE 13: Production Deployment (2-3 hours)
**Assigned:** @dev-manager

#### Task 13.1: Pre-Deployment
- [ ] Final code review of all changes
- [ ] Merge feature branch to main
- [ ] Tag release version
- [ ] Backup production database
- [ ] Notify users of upcoming feature
- **Verification:** Pre-deployment checklist complete
- **Owner:** @dev-manager
- **Time:** 0.5 hours

#### Task 13.2: Deploy to Production
- [ ] Run database migration on production
- [ ] Deploy backend services
- [ ] Deploy frontend application
- [ ] Verify deployment health checks
- [ ] Monitor error rates
- **Verification:** All services running, no errors
- **Owner:** @dev-manager
- **Time:** 1 hour

#### Task 13.3: Post-Deployment Verification
- [ ] Test flash card creation
- [ ] Test study session
- [ ] Test review submission
- [ ] Test statistics display
- [ ] Verify analytics tracking
- [ ] Monitor performance metrics
- **Verification:** Feature working in production
- **Owner:** @dev-manager + All Team
- **Time:** 0.5 hours

#### Task 13.4: Seed Production Data
- [ ] Run flash card seed script on production
- [ ] Verify all cards created correctly
- [ ] Check unit/course relationships
- [ ] Announce feature launch to users
- **Verification:** Content available in production
- **Owner:** @backend-engineer + @dev-manager
- **Time:** 0.5 hours

#### Task 13.5: Monitor & Support
- [ ] Monitor error logs for 24 hours
- [ ] Track user engagement metrics
- [ ] Collect user feedback
- [ ] Address any critical issues
- [ ] Document lessons learned
- **Verification:** Feature stable, users engaged
- **Owner:** All Team
- **Time:** Ongoing

---

## Task Delegation Summary

### @dev-manager
**Total Time:** ~15 hours
- Phase 0: Pre-implementation setup (4 hours)
- All code review checkpoints (10 hours)
- Phase 11: Documentation (3 hours)
- Phase 12-13: Deployment (5 hours)

### @backend-engineer
**Total Time:** ~36 hours
- Phase 1: Database schema (8 hours)
- Phase 2: Backend services (18 hours)
- Phase 3: Backend API (10 hours)
- Phase 8: Seed data (technical) (4 hours)
- Support testing phases (variable)

### @frontend-engineer
**Total Time:** ~40 hours
- Phase 4: Frontend services & state (10 hours)
- Phase 5: Frontend components (20 hours)
- Phase 6: Frontend pages (14 hours)
- Phase 7: Integration (6 hours)
- Phase 10: UI polish (6 hours)
- Support testing phases (variable)

### @qa-engineer
**Total Time:** ~12 hours
- Phase 9: Testing & QA (12 hours)
- Support throughout all phases (variable)
- Post-deployment verification (2 hours)

### Content Creator + Islamic Scholar
**Total Time:** ~8 hours
- Phase 8: Flash card content creation (6 hours)
- Phase 8: Theological review (2 hours)

---

## Verification Checkpoints Schedule

| Checkpoint | When | Who Reviews | Critical Items |
|------------|------|-------------|----------------|
| CP 1.x | After Phase 1 | @dev-manager | Schema correctness, migrations tested |
| CP 2.x | After Phase 2 | @dev-manager + peer | Services tested, algorithm correct |
| CP 3.x | After Phase 3 | @dev-manager | API complete, auth working |
| CP 4.x | After Phase 4 | @dev-manager + peer | Services integrated, types complete |
| CP 5.x | After Phase 5 | @dev-manager + peer | Components tested, responsive |
| CP 6.x | After Phase 6 | @dev-manager | Pages complete, routing works |
| CP 7.x | After Phase 7 | @frontend-engineer + @dev-manager | Integration doesn't break existing |
| CP 8.x | After Phase 8 | @dev-manager + Scholar | Content accurate, theologically sound |
| CP 9.x | After Phase 9 | @dev-manager + @qa-engineer | All tests pass, performance good |
| CP 10.x | After Phase 10 | @dev-manager + @frontend-engineer | UX polished, accessible |
| Final Review | Before deployment | All team | Feature complete and ready |

---

## Risk Mitigation

### High-Risk Areas
1. **SM-2 Algorithm Implementation**
   - Risk: Incorrect calculations
   - Mitigation: Extensive unit tests with known values, algorithm code review
   
2. **Database Migration**
   - Risk: Data loss or downtime
   - Mitigation: Test on staging, have rollback plan, backup data
   
3. **Arabic Text Handling**
   - Risk: Diacritics or RTL issues
   - Mitigation: Test with actual Arabic content, review by native speaker
   
4. **Theological Accuracy**
   - Risk: Incorrect Islamic content
   - Mitigation: Mandatory scholar review before launch

### Medium-Risk Areas
1. **Performance with Large Datasets**
   - Mitigation: Performance testing, proper indexing, pagination
   
2. **Cross-Browser Compatibility**
   - Mitigation: Test on all major browsers, use polyfills

---

## Success Criteria

### Pre-Launch Checklist
- [ ] All 96 tasks completed
- [ ] All unit tests passing (>90% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Performance benchmarks met
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Theological review approved
- [ ] Documentation complete
- [ ] Staging deployment successful
- [ ] Team sign-off received

### Post-Launch Metrics (First Month)
- [ ] 50%+ of active students try flash cards
- [ ] <1% error rate on review submissions
- [ ] Average session duration > 5 minutes
- [ ] Positive user feedback (>4/5 rating)
- [ ] No critical bugs reported

---

**Document Status:** Ready for Implementation  
**Start Date:** TBD  
**Target Completion:** 8 weeks from start  
**Next Action:** Team kickoff meeting to assign tasks and set timeline

# Test Suite Overhaul Plan

## Executive Summary

The Islamic Learning Platform currently has **107 total tests** with **19 failing** due to outdated mock expectations. This document outlines the strategy to fix existing tests, remove obsolete ones, and add critical missing test coverage.

## Current Test Status

### ✅ Passing Tests (79/107)
- **SM-2 Algorithm Service** (31 tests) - All passing ✅
  - Spaced repetition calculations
  - Status transitions (NEW → LEARNING → REVIEWING → MASTERED)
  - Interval calculations
  - Ease factor adjustments
  
- **SRS Service** (9 tests) - All passing ✅
  - Spaced repetition system logic
  
- **Course Service** (16 tests) - All passing ✅
  - Course CRUD operations
  
- **Auth Service** (23 tests estimated) - Passing ✅
  - User authentication
  - Token management

### ❌ Failing Tests (19/107)
- **FlashCard Service** (19/30 failing) ⚠️
  - Mock expectations don't match current implementation
  - Tests written before service added relation includes
  - Tests checking for removed/renamed methods

### 🆕 Missing Integration Tests
- **Flashcard Study Session** - Created but needs database
- **Frontend Learning Flow** - Exists but needs review

## Root Causes of Test Failures

### 1. Service Evolution Without Test Updates

**Problem:** Service code evolved to include relations and change default behaviors, but tests still expect old mock calls.

**Example:**
```typescript
// OLD TEST EXPECTATION:
expect(mockPrisma.flashCard.create).toHaveBeenCalledWith({
  data: createData
});

// ACTUAL IMPLEMENTATION NOW INCLUDES:
prisma.flashCard.create({
  data: createData,
  include: {
    unit: { select: { id: true, title: true } },
    course: { select: { id: true, title: true } }
  }
});
```

**Impact:** 15+ tests failing due to mock mismatch

### 2. Tests for Deprecated Methods

**Problem:** Tests exist for methods that were renamed or removed.

**Example:**
```typescript
// TEST:
it('should return card by ID', async () => {
  const result = await flashCardService.getFlashCardById('card-1');
  // ❌ ERROR: getFlashCardById is not a function
});

// ACTUAL SERVICE:
// Method was replaced with getFlashCards({ filters })
```

**Impact:** 4 tests failing

### 3. Incomplete Mock Error Handling

**Problem:** Tests throw unhandled rejections instead of properly catching and asserting errors.

**Impact:** 4 error events during test runs

### 4. Missing Integration Tests

**Problem:** Unit tests exist, but integration tests that verify end-to-end flows are missing or incomplete.

**Missing Coverage:**
- Complete study session flow (created but needs database)
- Progress persistence after rating cards
- Statistics calculation after session complete
- Card status transitions with real database

## Test Overhaul Strategy

### Phase 1: Fix Existing Unit Tests ⏱️ Est. 2 hours

#### 1.1 Update FlashCard Service Tests
**File:** `backend/src/__tests__/flashcard/flashcard.service.test.ts`

**Actions:**
- ✅ Update `createFlashCard` tests to expect `include` in mock calls
- ✅ Update `getFlashCards` tests to expect default pagination values (limit: 50, offset: 0)
- ✅ Update all tests to expect relation includes
- ❌ Remove tests for `getFlashCardById` (method no longer exists)
- ✅ Add proper error handling to tests that throw rejections
- ✅ Update mock return values to include `unit` and `course` relations

**Expected Outcome:** All 30 tests passing

#### 1.2 Review Other Service Tests
**Files:**
- `backend/src/__tests__/auth.service.test.ts` - Already passing
- `backend/src/__tests__/course.service.test.ts` - Already passing
- `backend/src/__tests__/srs.service.test.ts` - Already passing
- `backend/src/__tests__/flashcard/sm2-algorithm.service.test.ts` - Already passing ✅

**Actions:** No changes needed

### Phase 2: Add Missing Tests ⏱️ Est. 3 hours

#### 2.1 Critical Path Tests
Add tests for paths that directly affect user experience:

**Progress Service Tests** (NEW)
```typescript
// backend/src/__tests__/flashcard/progress.service.test.ts
describe('Progress Service', () => {
  describe('submitReview', () => {
    it('should transition NEW → LEARNING on first successful rating');
    it('should transition LEARNING → REVIEWING on second success');
    it('should update statistics after review');
    it('should calculate correct next review date');
    it('should reset repetitions on failure (rating < 3)');
  });
  
  describe('getStatistics', () => {
    it('should count cards by status correctly');
    it('should filter by courseId');
    it('should filter by unitId');
    it('should calculate mastery percentage');
  });
});
```

**Progress Controller Tests** (NEW)
```typescript
// backend/src/__tests__/controllers/progress.controller.test.ts
describe('Progress Controller', () => {
  it('should pass parameters in correct order to service');
  it('should return 200 with progress data on successful review');
  it('should return 404 if card not found');
  it('should validate rating is 1-5');
});
```

#### 2.2 Frontend Store Tests (NEW)
```typescript
// frontend/src/__tests__/stores/flashCardStore.test.ts
describe('FlashCard Store', () => {
  describe('rateCurrentCard', () => {
    it('should update UI optimistically before API call');
    it('should advance to next card immediately');
    it('should call submitReview in background');
    it('should handle API errors gracefully');
  });
  
  describe('submitReview', () => {
    it('should return progress object from API');
    it('should update flashcardProgress state');
  });
});
```

### Phase 3: Setup Integration Testing Infrastructure ⏱️ Est. 1 hour

#### 3.1 Test Database Configuration

**Create:** `backend/.env.test`
```env
NODE_ENV=test
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/islamic_learning_test"
REDIS_URL="redis://localhost:6379/1"
JWT_SECRET="test-secret"
JWT_REFRESH_SECRET="test-refresh-secret"
```

**Actions:**
1. Create separate test database
2. Run migrations on test database
3. Add seed data for tests
4. Configure Vitest to use test environment

#### 3.2 Integration Test Execution

**Existing Test:** `backend/src/__tests__/integration/flashcard-study-session.test.ts`

**Prerequisites:**
- ✅ Test file created (340+ lines)
- ❌ Test database configured
- ❌ Seed data available
- ❌ Prisma client configured for test environment

**Actions:**
1. Setup test database
2. Run integration tests
3. Verify study session flow works end-to-end
4. Fix any issues found

### Phase 4: Frontend Integration Tests ⏱️ Est. 2 hours

#### 4.1 Review Existing Frontend Test
**File:** `frontend/src/__tests__/integration/learning-flow.test.ts`

**Actions:**
1. Review test coverage
2. Update if needed to match current implementation
3. Add tests for:
   - Study session completion
   - Statistics refresh after navigation
   - Progress chart updates
   - Card auto-advancement

## Test Coverage Goals

### Current Coverage
- Backend Unit Tests: ~60% (estimated)
- Backend Integration Tests: 0% (can't run without database)
- Frontend Unit Tests: <10%
- Frontend Integration Tests: Minimal

### Target Coverage
- Backend Unit Tests: 80%+
- Backend Integration Tests: 60%+ (critical paths)
- Frontend Unit Tests: 70%+
- Frontend Integration Tests: 50%+ (user journeys)

## Testing Best Practices to Enforce

### 1. Test Naming Convention
```typescript
// ✅ GOOD
it('should transition card from NEW to LEARNING on first successful rating')

// ❌ BAD
it('works correctly')
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should calculate correct interval', () => {
  // Arrange
  const rating = 5;
  const currentInterval = 1;
  
  // Act
  const result = calculateInterval(rating, currentInterval);
  
  // Assert
  expect(result.interval).toBe(6);
});
```

### 3. Mock Only External Dependencies
```typescript
// ✅ GOOD: Mock database, not business logic
vi.mock('../../config/database');

// ❌ BAD: Don't mock the service you're testing
vi.mock('../../services/flashcard.service');
```

### 4. Integration Tests Use Real Database
```typescript
// Integration test - no mocks
beforeAll(async () => {
  await prisma.$connect();
  await seedTestData();
});

afterAll(async () => {
  await cleanupTestData();
  await prisma.$disconnect();
});
```

## Estimated Timeline

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| Phase 1 | Fix existing unit tests | 2 hours | 🔴 Not Started |
| Phase 2 | Add missing unit tests | 3 hours | 🔴 Not Started |
| Phase 3 | Setup integration testing | 1 hour | 🔴 Not Started |
| Phase 4 | Frontend integration tests | 2 hours | 🔴 Not Started |
| **Total** | | **8 hours** | |

## Success Criteria

✅ **All unit tests passing** (0 failures)
✅ **Integration tests executable** (database configured)
✅ **Critical paths covered** (study session flow tested end-to-end)
✅ **80%+ backend code coverage** (measured by Vitest)
✅ **Tests run in CI/CD** (automated on every commit)
✅ **No unhandled rejections** (proper error handling)
✅ **Documentation updated** (testing guide for contributors)

## Priority Order

### Immediate (Today)
1. ✅ Document current state (this file)
2. 🔴 Fix flashcard.service.test.ts
3. 🔴 Remove tests for deprecated methods

### High Priority (This Week)
4. 🔴 Add Progress Service tests
5. 🔴 Setup test database
6. 🔴 Run integration tests

### Medium Priority (Next Week)
7. 🔴 Add frontend store tests
8. 🔴 Update frontend integration tests
9. 🔴 Measure code coverage

### Low Priority (Backlog)
10. 🔴 Add E2E tests with Playwright
11. 🔴 Performance tests
12. 🔴 Load tests

## Next Steps

1. **Start with Phase 1.1**: Fix the 19 failing tests in `flashcard.service.test.ts`
2. **Run tests frequently**: After each fix, run `npm test` to verify
3. **Document findings**: Update this document with any new issues discovered
4. **Pair with integration tests**: Once unit tests pass, setup database for integration tests

---

**Last Updated:** December 31, 2024
**Author:** Development Manager
**Status:** Planning Complete - Ready for Implementation

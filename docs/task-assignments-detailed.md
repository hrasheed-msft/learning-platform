# Islamic Learning Platform - Task Assignments

**Project:** Islamic Learning Platform  
**Date:** December 24, 2025  
**Sprint:** Feature Completion Sprint  
**Manager:** Dev Manager

---

## Executive Summary

This document contains detailed task assignments for completing the remaining features of the Islamic Learning Platform. All tasks include acceptance criteria, dependencies, and required unit tests.

---

## Frontend Tasks

### FE-001: Implement MemberProgress Page
**Assignee:** @frontend-engineer  
**Priority:** High  
**Estimated Effort:** 4 hours  
**File:** `frontend/src/pages/dashboard/MemberProgress.tsx`

**Description:**  
Replace the "Progress tracking coming soon..." placeholder with a fully functional parent analytics view showing learning progress for a specific family member.

**Acceptance Criteria:**
- [ ] Display member's enrolled courses with progress percentage
- [ ] Show completed lessons count vs total lessons
- [ ] Display time spent learning (if available)
- [ ] Show quiz scores and assessment results
- [ ] Display streak information (consecutive days of learning)
- [ ] Show SRS review statistics (cards due, cards reviewed, retention rate)
- [ ] Include progress charts/visualizations
- [ ] Handle loading and error states
- [ ] Responsive design for mobile/tablet

**API Endpoints Required:**
- `GET /api/v1/courses/enrollments/member/:memberId` - Get member's enrollments
- `GET /api/v1/courses/progress/:enrollmentId` - Get course progress
- `GET /api/v1/srs/stats/:memberId` - Get SRS statistics

**Dependencies:**
- Backend progress endpoints must return detailed data
- useCourseStore must have progress fetching capability

**Unit Tests Required:**
```typescript
describe('MemberProgress', () => {
  it('renders loading state while fetching data');
  it('displays member name and avatar');
  it('shows correct number of enrolled courses');
  it('calculates and displays progress percentage correctly');
  it('renders progress bar with correct fill');
  it('displays quiz scores when available');
  it('shows SRS statistics correctly');
  it('handles empty enrollments gracefully');
  it('handles API errors with error message');
  it('navigates to course detail on course click');
});
```

---

### FE-002: Implement ChildDashboard Page
**Assignee:** @frontend-engineer  
**Priority:** High  
**Estimated Effort:** 5 hours  
**File:** `frontend/src/pages/dashboard/ChildDashboard.tsx`

**Description:**  
Create a personalized dashboard for child users showing their courses, progress, upcoming reviews, and achievements.

**Acceptance Criteria:**
- [ ] Display personalized greeting with member name
- [ ] Show enrolled courses as interactive cards
- [ ] Display daily learning goals and streak
- [ ] Show pending SRS reviews with "Start Review" button
- [ ] Display recent achievements/badges
- [ ] Show recommended next lessons
- [ ] Include motivational elements (progress celebration, streaks)
- [ ] Age-appropriate UI design
- [ ] Handle loading and error states

**API Endpoints Required:**
- `GET /api/v1/family/members/:memberId` - Get member details
- `GET /api/v1/courses/enrollments/member/:memberId` - Get enrollments
- `GET /api/v1/srs/due/:memberId` - Get due review items
- `GET /api/v1/courses/progress/:enrollmentId` - Get progress

**Dependencies:**
- Requires member authentication context
- SRS due items endpoint

**Unit Tests Required:**
```typescript
describe('ChildDashboard', () => {
  it('renders loading spinner initially');
  it('displays personalized greeting with member name');
  it('shows enrolled courses as cards');
  it('displays correct progress for each course');
  it('shows pending review count');
  it('navigates to review session on button click');
  it('displays streak count correctly');
  it('shows empty state when no courses enrolled');
  it('handles fetch errors gracefully');
  it('renders age-appropriate content based on member age');
});
```

---

### FE-003: Connect ReviewSession to SRS API
**Assignee:** @frontend-engineer  
**Priority:** Medium  
**Estimated Effort:** 4 hours  
**File:** `frontend/src/pages/review/ReviewSession.tsx`

**Description:**  
Replace mock review data with actual SRS API integration for spaced repetition reviews.

**Acceptance Criteria:**
- [ ] Fetch due review items from SRS API on mount
- [ ] Display flashcard with question/front side
- [ ] Allow user to reveal answer/back side
- [ ] Implement rating buttons (Again, Hard, Good, Easy)
- [ ] Submit rating to SRS API and update card scheduling
- [ ] Show progress through review session
- [ ] Display session summary on completion
- [ ] Handle empty queue (no reviews due)
- [ ] Support different content types (text, audio, image)

**API Endpoints Required:**
- `GET /api/v1/srs/due/:memberId` - Get due items
- `POST /api/v1/srs/review` - Submit review rating

**Request/Response Schema:**
```json
// POST /api/v1/srs/review
{
  "cardId": "uuid",
  "memberId": "uuid",
  "rating": 1-4,  // 1=Again, 2=Hard, 3=Good, 4=Easy
  "responseTime": 3500  // milliseconds
}

// Response
{
  "success": true,
  "data": {
    "nextReviewDate": "2025-12-25T10:00:00Z",
    "interval": 1,
    "easeFactor": 2.5
  }
}
```

**Unit Tests Required:**
```typescript
describe('ReviewSession', () => {
  it('fetches due items on mount');
  it('displays first card question');
  it('reveals answer on button click');
  it('shows rating buttons after reveal');
  it('submits rating to API on selection');
  it('advances to next card after rating');
  it('shows progress indicator');
  it('displays completion summary');
  it('handles empty review queue');
  it('tracks response time correctly');
  it('handles API errors gracefully');
});
```

---

### FE-004: Implement QuizPage Data Fetch
**Assignee:** @frontend-engineer  
**Priority:** Medium  
**Estimated Effort:** 3 hours  
**File:** `frontend/src/pages/courses/QuizPage.tsx`

**Description:**  
Replace mock questions with actual assessment API integration.

**Acceptance Criteria:**
- [ ] Fetch quiz questions from API based on unit ID
- [ ] Support multiple question types (multiple choice, true/false, fill-blank)
- [ ] Display question with answer options
- [ ] Track selected answers
- [ ] Submit answers on completion
- [ ] Display results with score and feedback
- [ ] Show correct answers for incorrect responses
- [ ] Handle loading and error states
- [ ] Support quiz retry functionality

**API Endpoints Required:**
- `GET /api/v1/assessments/units/:unitId/questions` - Get questions
- `POST /api/v1/assessments/submit` - Submit answers

**Unit Tests Required:**
```typescript
describe('QuizPage', () => {
  it('fetches questions for unit on mount');
  it('displays question count');
  it('renders multiple choice options correctly');
  it('allows single answer selection');
  it('navigates between questions');
  it('tracks all selected answers');
  it('submits answers on completion');
  it('displays score result');
  it('shows correct answers for wrong responses');
  it('allows quiz retry');
  it('handles empty questions gracefully');
});
```

---

### FE-005: Implement UnitViewer Data Fetch
**Assignee:** @frontend-engineer  
**Priority:** Medium  
**Estimated Effort:** 3 hours  
**File:** `frontend/src/pages/courses/UnitViewer.tsx`

**Description:**  
Implement data fetching for unit content display.

**Acceptance Criteria:**
- [ ] Fetch unit data from API based on unit ID
- [ ] Display unit title and description
- [ ] Render lesson content (text, images, audio, video)
- [ ] Support Arabic text with proper RTL rendering
- [ ] Track lesson completion
- [ ] Show navigation to next/previous lessons
- [ ] Display quiz link when lessons complete
- [ ] Handle loading and error states

**API Endpoints Required:**
- `GET /api/v1/courses/units/:unitId` - Get unit details
- `POST /api/v1/courses/progress/lesson` - Mark lesson complete

**Unit Tests Required:**
```typescript
describe('UnitViewer', () => {
  it('fetches unit data on mount');
  it('displays unit title');
  it('renders lesson content correctly');
  it('handles Arabic text with RTL');
  it('marks lesson as complete');
  it('shows next lesson navigation');
  it('displays quiz link after completion');
  it('handles missing unit gracefully');
});
```

---

### FE-006: Implement FamilySettings Save
**Assignee:** @frontend-engineer  
**Priority:** Low  
**Estimated Effort:** 2 hours  
**File:** `frontend/src/pages/settings/FamilySettings.tsx`

**Description:**  
Implement the save functionality for family settings.

**Acceptance Criteria:**
- [ ] Collect form data for family settings
- [ ] Validate required fields
- [ ] Submit settings to API
- [ ] Show success/error notifications
- [ ] Handle loading state during save
- [ ] Support settings: notification preferences, language, timezone

**API Endpoints Required:**
- `PUT /api/v1/family/:familyId/settings` - Update settings

**Unit Tests Required:**
```typescript
describe('FamilySettings', () => {
  it('loads current settings on mount');
  it('validates required fields');
  it('submits settings on save');
  it('shows success message on save');
  it('handles validation errors');
  it('handles API errors');
  it('disables save button while loading');
});
```

---

## Backend Tasks

### BE-001: Implement Email Service
**Assignee:** @backend-engineer  
**Priority:** Low  
**Estimated Effort:** 4 hours  
**Files:** `backend/src/services/auth.service.ts`, new `backend/src/services/email.service.ts`

**Description:**  
Implement email sending functionality for verification and password reset.

**Acceptance Criteria:**
- [ ] Create EmailService with SendGrid/Nodemailer integration
- [ ] Implement email verification flow
- [ ] Implement password reset email flow
- [ ] Use email templates for consistent branding
- [ ] Handle email delivery errors gracefully
- [ ] Log email sending for debugging

**Functions to Implement:**
- `sendVerificationEmail(email: string, token: string)`
- `sendPasswordResetEmail(email: string, token: string)`
- `sendWelcomeEmail(email: string, name: string)`

**Unit Tests Required:**
```typescript
describe('EmailService', () => {
  it('sends verification email with correct token');
  it('sends password reset email with correct link');
  it('handles invalid email addresses');
  it('handles delivery failures gracefully');
  it('uses correct email template');
  it('logs email sending activity');
});
```

---

### BE-002: Implement Redis Token Invalidation
**Assignee:** @backend-engineer  
**Priority:** Low  
**Estimated Effort:** 2 hours  
**File:** `backend/src/services/auth.service.ts`

**Description:**  
Properly invalidate refresh tokens in Redis on logout.

**Acceptance Criteria:**
- [ ] Store refresh tokens in Redis with expiry
- [ ] Remove token from Redis on logout
- [ ] Validate token exists in Redis before refresh
- [ ] Handle Redis connection errors
- [ ] Implement token blacklisting for security

**Unit Tests Required:**
```typescript
describe('Token Invalidation', () => {
  it('stores refresh token in Redis on login');
  it('removes token from Redis on logout');
  it('rejects refresh with invalidated token');
  it('handles Redis connection errors');
  it('expires tokens after configured duration');
});
```

---

### BE-003: Implement AI Question Generation (Future)
**Assignee:** @backend-engineer  
**Priority:** Low  
**Estimated Effort:** 8 hours  
**File:** `backend/src/services/assessment.service.ts`

**Description:**  
Implement OpenAI integration for generating assessment questions.

**Acceptance Criteria:**
- [ ] Integrate OpenAI API
- [ ] Generate questions based on lesson content
- [ ] Support multiple question types
- [ ] Validate generated questions
- [ ] Cache generated questions
- [ ] Handle API rate limits

**Note:** This is a future enhancement and can be deferred.

---

## QA Tasks

### QA-001: Authentication Flow E2E Tests
**Assignee:** @qa-engineer  
**Priority:** High  
**Estimated Effort:** 4 hours

**Test Scope:**
- User registration flow
- Email verification (when implemented)
- User login flow
- Password reset flow
- Token refresh flow
- Logout flow

**Test Cases:**
```typescript
describe('Authentication E2E', () => {
  describe('Registration', () => {
    it('registers new user with valid data');
    it('rejects registration with existing email');
    it('validates email format');
    it('validates password requirements');
    it('creates family on registration');
  });

  describe('Login', () => {
    it('logs in with valid credentials');
    it('rejects invalid password');
    it('rejects non-existent user');
    it('returns access and refresh tokens');
    it('stores tokens in localStorage');
  });

  describe('Token Refresh', () => {
    it('refreshes expired access token');
    it('rejects invalid refresh token');
    it('updates stored tokens');
  });

  describe('Logout', () => {
    it('clears stored tokens');
    it('redirects to login page');
    it('invalidates refresh token on server');
  });
});
```

---

### QA-002: Course Enrollment E2E Tests
**Assignee:** @qa-engineer  
**Priority:** High  
**Estimated Effort:** 4 hours

**Test Scope:**
- Course catalog browsing
- Course detail viewing
- Course enrollment
- Enrollment display on dashboard

**Test Cases:**
```typescript
describe('Course Enrollment E2E', () => {
  describe('Course Catalog', () => {
    it('displays all available courses');
    it('filters courses by category');
    it('filters courses by age level');
    it('searches courses by title');
    it('displays course cards with correct info');
  });

  describe('Course Detail', () => {
    it('displays course information');
    it('shows curriculum/units list');
    it('displays enrollment options');
    it('shows family member dropdown');
  });

  describe('Enrollment', () => {
    it('enrolls family member in course');
    it('prevents duplicate enrollment');
    it('shows success message');
    it('updates dashboard enrollment count');
    it('displays enrolled course in member progress');
  });
});
```

---

### QA-003: Family Management E2E Tests
**Assignee:** @qa-engineer  
**Priority:** High  
**Estimated Effort:** 3 hours

**Test Scope:**
- Family dashboard
- Adding family members
- Member profiles
- Member progress viewing

**Test Cases:**
```typescript
describe('Family Management E2E', () => {
  describe('Family Dashboard', () => {
    it('displays family statistics');
    it('shows all family members');
    it('displays enrollment count per member');
    it('navigates to member progress');
  });

  describe('Add Member', () => {
    it('opens add member modal');
    it('validates member name');
    it('validates member age');
    it('creates member successfully');
    it('displays new member in list');
  });

  describe('Member Progress', () => {
    it('displays member enrollments');
    it('shows progress for each course');
    it('displays learning statistics');
  });
});
```

---

### QA-004: SRS Review System E2E Tests
**Assignee:** @qa-engineer  
**Priority:** Medium  
**Estimated Effort:** 4 hours

**Test Scope:**
- Review session flow
- Card rating submission
- Scheduling updates
- Review statistics

**Test Cases:**
```typescript
describe('SRS Review E2E', () => {
  describe('Review Session', () => {
    it('starts review session');
    it('displays flashcard front');
    it('reveals card back on action');
    it('shows rating options');
    it('submits rating successfully');
    it('advances to next card');
    it('completes session');
    it('displays session summary');
  });

  describe('Review Scheduling', () => {
    it('schedules next review based on rating');
    it('updates card interval');
    it('calculates due cards correctly');
  });
});
```

---

### QA-005: Quiz/Assessment E2E Tests
**Assignee:** @qa-engineer  
**Priority:** Medium  
**Estimated Effort:** 3 hours

**Test Scope:**
- Quiz loading
- Question navigation
- Answer submission
- Results display

**Test Cases:**
```typescript
describe('Quiz E2E', () => {
  describe('Quiz Session', () => {
    it('loads quiz questions');
    it('displays question and options');
    it('allows answer selection');
    it('navigates between questions');
    it('submits quiz on completion');
    it('displays quiz results');
    it('shows correct answers');
    it('allows quiz retry');
  });
});
```

---

## Integration Tests

### INT-001: Full Learning Flow Integration
**Assignee:** @qa-engineer  
**Priority:** High  
**Estimated Effort:** 6 hours

**Test Scenario:**
Complete user journey from registration to completing a lesson.

**Steps:**
1. Register new user
2. Login
3. Browse courses
4. Add family member
5. Enroll member in course
6. View course content
7. Complete lesson
8. Take quiz
9. Review SRS cards
10. View progress

**Test File:** `tests/integration/learning-flow.test.ts`

---

## Timeline

| Phase | Tasks | Duration | Dates |
|-------|-------|----------|-------|
| Phase 1 | FE-001, FE-002, QA-001, QA-002 | 3 days | Dec 26-28 |
| Phase 2 | FE-003, FE-004, FE-005, QA-003 | 2 days | Dec 29-30 |
| Phase 3 | FE-006, BE-001, BE-002, QA-004, QA-005 | 2 days | Dec 31 - Jan 1 |
| Phase 4 | INT-001, Final Testing, Bug Fixes | 2 days | Jan 2-3 |

---

## Definition of Done

For each task to be considered complete:
- [ ] Code implemented and self-reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing (where applicable)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code reviewed by peer
- [ ] Documentation updated (if needed)
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile responsive verified

---

## Communication

- Daily standups at 9:00 AM
- Blockers escalated immediately via Teams/Slack
- PR reviews within 4 hours
- End of day progress updates

---

## Notes

- All API responses use wrapper format: `{ success: boolean, data: T }`
- Authentication uses JWT with Bearer token
- Demo account: `demo@example.com` / `password123`
- Backend runs on port 3000, frontend on port 5173

# Flash Cards Feature Implementation Plan

**Document Version:** 1.0  
**Date Created:** December 29, 2025  
**Status:** Planning Phase  
**Estimated Effort:** 96 hours (2-3 months)

---

## Overview

Flash cards will provide a spaced repetition learning tool for memorizing key terms, definitions, Arabic vocabulary, Quranic verses, and other important concepts from course units.

---

## 1. Database Schema (Prisma)

### New Models

**FlashCard Model:**
```prisma
model FlashCard {
  id              String    @id @default(uuid())
  unitId          String
  courseId        String
  
  // Card content
  front           String    @db.Text  // Question/Term/Arabic text
  back            String    @db.Text  // Answer/Definition/Translation
  frontArabic     String?   @db.Text  // Optional Arabic on front
  backArabic      String?   @db.Text  // Optional Arabic on back
  
  // Metadata
  category        String?   // e.g., "vocabulary", "definition", "verse", "rule"
  tags            String[]  // For filtering/searching
  difficulty      Difficulty @default(MEDIUM)
  orderIndex      Int       @default(0)
  
  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  unit            Unit      @relation(fields: [unitId], references: [id], onDelete: Cascade)
  course          Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  userProgress    FlashCardProgress[]
  
  @@index([unitId])
  @@index([courseId])
  @@index([category])
}
```

**FlashCardProgress Model (for spaced repetition):**
```prisma
model FlashCardProgress {
  id              String    @id @default(uuid())
  memberId        String
  flashCardId     String
  
  // Spaced repetition algorithm data
  easeFactor      Float     @default(2.5)    // SM-2 algorithm
  interval        Int       @default(1)       // Days until next review
  repetitions     Int       @default(0)       // Number of successful reviews
  nextReviewDate  DateTime
  
  // Performance tracking
  totalReviews    Int       @default(0)
  correctReviews  Int       @default(0)
  lastRating      Int?      // 1-5 rating from last review
  
  // Status
  status          FlashCardStatus @default(NEW)
  
  // Timestamps
  lastReviewedAt  DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  member          Member    @relation(fields: [memberId], references: [id], onDelete: Cascade)
  flashCard       FlashCard @relation(fields: [flashCardId], references: [id], onDelete: Cascade)
  
  @@unique([memberId, flashCardId])
  @@index([memberId, nextReviewDate])
  @@index([memberId, status])
}

enum FlashCardStatus {
  NEW
  LEARNING
  REVIEWING
  MASTERED
}
```

**Update Existing Models:**
- Add `flashCards FlashCard[]` relation to `Unit` model
- Add `flashCards FlashCard[]` relation to `Course` model
- Add `flashCardProgress FlashCardProgress[]` to `Member` model

---

## 2. Backend API Implementation

### Routes Structure

**`/api/v1/courses/:courseId/flashcards`**
- `GET` - Get all flash cards for a course
- `POST` - Create new flash card (admin)

**`/api/v1/units/:unitId/flashcards`**
- `GET` - Get all flash cards for a unit
- `POST` - Create flash card for unit (admin)

**`/api/v1/flashcards/:id`**
- `GET` - Get single flash card
- `PUT` - Update flash card (admin)
- `DELETE` - Delete flash card (admin)

**`/api/v1/flashcards/:id/review`**
- `POST` - Submit review rating (1-5) and update spaced repetition

**`/api/v1/members/:memberId/flashcards/due`**
- `GET` - Get all cards due for review today
- Query params: `?courseId=xxx&unitId=xxx&limit=20`

**`/api/v1/members/:memberId/flashcards/stats`**
- `GET` - Get flash card statistics (total, new, learning, mastered, due today)

### Services

**`flashcard.service.ts`:**
- `getFlashCards(unitId?, courseId?, category?)` - Fetch cards with filters
- `createFlashCard(data)` - Create new card
- `updateFlashCard(id, data)` - Update existing card
- `deleteFlashCard(id)` - Delete card
- `getFlashCardsByIds(ids[])` - Batch fetch

**`flashcard-progress.service.ts`:**
- `getProgress(memberId, flashCardId)` - Get user's progress for a card
- `initializeProgress(memberId, flashCardId)` - Create initial progress record
- `submitReview(memberId, flashCardId, rating)` - Process review and update spaced repetition
- `calculateNextReview(progress, rating)` - SM-2 algorithm implementation
- `getDueCards(memberId, filters)` - Get cards due for review
- `getStatistics(memberId, courseId?, unitId?)` - Get progress statistics
- `resetProgress(memberId, flashCardId)` - Reset a card to NEW status

**Spaced Repetition Algorithm (SM-2):**
```typescript
// Rating scale:
// 5 - Perfect recall
// 4 - Correct with hesitation
// 3 - Correct with difficulty
// 2 - Incorrect but recognized
// 1 - Complete blackout

calculateNextReview(currentProgress, rating) {
  if (rating < 3) {
    // Failed - reset to 1 day
    return {
      interval: 1,
      repetitions: 0,
      easeFactor: Math.max(1.3, currentProgress.easeFactor - 0.2),
      status: 'LEARNING'
    };
  }
  
  // Passed
  let newEaseFactor = currentProgress.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);
  
  let newInterval;
  if (currentProgress.repetitions === 0) {
    newInterval = 1;
  } else if (currentProgress.repetitions === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(currentProgress.interval * newEaseFactor);
  }
  
  return {
    interval: newInterval,
    repetitions: currentProgress.repetitions + 1,
    easeFactor: newEaseFactor,
    status: newInterval > 21 ? 'MASTERED' : 'REVIEWING'
  };
}
```

### Controllers

**`flashcard.controller.ts`:**
- Validation middleware for card creation/updates
- Authorization checks (admin for CUD, authenticated for R)
- Error handling for invalid card IDs
- Response formatting

**`flashcard-progress.controller.ts`:**
- Validate rating values (1-5)
- Ensure user can only access their own progress
- Handle edge cases (reviewing card not yet initialized)

---

## 3. Frontend Implementation

### Components Structure

**`components/flashcards/FlashCardDeck.tsx`:**
- Container for flash card study session
- Props: `unitId`, `courseId`, `mode` ('study' | 'review')
- Fetches cards (all or only due)
- Manages current card index
- Tracks session statistics

**`components/flashcards/FlashCard.tsx`:**
- Single card display with flip animation
- Front/back content rendering
- Arabic text support with proper RTL
- Click/tap to flip
- Swipe gestures for mobile

**`components/flashcards/FlashCardReview.tsx`:**
- Rating buttons (1-5) after viewing back
- Visual feedback for rating selection
- Progress indicators
- Keyboard shortcuts (1-5 keys)

**`components/flashcards/FlashCardStats.tsx`:**
- Statistics dashboard
- Cards by status (New, Learning, Reviewing, Mastered)
- Cards due today
- Review streak
- Charts/visualizations (optional)

**`components/flashcards/FlashCardList.tsx`:**
- List view of all cards in unit/course
- Filter by category, status, tags
- Search functionality
- Admin: Add/Edit/Delete buttons

### Pages

**`pages/courses/FlashCardsPage.tsx`:**
- Route: `/courses/:courseId/flashcards`
- Overview of all flash cards in course
- Filter by unit, category
- Start study session button
- Statistics summary

**`pages/courses/UnitFlashCardsPage.tsx`:**
- Route: `/courses/:courseId/units/:unitId/flashcards`
- Flash cards specific to unit
- "Study" and "Review Due" buttons
- Integration with unit completion tracking

**`pages/flashcards/StudySessionPage.tsx`:**
- Route: `/flashcards/study/:unitId` or `/flashcards/study/:courseId`
- Full-screen study mode
- Card navigation
- Session timer
- Exit/pause functionality

**`pages/flashcards/ReviewSessionPage.tsx`:**
- Route: `/flashcards/review`
- Daily review session (all due cards)
- Progress through due cards only
- Completion celebration

### Services

**`frontend/src/services/flashcardService.ts`:**
```typescript
interface FlashCard {
  id: string;
  unitId: string;
  courseId: string;
  front: string;
  back: string;
  frontArabic?: string;
  backArabic?: string;
  category?: string;
  tags: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  orderIndex: number;
}

interface FlashCardProgress {
  id: string;
  flashCardId: string;
  status: 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED';
  nextReviewDate: string;
  totalReviews: number;
  correctReviews: number;
  interval: number;
}

export const flashcardService = {
  // Card CRUD
  getFlashCards(unitId?, courseId?, category?): Promise<FlashCard[]>
  getFlashCard(id): Promise<FlashCard>
  createFlashCard(data): Promise<FlashCard>  // Admin
  updateFlashCard(id, data): Promise<FlashCard>  // Admin
  deleteFlashCard(id): Promise<void>  // Admin
  
  // Progress
  getDueCards(filters?): Promise<FlashCard[]>
  submitReview(flashCardId, rating): Promise<FlashCardProgress>
  getProgress(flashCardId): Promise<FlashCardProgress>
  getStatistics(courseId?, unitId?): Promise<Statistics>
}
```

### State Management (Zustand)

**`stores/flashcardStore.ts`:**
```typescript
interface FlashCardStore {
  // Current session
  currentDeck: FlashCard[];
  currentIndex: number;
  isFlipped: boolean;
  sessionStats: {
    cardsReviewed: number;
    correctCount: number;
    startTime: Date;
  };
  
  // Actions
  loadDeck: (cards: FlashCard[]) => void;
  flipCard: () => void;
  nextCard: () => void;
  previousCard: () => void;
  submitRating: (rating: number) => Promise<void>;
  resetSession: () => void;
}
```

### UI/UX Features

**Card Display:**
- Smooth 3D flip animation (CSS transforms)
- Front side: Question/term with subtle background
- Back side: Answer/definition with different color
- Arabic text: Large font, proper diacritics, RTL layout
- Category badge in corner
- Difficulty indicator

**Study Mode:**
- Keyboard shortcuts:
  - Space: Flip card
  - Left/Right arrows: Navigate
  - 1-5: Rate card (after flipping)
- Progress bar showing position in deck
- "Shuffle" option
- "Filter by difficulty" option

**Review Mode:**
- Only shows cards due today
- Prioritizes older due cards first
- Celebrates completion ("All done for today! 🎉")
- Shows next review time after rating

**Mobile Optimization:**
- Swipe left/right to navigate
- Tap to flip
- Full-screen card display
- Touch-friendly rating buttons

---

## 4. Integration with Existing Features

### Unit Page Integration

**Add Flash Cards Tab/Section:**
- Alongside content, quiz, exercises
- Show count: "15 flash cards"
- Quick action: "Study Cards" button
- Progress indicator: "12/15 mastered"

**After Unit Completion:**
- Suggest studying flash cards
- "Reinforce your learning with flash cards"

### Course Page Integration

**Flash Cards Overview Card:**
- Total cards in course
- Cards due today
- Mastery percentage
- "Review Now" CTA

### Dashboard Integration

**Daily Flash Cards Widget:**
- "X cards due for review today"
- Quick link to review session
- Current streak counter
- Weekly review chart

### Gamification

**New Achievements:**
- "First Review" - Complete first flash card review
- "Week Streak" - Review cards 7 days in a row
- "Master 50" - Master 50 flash cards
- "Perfect Session" - Rate all cards 4-5 in session

**Points System:**
- +5 points per card reviewed
- +10 points per card mastered
- +20 points for completing daily reviews
- Bonus points for streaks

---

## 5. Seed Data

### Create Flash Card Seed Files

**`backend/prisma/seed-sarf-flashcards.ts`:**
- Create 10-20 flash cards per Sarf unit
- Categories:
  - "vocabulary" - Arabic terms with translations
  - "definition" - Technical terms (e.g., "What is Mithal verb?")
  - "pattern" - Verb forms and patterns
  - "example" - Quranic examples
  - "rule" - Morphological rules

**Example Flash Cards for Unit 1 (Introduction):**
```typescript
{
  front: "What is the morphological scale in Arabic?",
  back: "فَعَلَ (fa'ala) - using ف، ع، ل to represent the three root radicals",
  category: "definition",
  difficulty: "EASY"
},
{
  front: "علم الصرف",
  frontArabic: "علم الصرف",
  back: "The science of Arabic morphology - studying word structure and changes",
  category: "vocabulary",
  difficulty: "EASY"
},
{
  front: "What do ف، ع، ل represent in the morphological scale?",
  back: "ف = first radical (فاء الكلمة)\nع = second radical (عين الكلمة)\nل = third radical (لام الكلمة)",
  category: "definition",
  difficulty: "MEDIUM"
}
```

### Package.json Script

```json
"db:seed:sarf:flashcards": "ts-node prisma/seed-sarf-flashcards.ts"
```

---

## 6. Admin Features

### Flash Card Management UI

**Admin Panel Route:** `/admin/flashcards`

**Features:**
- Bulk import from CSV/JSON
- Duplicate detection
- Batch edit (category, tags, difficulty)
- Preview cards
- Reorder cards
- Export to various formats

**Bulk Create Form:**
- Spreadsheet-like interface
- Front | Back | Category | Tags | Difficulty
- Save multiple cards at once

---

## 7. Advanced Features (Future Enhancements)

### AI-Generated Flash Cards
- Similar to quiz AI analysis
- Generate cards from unit content automatically
- Requires scholar review for Islamic content
- Use same best practices as quiz AI generation

### Shared Flash Card Decks
- Users can create and share custom decks
- Community contributions (with moderation)
- Import decks from other users
- Rating system for shared decks

### Multi-Language Support
- Cards in Arabic, English, Urdu, etc.
- Translation practice mode
- Language toggle during study

### Audio Flash Cards
- Audio pronunciation for Arabic terms
- Quranic recitation on cards
- Text-to-speech for definitions

### Image Flash Cards
- Visual mnemonics
- Diagrams for verb patterns
- Quranic calligraphy

### Advanced Spaced Repetition
- Multiple algorithms (SM-2, SM-18, Anki)
- User-configurable parameters
- Learning analytics
- Optimal study time recommendations

### Study Groups
- Shared study sessions
- Compete on mastery rates
- Group challenges
- Peer teaching mode

### Mobile App Features
- Offline study mode
- Daily notifications for reviews
- Widget showing cards due
- Apple Watch/Android Wear support

---

## 8. Testing Strategy

### Unit Tests
- Spaced repetition algorithm accuracy
- Edge cases (first review, failed cards, mastered cards)
- Progress calculation
- Date arithmetic for scheduling

### Integration Tests
- Card creation and retrieval
- Review submission and progress update
- Due card filtering
- Statistics calculation

### E2E Tests
- Complete study session flow
- Rating cards and seeing next review date
- Navigation between cards
- Filter and search functionality

---

## 9. Migration Plan

### Phase 1: Basic Flash Cards (Week 1-2)
- Database schema
- CRUD API endpoints
- Basic frontend display
- Simple study session
- Manual card creation

### Phase 2: Spaced Repetition (Week 3-4)
- Progress tracking
- SM-2 algorithm
- Review scheduling
- Due cards filtering
- Statistics dashboard

### Phase 3: Integration (Week 5)
- Unit page integration
- Course page integration
- Dashboard widgets
- Navigation updates

### Phase 4: UX Polish (Week 6)
- Animations and transitions
- Mobile optimization
- Keyboard shortcuts
- Accessibility improvements

### Phase 5: Content Creation (Week 7-8)
- Seed flash cards for all Sarf units
- QA and review
- Theological accuracy check
- Beta testing with users

---

## 10. Performance Considerations

### Database Optimization
- Index on `(memberId, nextReviewDate)` for due card queries
- Index on `(unitId, category)` for filtered lists
- Pagination for large card sets (>100 cards)

### Caching Strategy
- Cache flash card content (rarely changes)
- Real-time progress updates (don't cache)
- Redis cache for daily due cards
- Invalidate on card updates

### API Optimization
- Batch fetch cards + progress in single request
- Lazy load card backs (only when flipped)
- Prefetch next 3 cards during study
- Debounce rating submissions

---

## 11. Analytics & Metrics

### Track:
- Cards reviewed per day (per user)
- Average rating per card
- Completion rate of study sessions
- Most difficult cards (low ratings)
- Most mastered cards
- Daily active users (review feature)
- Average study session duration
- Retention curves

### Reports:
- Weekly review summary email
- Monthly progress report
- Learning velocity charts
- Mastery milestones

---

## 12. Estimated Implementation Effort

| Phase | Backend | Frontend | Testing | Total |
|-------|---------|----------|---------|-------|
| Schema & Basic CRUD | 8 hrs | - | 2 hrs | 10 hrs |
| Spaced Repetition | 12 hrs | - | 4 hrs | 16 hrs |
| Frontend Components | - | 20 hrs | 4 hrs | 24 hrs |
| Integration | 4 hrs | 8 hrs | 4 hrs | 16 hrs |
| Seed Data Creation | 8 hrs | - | 2 hrs | 10 hrs |
| Polish & Testing | 4 hrs | 8 hrs | 8 hrs | 20 hrs |
| **Total** | **36 hrs** | **36 hrs** | **24 hrs** | **96 hrs** |

**Timeline:** 2-3 months for full implementation with testing and content creation.

---

## 13. Success Metrics

### Launch Goals (First 3 Months)
- 70% of active students use flash cards at least once
- Average 15 minutes/day of flash card review time
- 50% completion rate for daily reviews
- 80% user satisfaction rating

### Long-term Goals (6-12 Months)
- 90% feature adoption rate
- Average 1,000+ cards mastered per student
- 30-day review streak average
- Measurable improvement in quiz scores for students using flash cards

---

## 14. Related Documents

- [AI Question Generation Analysis](./AI_QUESTION_GENERATION_ANALYSIS.md) - Similar AI generation approach can be used for flash cards
- [Azure Deployment Guide](./AZURE_DEPLOYMENT.md) - Deployment considerations for flash card feature
- [Local Development Guide](./LOCAL_DEVELOPMENT.md) - Setup for testing flash cards locally

---

**Document Status:** Planning Phase  
**Next Steps:** Review with team, get theological approval for approach, begin Phase 1 implementation  
**Last Updated:** December 29, 2025

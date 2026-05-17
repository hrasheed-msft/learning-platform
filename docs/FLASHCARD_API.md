# Flash Card API Documentation

## Overview

The Flash Card API provides endpoints for managing interactive study cards with spaced repetition capabilities. Flash cards support both English and Arabic content with RTL layout support.

## Base URL

```
/api/v1/flashcards
```

## Authentication

All endpoints require JWT authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Get Course Flash Cards

Retrieve all flash cards for a specific course.

**Endpoint:** `GET /api/v1/courses/:courseId/flashcards`

**Parameters:**
- `courseId` (path, required): Course UUID
- `category` (query, optional): Filter by category
- `difficulty` (query, optional): Filter by difficulty (EASY, MEDIUM, HARD)
- `limit` (query, optional): Number of cards to return (default: 50)
- `offset` (query, optional): Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "flashcards": [
    {
      "id": "uuid",
      "unitId": "uuid",
      "courseId": "uuid",
      "front": "What is the morphological scale in Arabic?",
      "back": "The morphological scale (الميزان الصرفي) is فَعَلَ",
      "frontArabic": null,
      "backArabic": "الميزان الصرفي هو فَعَلَ",
      "category": "definition",
      "tags": ["sarf", "morphology", "basics"],
      "difficulty": "EASY",
      "orderIndex": 1,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

### 2. Get Unit Flash Cards

Retrieve all flash cards for a specific unit.

**Endpoint:** `GET /api/v1/units/:unitId/flashcards`

**Parameters:**
- `unitId` (path, required): Unit UUID
- `category` (query, optional): Filter by category
- `difficulty` (query, optional): Filter by difficulty
- `limit` (query, optional): Number of cards to return
- `offset` (query, optional): Pagination offset

**Response:** Same as Get Course Flash Cards

### 3. Get Single Flash Card

Retrieve a specific flash card by ID.

**Endpoint:** `GET /api/v1/flashcards/:id`

**Parameters:**
- `id` (path, required): Flash Card UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "unitId": "uuid",
  "courseId": "uuid",
  "front": "Question text",
  "back": "Answer text",
  "frontArabic": "السؤال",
  "backArabic": "الجواب",
  "category": "vocabulary",
  "tags": ["beginner"],
  "difficulty": "MEDIUM",
  "orderIndex": 5,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### 4. Create Flash Card (Admin Only)

Create a new flash card.

**Endpoint:** `POST /api/v1/flashcards`

**Request Body:**
```json
{
  "unitId": "uuid",
  "courseId": "uuid",
  "front": "Question text",
  "back": "Answer text",
  "frontArabic": "السؤال",
  "backArabic": "الجواب",
  "category": "vocabulary",
  "tags": ["beginner", "verbs"],
  "difficulty": "EASY",
  "orderIndex": 1
}
```

**Response:** `201 Created`

### 5. Update Flash Card (Admin Only)

Update an existing flash card.

**Endpoint:** `PUT /api/v1/flashcards/:id`

**Parameters:**
- `id` (path, required): Flash Card UUID

**Request Body:**
```json
{
  "front": "Updated question",
  "back": "Updated answer",
  "category": "definition",
  "difficulty": "HARD"
}
```

**Response:** `200 OK`

### 6. Delete Flash Card (Admin Only)

Delete a flash card.

**Endpoint:** `DELETE /api/v1/flashcards/:id`

**Parameters:**
- `id` (path, required): Flash Card UUID

**Response:** `204 No Content`

### 7. Submit Flash Card Review

Submit a review rating for a flash card (1-5 scale).

**Endpoint:** `POST /api/v1/flashcards/:id/review`

**Parameters:**
- `id` (path, required): Flash Card UUID

**Request Body:**
```json
{
  "rating": 4
}
```

**Rating Scale:**
- `1` - Complete blackout (no recall)
- `2` - Incorrect response; correct one remembered
- `3` - Correct response recalled with serious difficulty
- `4` - Correct response after a hesitation
- `5` - Perfect response (immediate recall)

**Response:** `200 OK`
```json
{
  "nextReviewDate": "2025-01-05T00:00:00Z",
  "interval": 4,
  "status": "LEARNING",
  "easeFactor": 2.5
}
```

### 8. Get Due Flash Cards

Get all flash cards due for review for a member.

**Endpoint:** `GET /api/v1/members/:memberId/flashcards/due`

**Parameters:**
- `memberId` (path, required): Member UUID
- `courseId` (query, optional): Filter by course
- `unitId` (query, optional): Filter by unit
- `limit` (query, optional): Maximum cards to return

**Response:** `200 OK`
```json
{
  "dueCards": [
    {
      "id": "uuid",
      "front": "Question",
      "back": "Answer",
      "progress": {
        "status": "REVIEWING",
        "nextReviewDate": "2025-01-01T00:00:00Z",
        "totalReviews": 5,
        "correctReviews": 4
      }
    }
  ],
  "total": 15
}
```

### 9. Get Flash Card Statistics

Get flash card statistics for a member.

**Endpoint:** `GET /api/v1/members/:memberId/flashcards/stats`

**Parameters:**
- `memberId` (path, required): Member UUID
- `courseId` (query, optional): Filter by course
- `unitId` (query, optional): Filter by unit

**Response:** `200 OK`
```json
{
  "totalCards": 150,
  "newCards": 20,
  "learningCards": 45,
  "reviewingCards": 60,
  "masteredCards": 25,
  "dueToday": 12,
  "masteryPercentage": 16.67,
  "averageEaseFactor": 2.6,
  "reviewStreak": 7
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid rating. Must be between 1 and 5."
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Flash card not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

## Rate Limiting

- Review submissions: 60 per minute per user
- All other endpoints: 100 per minute per user

## Flash Card Categories

Common categories used in the system:
- `vocabulary` - Word definitions and translations
- `definition` - Concept definitions
- `pattern` - Arabic morphological patterns
- `example` - Example sentences or usage
- `rule` - Grammar or morphological rules
- `verse` - Quranic verses
- `hadith` - Hadith memorization
- `dua` - Supplication memorization

## Spaced Repetition Algorithm

The system uses the SM-2 (SuperMemo 2) algorithm for optimal spacing:

- Cards start with `NEW` status
- After first review, move to `LEARNING`
- After consistent correct reviews, move to `REVIEWING`
- After mastery threshold, move to `MASTERED`
- Intervals grow exponentially based on performance
- Ease factor adjusts based on rating history

## Best Practices

1. **Daily Reviews**: Encourage users to review due cards daily
2. **Honest Ratings**: Use accurate self-assessment for optimal scheduling
3. **Bite-Sized Sessions**: 10-15 cards per session for better retention
4. **Arabic Text**: Always include Arabic text for language cards
5. **Categories**: Use consistent categories for better filtering
6. **Tags**: Add relevant tags for searchability

## Examples

### Study Session Flow

1. Get due cards: `GET /api/v1/members/{memberId}/flashcards/due?limit=15`
2. Present each card to user
3. User rates their recall: `POST /api/v1/flashcards/{cardId}/review` with rating 1-5
4. Repeat for all cards
5. Show session statistics

### Creating Content

1. Create cards for a unit: `POST /api/v1/flashcards` (requires admin role)
2. Include both English and Arabic where appropriate
3. Set difficulty based on content complexity
4. Add category and tags for organization
5. Set orderIndex for logical progression

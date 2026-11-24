# Changelog

All notable changes to the Islamic Studies Learning Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nūrāniyyah — Learn to Read the Qur'ān course (`seed-nuraniyyah.ts`): 11 lessons following book pages 6–19 of the Nuraniyah primer, with Arabic text, an optional pronunciation guide (hidden by default; a "Show pronunciation guide" switch in the lesson viewer turns it on and remembers the choice), flashcards, quizzes and mid-year/completion assessments. Linked to Maktab Foundation 1 and Foundation 2.
- Tap-to-hear pronunciation clips (about 520, one per card) cut from the Qaidah Nuraniyyah CD, a `useWordAudio` hook for `[data-audio]` elements in lessons, and `tools/nuraniyyah-audio` to split and match the CD tracks. Every cell and word the book prints in lessons 2, 3, 4, 5, 6, 8, 9 and 11 has its clip.
- Experimental `/listening-lab` page (not linked from the app) that listens to a child through the microphone and tells a wrong letter from a wrong vowel, scored on the device with MFCC + vocal-tract-warped DTW; spike report and evaluation tools in `tools/listening-spike`.
- Initial project structure for frontend (React + Vite + TypeScript)
- Initial project structure for backend (Node.js + Express + TypeScript)
- Database schema with Prisma ORM
- Authentication system with JWT tokens
- Family and member management API
- Course and unit API endpoints
- Assessment and quiz system
- Spaced Repetition System (SRS) for memorization
- User profile and settings management
- Demo seed data for testing
- Project documentation (README, CONTRIBUTING)
- Task assignments for development team

### Frontend Features
- Authentication pages (Login, Register, Forgot Password, Reset Password, Verify Email)
- Dashboard pages (Family Dashboard, Child Dashboard, Member Progress)
- Course pages (Catalog, Course Detail, Unit Viewer, Quiz Page)
- Review Session page for SRS
- Responsive layouts with Tailwind CSS
- Zustand state management
- API service layer with Axios

### Backend Features
- RESTful API with Express
- JWT authentication middleware
- Input validation with express-validator
- Error handling middleware
- Rate limiting
- CORS and security headers
- Prisma ORM for database access
- Redis for caching (prepared)

### Database Schema
- Family and User models
- Family Member model with age categories
- Course and Unit models
- Video, Audio, and Arabic Term resources
- Question and Quiz Result models
- Course Enrollment and Progress tracking
- Memorization Items and Review Logs for SRS
- Achievement model for gamification

## [0.1.0] - 2024-XX-XX

### Initial Release
- MVP release with core features
- Basic authentication and authorization
- Course browsing and enrollment
- Quiz assessment system
- Spaced repetition reviews
- Family member management

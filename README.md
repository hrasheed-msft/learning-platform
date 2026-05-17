# Islamic Studies Learning Platform 📚

A comprehensive family-based Islamic education platform featuring structured courses, spaced repetition memorization, and gamification elements.

## 🌟 Features

- **Family-Based Learning**: Parent accounts manage multiple child profiles with age-appropriate content
- **Structured Courses**: Quran, Hadith, Fiqh, Seerah, Arabic (Sarf/Nahw), and Islamic History
- **Flash Cards with Spaced Repetition**: Interactive flash cards with SM-2 algorithm for optimal retention
- **Quizzes & Assessments**: Multi-format questions including multiple choice, true/false, and fill-in-the-blank
- **Spaced Repetition System (SRS)**: Optimize memorization of Ayahs, Hadith, Duas, and terms
- **Gamification**: Points, streaks, achievements, and progress tracking
- **AI-Powered**: Automatic quiz question generation
- **Multi-Age Support**: Content adapted for Early Child, Child, Pre-Teen, Teen, and Adult

## 🏗️ Project Structure

```
islamic-learning-platform/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand state management
│   │   ├── services/         # API service layer
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   └── ...
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── config/           # Configuration
│   │   └── utils/            # Utility functions
│   └── prisma/               # Database schema & migrations
└── docs/                     # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Copy environment file:
```bash
cd backend
cp .env.example .env
```

2. Update `.env` with your database credentials and secrets

3. Install dependencies:
```bash
npm install
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Seed the database (optional):
```bash
npm run db:seed
```

7. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new family
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Family
- `GET /api/v1/family` - Get family info
- `GET /api/v1/family/members` - List family members
- `POST /api/v1/family/members` - Add family member
- `PUT /api/v1/family/members/:id` - Update family member
- `DELETE /api/v1/family/members/:id` - Remove family member

### Courses
- `GET /api/v1/courses` - List courses
- `GET /api/v1/courses/:id` - Get course details
- `GET /api/v1/courses/:id/units` - List course units
- `POST /api/v1/courses/enrollments` - Enroll member in course

### Assessments
- `GET /api/v1/assessments/units/:id/questions` - Get unit questions
- `POST /api/v1/assessments/submit` - Submit quiz answers

### Flash Cards
- `GET /api/v1/courses/:courseId/flashcards` - Get course flash cards
- `GET /api/v1/units/:unitId/flashcards` - Get unit flash cards
- `GET /api/v1/flashcards/:id` - Get single flash card
- `POST /api/v1/flashcards` - Create flash card (admin)
- `PUT /api/v1/flashcards/:id` - Update flash card (admin)
- `DELETE /api/v1/flashcards/:id` - Delete flash card (admin)
- `POST /api/v1/flashcards/:id/review` - Submit flash card review
- `GET /api/v1/members/:memberId/flashcards/due` - Get due flash cards
- `GET /api/v1/members/:memberId/flashcards/stats` - Get flash card statistics

### Spaced Repetition
- `GET /api/v1/srs/due/:memberId` - Get items due for review
- `POST /api/v1/srs/review` - Submit review rating

## 🔧 Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- TailwindCSS
- Zustand (state management)
- React Router v6
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication
- bcrypt

## 🎨 Design System

### Colors
- **Primary (Green)**: `#16a34a` - Islamic green, representing growth and knowledge
- **Secondary (Gold)**: `#ca8a04` - Represents illumination and wisdom
- **Accent (Blue)**: `#2563eb` - Trust and reliability

### Fonts
- **Headings**: Poppins
- **Body**: Inter
- **Arabic**: Amiri

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔒 Security

- JWT-based authentication with access/refresh tokens
- Password hashing with bcrypt (12 rounds)
- Rate limiting on API endpoints
- Input validation with express-validator
- CORS protection
- Helmet security headers

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

See CONTRIBUTING.md for contribution guidelines.

## 📧 Support

For support, please open an issue in the repository.

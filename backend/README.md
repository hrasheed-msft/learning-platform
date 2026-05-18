# Islamic Studies Learning Platform - Backend

Node.js/Express API for the Islamic Studies Learning Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── index.ts         # Environment configuration
│   ├── database.ts      # Prisma client singleton
│   └── redis.ts         # Redis client
├── controllers/         # Request handlers
├── services/            # Business logic layer
├── middleware/          # Express middleware
│   ├── auth.middleware.ts      # JWT authentication
│   ├── error.middleware.ts     # Error handling
│   ├── validate.middleware.ts  # Input validation
│   └── notFound.middleware.ts  # 404 handler
├── routes/              # API route definitions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── index.ts             # Application entry point

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Seed data script
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/islamic_learning

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT=your-storage-account
AZURE_STORAGE_KEY=your-storage-key
AZURE_STORAGE_CONTAINER=media

# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-key
```

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new family |
| POST | `/login` | Login with email/password |
| POST | `/refresh` | Refresh access token |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset password with token |
| POST | `/verify-email` | Verify email address |

### Family (`/api/v1/family`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get family information |
| GET | `/members` | List family members |
| GET | `/members/:id` | Get specific member |
| POST | `/members` | Add family member |
| PUT | `/members/:id` | Update family member |
| DELETE | `/members/:id` | Remove family member |

### Courses (`/api/v1/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List courses (with filters) |
| GET | `/:id` | Get course details |
| GET | `/:id/units` | List course units |
| GET | `/:id/units/:unitId` | Get unit with content |
| POST | `/enrollments` | Enroll member in course |
| GET | `/members/:id/enrollments` | Get member enrollments |
| PUT | `/progress` | Update unit progress |

### Assessments (`/api/v1/assessments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/units/:id/questions` | Get unit questions |
| POST | `/submit` | Submit quiz answers |
| GET | `/members/:id/results` | Get member quiz history |
| POST | `/questions/generate` | Generate AI questions |

### SRS - Spaced Repetition (`/api/v1/srs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/due/:memberId` | Get items due for review |
| POST | `/review` | Submit review rating |
| GET | `/members/:id/items` | Get all memorization items |
| POST | `/items` | Create memorization item |

### User (`/api/v1/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |
| PUT | `/settings` | Update settings |
| PUT | `/password` | Change password |
| GET | `/members/:id/achievements` | Get achievements |

## 🔐 Authentication

### JWT Tokens

- **Access Token**: 24 hours validity
- **Refresh Token**: 30 days validity

### Headers

```
Authorization: Bearer <access_token>
```

### Refresh Flow

1. Client detects 401 response
2. Client calls `/auth/refresh` with refresh token
3. Server returns new access token
4. Client retries original request

## 📦 Dependencies

### Core
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM and database toolkit

### Security
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT tokens
- **helmet** - Security headers
- **cors** - Cross-origin requests
- **express-rate-limit** - Rate limiting

### Validation
- **express-validator** - Input validation

### Database
- **@prisma/client** - Database client
- **ioredis** - Redis client

## 🗄️ Database Schema

### Core Models

- **Family** - Family account
- **User** - Parent/admin user
- **FamilyMember** - Children in family

### Content Models

- **Course** - Learning courses
- **Unit** - Course units/lessons
- **VideoResource** - Video content
- **AudioResource** - Audio content
- **ArabicTerm** - Arabic vocabulary

### Assessment Models

- **Question** - Quiz questions
- **QuizResult** - Quiz attempts

### Progress Models

- **CourseEnrollment** - Course registrations
- **UnitProgress** - Unit completion status

### SRS Models

- **MemorizationItem** - Items to memorize
- **ReviewLog** - Review history

### Gamification

- **Achievement** - User achievements

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- --grep "Auth"
```

## 📝 Error Handling

### Custom Error Classes

```typescript
import { AppError } from './middleware/error.middleware';

// Usage in service
throw new AppError('Resource not found', 404);
throw new AppError('Validation failed', 400);
throw new AppError('Unauthorized access', 401);
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": 400
  }
}
```

## 🚀 Deployment

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 🔍 Logging

Using console logging in development. For production, consider:
- Winston
- Pino
- Morgan (HTTP logging)

## 📚 Learn More

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

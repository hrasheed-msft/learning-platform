# Islamic Studies Learning Platform - Frontend

React-based frontend for the Islamic Studies Learning Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, Modal, etc.)
│   └── features/        # Feature-specific components
├── pages/               # Page components (routes)
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages
│   ├── courses/         # Course-related pages
│   └── review/          # SRS review pages
├── layouts/             # Layout components
├── stores/              # Zustand state stores
├── services/            # API service layer
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
└── assets/              # Static assets (images, fonts)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Islamic Learning Platform
```

### Tailwind CSS

Tailwind is configured in `tailwind.config.js` with custom:
- Colors (primary green, secondary gold, accent blue)
- Fonts (Poppins, Inter, Amiri for Arabic)
- Responsive breakpoints

## 📦 Dependencies

### Core
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing

### State Management
- **Zustand** - Lightweight state management
- **zustand/middleware** - Persist middleware for localStorage

### Styling
- **TailwindCSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### HTTP & Data
- **Axios** - HTTP client with interceptors

### Icons
- **Lucide React** - Icon library

## 🎨 Styling Guide

### Using Tailwind Classes

```tsx
// Button example
<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
  Click Me
</button>
```

### Custom Colors

```tsx
// Primary (Green)
bg-primary-500, text-primary-600, border-primary-400

// Secondary (Gold)
bg-secondary-500, text-secondary-600

// Accent (Blue)
bg-accent-500, text-accent-600
```

## 🧭 Routing

Routes are defined in `App.tsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginPage | User login |
| `/register` | RegisterPage | Family registration |
| `/forgot-password` | ForgotPasswordPage | Password recovery |
| `/reset-password` | ResetPasswordPage | Set new password |
| `/verify-email` | VerifyEmailPage | Email verification |
| `/dashboard` | FamilyDashboard | Parent dashboard |
| `/dashboard/child/:id` | ChildDashboard | Child's dashboard |
| `/member/:id/progress` | MemberProgress | Member's progress |
| `/courses` | CourseCatalog | Browse courses |
| `/courses/:id` | CourseDetail | Course details |
| `/courses/:courseId/units/:unitId` | UnitViewer | Unit content |
| `/quiz/:unitId` | QuizPage | Take quiz |
| `/review/:memberId` | ReviewSession | SRS review |

## 🔐 Authentication

### Auth Store (Zustand)

```tsx
import { useAuthStore } from './stores/authStore';

// In component
const { user, isAuthenticated, login, logout } = useAuthStore();
```

### Protected Routes

```tsx
// MainLayout checks authentication
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### API Interceptors

Axios automatically:
- Adds Authorization header with access token
- Refreshes token on 401 responses
- Redirects to login on auth failure

## 📝 TypeScript Types

Located in `src/types/`:

- **user.ts** - User, Family, FamilyMember
- **course.ts** - Course, Unit, VideoResource, AudioResource
- **assessment.ts** - Question, QuizResult, QuizSubmission
- **progress.ts** - CourseEnrollment, UnitProgress
- **srs.ts** - MemorizationItem, ReviewLog, SRS ratings

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Building

```bash
# Development build
npm run build

# Production build with optimizations
npm run build -- --mode production
```

## 📱 Responsive Design

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Mobile-first approach:

```tsx
<div className="flex flex-col md:flex-row gap-4">
  {/* Stacks on mobile, row on desktop */}
</div>
```

## 🐛 Debugging

### React DevTools
Install React DevTools browser extension for component inspection.

### Zustand DevTools
State is persisted to localStorage. Check `Application > Local Storage` in browser DevTools.

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

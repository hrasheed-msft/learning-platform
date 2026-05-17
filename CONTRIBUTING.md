# Contributing to Islamic Studies Learning Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🌟 Code of Conduct

- Be respectful and inclusive
- Keep discussions focused and constructive
- Help others learn and grow

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 📋 Development Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/quiz-timer`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `docs/` - Documentation updates (e.g., `docs/api-endpoints`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)

### Commit Messages

Follow conventional commits:

```
type(scope): description

feat(auth): add password reset functionality
fix(courses): resolve enrollment duplicate issue
docs(readme): update installation instructions
style(ui): improve button hover states
test(srs): add review submission tests
```

### Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

## 📁 File Structure Guidelines

### Frontend Components
- One component per file
- Use `.tsx` extension
- Place in appropriate folder (components, pages, etc.)
- Export default for page components

### Backend Services
- Separate concerns (controller, service, route)
- Use dependency injection patterns
- Handle errors at controller level

### Flash Card Conventions
- **Categories**: Use lowercase (vocabulary, definition, pattern, example, rule)
- **Tags**: Use kebab-case (beginner-level, verb-forms, weak-verbs)
- **Arabic Text**: Always include diacritics for educational content
- **Order Index**: Start at 1 for each unit, increment sequentially
- **Difficulty**: Set based on cognitive load (EASY = recall, MEDIUM = understand, HARD = apply)
- **Content Guidelines**:
  - Front: Clear, concise question (max 200 chars)
  - Back: Complete answer with context (max 500 chars)
  - Use Arabic text in `frontArabic`/`backArabic` fields for RTL support
  - Include references for religious content (verse/hadith numbers)

## 🎨 Style Guidelines

### TypeScript
- Use explicit types (avoid `any`)
- Use interfaces for object shapes
- Use enums for fixed sets of values

### React
- Use functional components
- Use hooks for state and effects
- Memoize expensive computations

### CSS/Tailwind
- Use Tailwind utility classes
- Create component classes for repeated patterns
- Follow mobile-first approach

## 📝 Documentation

- Document public APIs
- Add JSDoc comments for complex functions
- Update README for new features
- Include examples where helpful

## 🐛 Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots if applicable

## 💡 Feature Requests

Include:
- Clear description
- Use case/motivation
- Proposed solution
- Alternative solutions considered

## ❓ Questions

- Check existing issues first
- Use discussions for general questions
- Be specific and provide context

Thank you for contributing! 🎉

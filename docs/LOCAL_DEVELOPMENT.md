# Local Development Environment Setup

This guide walks you through setting up the Islamic Studies Learning Platform on your local machine for development and testing.

## 📋 Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 14.x or higher | [postgresql.org](https://www.postgresql.org/download/) |
| Redis | 7.x or higher | [redis.io](https://redis.io/download/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Windows-Specific Setup

#### PostgreSQL
1. Download the Windows installer from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember your postgres superuser password
4. Add PostgreSQL bin to PATH: `C:\Program Files\PostgreSQL\14\bin`

#### Redis (Windows)
Redis doesn't officially support Windows. Use one of these options:

**Option 1: WSL2 (Recommended)**
```powershell
# Enable WSL
wsl --install

# In WSL terminal
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

**Option 2: Memurai (Redis-compatible for Windows)**
Download from [memurai.com](https://www.memurai.com/)

**Option 3: Docker**
```powershell
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### macOS Setup

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node@18 postgresql@14 redis

# Start services
brew services start postgresql@14
brew services start redis
```

### Linux (Ubuntu/Debian) Setup

```bash
# Update packages
sudo apt update

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Start services
sudo systemctl start postgresql
sudo systemctl start redis-server
```

---

## 🗄️ Database Setup

### 1. Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell
CREATE USER islamic_learning WITH PASSWORD 'harith';
CREATE DATABASE islamic_learning_dev OWNER islamic_learning;
GRANT ALL PRIVILEGES ON DATABASE islamic_learning_dev TO islamic_learning;
ALTER USER islamic_learning CREATEDB;
\q
```

### 2. Verify Connection

```bash
psql -U islamic_learning -d islamic_learning_dev -h localhost
```

---

## 🚀 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/islamic-learning-platform.git
cd islamic-learning-platform
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `backend/.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database - Update with your credentials
DATABASE_URL=postgresql://islamic_learning:your_secure_password@localhost:5432/islamic_learning_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets - Generate secure random strings
JWT_ACCESS_SECRET=generate-a-secure-random-string-here-min-32-chars
JWT_REFRESH_SECRET=generate-another-secure-random-string-here-min-32-chars
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d

# Azure Blob Storage (optional for local dev)
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER_NAME=media

# OpenAI (optional - for AI question generation)
OPENAI_API_KEY=

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Generate Secure JWT Secrets:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### 5. Start Backend Server

```bash
# Development mode with hot reload
npm run dev

# Backend will be available at http://localhost:3000
```

### 6. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env

# Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

---

## ✅ Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:3000/api/v1/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Check Database Connection

```bash
cd backend
npx prisma studio
# Opens Prisma Studio at http://localhost:5555
```

### 3. Test Authentication

```bash
# Login with demo account
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

### 4. Access Frontend

Open http://localhost:5173 in your browser and login with:
- **Email:** demo@example.com
- **Password:** password123

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- --grep "AuthService"

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

---

## 🔧 Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "humao.rest-client"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### API Testing with REST Client

Create `api.http` in the project root:

```http
@baseUrl = http://localhost:3000/api/v1
@token = your-jwt-token-here

### Health Check
GET {{baseUrl}}/health

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "password123"
}

### Get Courses (requires auth)
GET {{baseUrl}}/courses
Authorization: Bearer {{token}}

### Get Family Members
GET {{baseUrl}}/family/members
Authorization: Bearer {{token}}
```

---

## 🐳 Docker Development (Alternative)

If you prefer Docker for database services:

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: islamic_learning
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: islamic_learning_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Start Docker Services

```bash
docker-compose up -d

# Update .env with Docker connection strings
# DATABASE_URL=postgresql://islamic_learning:dev_password@localhost:5432/islamic_learning_dev
# REDIS_URL=redis://localhost:6379
```

---

## 📁 Project Structure Overview

```
islamic-learning-platform/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand stores
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                   # Express backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   └── config/           # Configuration
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   └── package.json
│
└── docs/                      # Documentation
```

---

## 🔥 Hot Reload

Both frontend and backend support hot reload:

- **Frontend:** Vite HMR (Hot Module Replacement) - changes appear instantly
- **Backend:** nodemon watches for file changes and restarts the server

---

## 🐛 Troubleshooting

### PostgreSQL Connection Failed

```bash
# Check if PostgreSQL is running
# Windows
Get-Service postgresql*

# macOS/Linux
sudo systemctl status postgresql

# Check connection
psql -U postgres -h localhost
```

### Redis Connection Failed

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If using WSL
wsl -d Ubuntu -e redis-cli ping
```

### Port Already in Use

```bash
# Find process using port (Windows PowerShell)
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
taskkill /PID <process_id> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
cd backend
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Getting Help

- Check existing [GitHub Issues](https://github.com/your-org/islamic-learning-platform/issues)
- Join our Discord community
- Email: support@example.com

---

## 🎉 You're Ready!

Your local development environment is set up. Happy coding!

**Quick Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Prisma Studio: http://localhost:5555
- Demo Login: demo@example.com / password123

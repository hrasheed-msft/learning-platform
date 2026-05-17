# Directus Setup for Islamic Learning Platform

Directus is a powerful headless CMS that provides a beautiful admin interface for managing your database content.

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Ensure Docker is installed** on your machine

2. **Update the docker-compose.yml** file with your actual PostgreSQL password:
   - Replace `your_postgres_password` in both the directus and postgres services

3. **Generate new keys** (recommended for security):
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```
   Update the `KEY` and `SECRET` values in docker-compose.yml

4. **Start Directus**:
   ```bash
   cd directus
   docker-compose up -d
   ```

5. **Access Directus**:
   - Admin Panel: `http://localhost:8055`
   - Default Email: `admin@example.com`
   - Default Password: `AdminPassword123!`

### Option 2: Using Node.js

If you prefer running without Docker:

1. **Install Directus CLI**:
   ```bash
   npm install -g @directus/cli
   ```

2. **Create a Directus project**:
   ```bash
   npx create-directus-app ./directus-app
   ```

3. **Follow the setup wizard** and connect it to your existing PostgreSQL database

## After Setup

### Connecting Your Frontend

Update your frontend environment variables to connect to Directus API:

```env
VITE_API_URL=http://localhost:8055/graphql
VITE_REST_API_URL=http://localhost:8055/items
VITE_DIRECTUS_URL=http://localhost:8055
```

### Useful Directus Features

- **GraphQL & REST APIs**: Query your data via `/graphql` or `/items/{collection_name}`
- **File Uploads**: Manage course thumbnails, documents, etc.
- **Relationships**: Define one-to-many and many-to-many relationships between collections
- **Permissions & Roles**: Set up different access levels for admins, editors, etc.
- **Webhooks**: Trigger actions when content changes
- **Extensions**: Build custom interfaces and operations

### Collections to Create

In Directus, create collections that match your Prisma schema:

1. **Courses** - Main course content
2. **Units** - Course subdivisions
3. **Lessons** - Individual lessons
4. **LessonContent** - Lesson materials
5. **FlashCards** - Flashcard items
6. **FlashCardSets** - Grouped flashcards
7. **Quizzes** - Assessment content
8. **Questions** - Quiz questions

### Syncing with Your Backend

Your backend API can query Directus:

```typescript
// Example: Fetching courses from Directus
const courses = await fetch('http://localhost:8055/items/courses')
  .then(res => res.json());
```

## Stopping Directus

```bash
cd directus
docker-compose down
```

## Troubleshooting

- **Port already in use**: Change port 8055 to something else in docker-compose.yml
- **Database connection error**: Verify PostgreSQL credentials and connection
- **Can't access admin panel**: Ensure Docker containers are running: `docker ps`

## Documentation

- Official Docs: https://docs.directus.io
- API Reference: https://docs.directus.io/reference/introduction
- Community: https://github.com/directus/directus

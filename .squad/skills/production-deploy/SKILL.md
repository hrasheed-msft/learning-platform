---
name: "production-deploy"
description: "Retrieve the production database connection for the Container App and run production seed scripts without exposing credentials."
domain: "deployment"
confidence: "low"
source: "observed"
tools:
  - name: "az"
    description: "Reads Azure Container App environment metadata and secrets for production connection setup."
    when: "When production seeding or direct database operations are needed."
---

## Context
Use this skill when production data seeding is needed for the Islamic Learning Platform backend.

Observed production resources:
- Resource group: `rg-islamic-learning-centralus`
- Container App: `ca-api-islamic-learning`
- Container Registry: `cr34odstpjgaabg`
- Backend path: `C:\Users\hrasheed\Dropbox\github-repos\projects\islamic-learning-platform\backend`
- `DATABASE_URL` is wired through Container App env var `DATABASE_URL` via secret ref `database-url`.

## Patterns
1. Check Azure login first:
   ```powershell
   az account show -o json
   ```
2. Inspect the Container App env metadata to confirm how `DATABASE_URL` is wired:
   ```powershell
   az containerapp show --name ca-api-islamic-learning --resource-group rg-islamic-learning-centralus --query "properties.template.containers[0].env[?name=='DATABASE_URL']" -o json
   ```
3. Retrieve the secret value only when needed. Do not print it to logs or save it to files:
   ```powershell
   $dbUrl = az containerapp secret list --show-values --name ca-api-islamic-learning --resource-group rg-islamic-learning-centralus --query "[?name=='database-url'].value | [0]" -o tsv
   ```
4. Seed production by setting the process-local environment variable, changing to the backend directory, and running the seed files:
   ```powershell
   $env:DATABASE_URL = $dbUrl
   Set-Location 'C:\Users\hrasheed\Dropbox\github-repos\projects\islamic-learning-platform\backend'
   npx ts-node prisma/seed-masaar-course.ts
   npx ts-node prisma/seed-masaar-quizzes.ts
   npx ts-node prisma/seed-masaar-flashcards.ts
   npx ts-node prisma/seed-masaar-terms.ts
   ```

## Examples
End-to-end production seeding flow:
```powershell
az account show -o json
az containerapp show --name ca-api-islamic-learning --resource-group rg-islamic-learning-centralus --query "properties.template.containers[0].env[?name=='DATABASE_URL']" -o json
$dbUrl = az containerapp secret list --show-values --name ca-api-islamic-learning --resource-group rg-islamic-learning-centralus --query "[?name=='database-url'].value | [0]" -o tsv
$env:DATABASE_URL = $dbUrl
Set-Location 'C:\Users\hrasheed\Dropbox\github-repos\projects\islamic-learning-platform\backend'
npx ts-node prisma/seed-masaar-course.ts
npx ts-node prisma/seed-masaar-quizzes.ts
npx ts-node prisma/seed-masaar-flashcards.ts
npx ts-node prisma/seed-masaar-terms.ts
```

Observed successful seed outcomes:
- `seed-masaar-course.ts`: upserted the al-Masār course shell and 8 units.
- `seed-masaar-quizzes.ts`: added 64 quiz questions across 8 units.
- `seed-masaar-flashcards.ts`: created 152 flashcards.
- `seed-masaar-terms.ts`: created 320 Arabic terms.

## Anti-Patterns
- Do not print or commit the resolved `DATABASE_URL` value.
- Do not assume `az containerapp secret list` returns secret values unless `--show-values` is supplied.
- Do not run the seed scripts outside the backend directory if local TypeScript/Prisma resolution is expected.

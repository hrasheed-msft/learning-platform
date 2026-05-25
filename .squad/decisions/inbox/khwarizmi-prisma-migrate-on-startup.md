# Prisma migrate on backend startup

- Date: 2026-05-24T21:00:31.834-05:00
- Author: Khwarizmi
- Status: Proposed

## Decision
Run `prisma migrate deploy` from the backend container entrypoint before launching the Node API, and keep the `prisma` CLI in production dependencies so Azure Container Apps can always apply pending schema migrations during rollout.

## Why
Production missed the `20260524160542_add_audio_cache_version` migration, which caused runtime failures when the generated Prisma client expected `audio_cache.cacheVersion`. The backend image previously generated Prisma client code at build time but did not guarantee schema migrations ran against the live database on deploy.

## Consequences
- Every backend deployment applies pending Prisma migrations before serving traffic.
- Azure Container Apps stays aligned with the checked-in Prisma migration history without manual SSH steps.
- Startup will fail fast if a migration cannot be applied, preventing the app from serving against an incompatible schema.

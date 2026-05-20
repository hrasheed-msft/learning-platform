# CI/CD Pipeline Setup Guide

> Created: 2026-05-20

This document covers the full setup for our GitHub Actions CI/CD pipeline.

## Overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci-cd.yml` | Push to `main`, PRs to `main` | Full pipeline: test → deploy |
| `test.yml` | PRs to `main` | Fast feedback: tests + lint only |

### Pipeline Flow

```
PR opened → test-backend + test-frontend (parallel)
                ↓ (must pass)
Merge to main → test-backend + test-frontend (parallel)
                ↓ (must pass)
             deploy-backend + deploy-frontend (parallel)
```

## Required Secrets

You need to add these secrets in **GitHub → Settings → Secrets and variables → Actions**.

### 1. `AZURE_CREDENTIALS`

Service principal JSON for Azure login. Create it with:

```bash
az ad sp create-for-rbac \
  --name "github-actions-islamic-learning" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/rg-islamic-learning-centralus \
  --sdk-auth
```

Copy the full JSON output and add it as the `AZURE_CREDENTIALS` secret. It looks like:

```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  ...
}
```

> **Note:** The service principal also needs `AcrPush` role on the container registry:
> ```bash
> az role assignment create \
>   --assignee <CLIENT_ID> \
>   --role AcrPush \
>   --scope /subscriptions/<SUB_ID>/resourceGroups/rg-islamic-learning-centralus/providers/Microsoft.ContainerRegistry/registries/cr34odstpjgaabg
> ```

### 2. `SWA_DEPLOYMENT_TOKEN`

Get it from the Azure Portal or CLI:

```bash
az staticwebapp secrets list \
  --name swa-islamic-learning-34odstpjgaabg \
  --resource-group rg-islamic-learning-centralus \
  --query "properties.apiKey" -o tsv
```

Add the token value as the `SWA_DEPLOYMENT_TOKEN` secret.

## Branch Protection

Enable these settings on the `main` branch:

1. Go to **GitHub → Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
     - Search and add: `test-backend`, `test-frontend`
   - ✅ **Require branches to be up to date before merging**
4. Save changes

### Result

After this setup:
- Direct pushes to `main` are blocked
- PRs must pass both `test-backend` and `test-frontend` before merge
- Deployments only happen after tests pass on `main`

## Testing Locally

Run the same commands CI uses:

```bash
# Backend
cd backend && npm ci && npx prisma generate && npm run test:ci

# Frontend
cd frontend && npm ci && npm run test:ci
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `prisma generate` fails in CI | Ensure `prisma` is in `devDependencies` and schema is committed |
| ACR build fails | Check `AZURE_CREDENTIALS` has `AcrPush` role |
| SWA deploy fails | Regenerate token if expired; check `output_location` matches build output dir |
| Tests pass locally but fail in CI | Check for env-dependent tests; CI has no `.env` file |

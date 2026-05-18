# Azure Deployment Guide — Islamic Learning Platform

> **Last updated:** 2026-05-17  
> **Author:** Khaldun (Lead Architect)  
> **Platform:** React + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Recommended Azure Services](#2-recommended-azure-services)
3. [Environment Configuration](#3-environment-configuration)
4. [Database Setup](#4-database-setup)
5. [CI/CD Pipeline](#5-cicd-pipeline)
6. [Networking & Security](#6-networking--security)
7. [Monitoring](#7-monitoring)
8. [Cost Estimates](#8-cost-estimates)
9. [Step-by-Step Deployment](#9-step-by-step-deployment)
10. [Scaling Considerations](#10-scaling-considerations)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Azure Front Door (optional)                    │
│                     CDN + WAF + Global Load Balancing                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌────────────────────────┐          ┌────────────────────────┐
│  Azure Static Web Apps │          │    Azure App Service   │
│   or Storage + CDN     │          │  or Container Apps     │
│                        │          │                        │
│  React + Vite (SPA)   │          │  Node.js + Express API │
│  Port 5173 → Static   │          │  Port 3000 → :8080     │
└────────────────────────┘          └───────────┬────────────┘
                                                │
                    ┌───────────────────────────┼───────────────┐
                    ▼                           ▼               ▼
         ┌──────────────────┐      ┌─────────────────┐  ┌──────────────┐
         │ Azure Database   │      │ Azure Cache     │  │ Azure Blob   │
         │ for PostgreSQL   │      │ for Redis       │  │ Storage      │
         │ (Flexible)       │      │                 │  │ (media)      │
         └──────────────────┘      └─────────────────┘  └──────────────┘
                    │
                    ▼
         ┌──────────────────┐      ┌─────────────────┐
         │ Azure Key Vault  │      │ Application     │
         │ (secrets)        │      │ Insights        │
         └──────────────────┘      └─────────────────┘
```

### Component Mapping

| Local Component | Azure Service | Purpose |
|---|---|---|
| React + Vite (`:5173`) | Azure Static Web Apps | SPA hosting, global CDN, auto-SSL |
| Node.js + Express (`:3000`) | Azure App Service (Linux) | REST API, JWT auth, business logic |
| PostgreSQL (`:5432`) | Azure Database for PostgreSQL Flexible Server | Primary data store, Prisma ORM |
| Redis (`:6379`) | Azure Cache for Redis | Session cache, rate limiting, SRS queues |
| Local `.env` secrets | Azure Key Vault | Secrets management, rotation |
| File uploads (multer) | Azure Blob Storage | Course media, images, audio |
| Console logs | Application Insights | APM, distributed tracing, alerts |

---

## 2. Recommended Azure Services

### 2.1 Backend — Azure App Service (Recommended) or Container Apps

**Option A: Azure App Service (Recommended for this project)**

- **Why:** Native Node.js runtime, built-in deployment slots, easy SSH access for Prisma migrations, App Insights integration, no Docker required.
- **SKU:** B1 (dev) → S1/P1v3 (production)
- **Runtime:** Node.js 18 LTS on Linux

**Option B: Azure Container Apps (Future consideration)**

- **Why:** Better for microservices, auto-scaling to zero, Dapr sidecar support.
- **When to switch:** If you split the monolith, need event-driven scaling, or want per-request billing.
- **Trade-off:** Requires Dockerfile maintenance, container registry, slightly more operational complexity.

### 2.2 Frontend — Azure Static Web Apps

- **Why:** Purpose-built for SPAs; free SSL, global CDN, GitHub Actions integration, staging environments on PRs, custom domains included.
- **SKU:** Free (dev) → Standard ($9/mo, custom auth, larger bandwidth)
- **Alternative:** Azure Storage static website + Azure CDN (more manual setup, but cheaper at scale)

### 2.3 Database — Azure Database for PostgreSQL (Flexible Server)

- **Why:** Managed PostgreSQL with high availability, automatic backups, point-in-time restore. Flexible Server is the current-gen offering.
- **SKU:** Burstable B1ms (dev, ~$12/mo) → General Purpose D2s_v3 (prod, ~$100/mo)
- **Version:** PostgreSQL 14+
- **Storage:** 32 GB (dev) → 128 GB+ (prod)

### 2.4 Cache — Azure Cache for Redis

- **Why:** Fully managed Redis; supports TLS, clustering, geo-replication.
- **SKU:** Basic C0 (dev, ~$16/mo) → Standard C1 (prod, ~$80/mo with HA)
- **Note:** Azure Redis requires TLS (`rediss://` protocol, port 6380)

### 2.5 Secrets — Azure Key Vault

- **Why:** Centralized secrets management with audit logging, RBAC, automatic rotation support. Never store secrets in App Service settings directly in production.
- **SKU:** Standard (~$0.03/10K operations)

### 2.6 Media Storage — Azure Blob Storage

- **Why:** Already configured in the backend (see `AZURE_STORAGE_CONNECTION_STRING` in `.env.example`). Cost-effective object storage for course media, images, audio files.
- **SKU:** Standard LRS (dev) → Standard GRS (prod, geo-redundant)
- **Container:** `media` (public blob access for course images)

---

## 3. Environment Configuration

### 3.1 Backend Environment Variables

These map directly to the project's `.env.example`:

```bash
# Core
NODE_ENV=production
PORT=8080                          # Azure App Service expects 8080

# Database (Key Vault reference recommended)
DATABASE_URL=postgresql://<user>:<pass>@<server>.postgres.database.azure.com:5432/islamic_learning?sslmode=require

# Redis (Azure Redis uses TLS on port 6380)
REDIS_URL=rediss://:<access-key>@<name>.redis.cache.windows.net:6380

# JWT (generate with: openssl rand -base64 64)
JWT_ACCESS_SECRET=<from-key-vault>
JWT_REFRESH_SECRET=<from-key-vault>
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d

# Password Hashing
BCRYPT_ROUNDS=12

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=<from-key-vault>
AZURE_STORAGE_CONTAINER_NAME=media

# CORS (your Static Web App URL)
FRONTEND_URL=https://<your-app>.azurestaticapps.net

# Rate Limiting (adjust for production traffic)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### 3.2 Frontend Environment Variables

Set at build time in CI/CD:

```bash
VITE_API_URL=https://<backend-app-name>.azurewebsites.net
```

### 3.3 Key Vault Integration

Instead of storing secrets directly in App Service settings, use Key Vault references:

```bash
# Create Key Vault
az keyvault create \
  --resource-group islamic-learning-rg \
  --name ilp-keyvault \
  --location eastus

# Store secrets
az keyvault secret set --vault-name ilp-keyvault --name "DatabaseUrl" --value "<connection-string>"
az keyvault secret set --vault-name ilp-keyvault --name "RedisUrl" --value "<redis-connection>"
az keyvault secret set --vault-name ilp-keyvault --name "JwtAccessSecret" --value "<secret>"
az keyvault secret set --vault-name ilp-keyvault --name "JwtRefreshSecret" --value "<secret>"
az keyvault secret set --vault-name ilp-keyvault --name "StorageConnectionString" --value "<storage-conn>"

# Enable App Service managed identity
az webapp identity assign \
  --resource-group islamic-learning-rg \
  --name islamic-learning-api

# Grant Key Vault access to App Service identity
az keyvault set-policy \
  --name ilp-keyvault \
  --object-id <managed-identity-principal-id> \
  --secret-permissions get list

# Reference secrets in App Service settings (format: @Microsoft.KeyVault(...))
az webapp config appsettings set \
  --resource-group islamic-learning-rg \
  --name islamic-learning-api \
  --settings \
    DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://ilp-keyvault.vault.azure.net/secrets/DatabaseUrl)" \
    REDIS_URL="@Microsoft.KeyVault(SecretUri=https://ilp-keyvault.vault.azure.net/secrets/RedisUrl)" \
    JWT_ACCESS_SECRET="@Microsoft.KeyVault(SecretUri=https://ilp-keyvault.vault.azure.net/secrets/JwtAccessSecret)" \
    JWT_REFRESH_SECRET="@Microsoft.KeyVault(SecretUri=https://ilp-keyvault.vault.azure.net/secrets/JwtRefreshSecret)"
```

---

## 4. Database Setup

### 4.1 Prisma Migrations in Azure

The project uses Prisma ORM with a substantial schema (~14 models for games alone, plus families, users, courses, flashcards, SRS, assessments). Migrations must be applied carefully.

**Strategy: Run migrations as a deployment step, not at app startup.**

```bash
# Option 1: From local machine (ensure firewall allows your IP)
cd backend
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Option 2: Via App Service SSH
az webapp ssh --resource-group islamic-learning-rg --name islamic-learning-api
cd /home/site/wwwroot
npx prisma migrate deploy

# Option 3: Via GitHub Actions (recommended — see CI/CD section)
```

### 4.2 Migration Commands Reference

```bash
# Development: Create new migration
npx prisma migrate dev --name <description>

# Production: Apply pending migrations (non-interactive, no data loss)
npx prisma migrate deploy

# Generate Prisma Client (required after schema changes)
npx prisma generate
```

### 4.3 Seeding Strategy

The platform has extensive seed data (20+ seed files for coursebooks, games, habits, etc.):

```
prisma/seed.ts                    # Main seed entry point
prisma/seed-maktab-coursebook1.ts # Coursebook 1
prisma/seed-maktab-coursebook2.ts # Coursebook 2
...                               # (10 coursebooks total)
prisma/seed-sarf-*.ts             # Arabic grammar courses
prisma/seed-games.ts              # Game definitions
prisma/seed-habits-course.ts      # Habits course
prisma/seed-quduri-taharah.ts     # Fiqh course (Quduri)
```

**Production seeding approach:**

1. **Initial deployment:** Run full seed once after migrations:
   ```bash
   DATABASE_URL="postgresql://..." npx ts-node prisma/seed.ts
   ```

2. **Subsequent deployments:** Only run new/updated seeds. Seeds use upsert patterns (idempotent), so re-running is safe but slow.

3. **Recommendation:** Create a seed manifest that tracks which seeds have been applied:
   ```bash
   # Run specific course seeds
   npx ts-node prisma/seed-maktab-coursebook1.ts
   npx ts-node prisma/seed-sarf-simple.ts
   ```

### 4.4 Database Backups

Azure PostgreSQL Flexible Server provides:
- **Automatic backups:** Daily full + continuous WAL archival
- **Retention:** 7 days (default) → 35 days (configurable)
- **Point-in-time restore:** Restore to any second within retention window
- **Geo-redundant backups:** Available on General Purpose tier and above

---

## 5. CI/CD Pipeline

### 5.1 GitHub Actions — Backend Deployment

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to Azure

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'
  workflow_dispatch:

env:
  AZURE_WEBAPP_NAME: islamic-learning-api
  NODE_VERSION: '18'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci --omit=dev

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Build TypeScript
        working-directory: backend
        run: npm run build

      - name: Prepare deployment package
        working-directory: backend
        run: |
          mkdir -p deploy
          cp -r dist deploy/
          cp -r prisma deploy/
          cp package.json deploy/
          cp package-lock.json deploy/
          cd deploy && npm ci --omit=dev && npx prisma generate

      - name: Run Prisma migrations
        working-directory: backend
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v3
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_BACKEND_PUBLISH_PROFILE }}
          package: backend/deploy

      - name: Health check
        run: |
          sleep 30
          curl --fail https://${{ env.AZURE_WEBAPP_NAME }}.azurewebsites.net/health || exit 1
```

### 5.2 GitHub Actions — Frontend Deployment

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to Azure Static Web Apps

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend.yml'
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  build-and-deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install and Build
        working-directory: frontend
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: |
          npm ci
          npm run build

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: frontend
          output_location: dist
          skip_app_build: true

  close-pr:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: close
```

### 5.3 Required GitHub Secrets

| Secret | Source |
|---|---|
| `AZURE_BACKEND_PUBLISH_PROFILE` | Azure Portal → App Service → Deployment Center → Publish Profile |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Portal → Static Web App → Manage deployment token |
| `DATABASE_URL` | PostgreSQL connection string for migrations |
| `VITE_API_URL` | Backend App Service URL (e.g., `https://islamic-learning-api.azurewebsites.net`) |

---

## 6. Networking & Security

### 6.1 VNet Integration (Production)

For production, isolate backend services within a Virtual Network:

```bash
# Create VNet
az network vnet create \
  --resource-group islamic-learning-rg \
  --name ilp-vnet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name app-subnet \
  --subnet-prefix 10.0.1.0/24

# Create subnet for private endpoints
az network vnet subnet create \
  --resource-group islamic-learning-rg \
  --vnet-name ilp-vnet \
  --name private-endpoints-subnet \
  --address-prefix 10.0.2.0/24

# Integrate App Service with VNet
az webapp vnet-integration add \
  --resource-group islamic-learning-rg \
  --name islamic-learning-api \
  --vnet ilp-vnet \
  --subnet app-subnet
```

### 6.2 Private Endpoints

Restrict database and Redis access to VNet only:

```bash
# PostgreSQL private endpoint
az network private-endpoint create \
  --resource-group islamic-learning-rg \
  --name pg-private-endpoint \
  --vnet-name ilp-vnet \
  --subnet private-endpoints-subnet \
  --private-connection-resource-id <postgres-resource-id> \
  --group-id postgresqlServer \
  --connection-name pg-connection

# Redis private endpoint
az network private-endpoint create \
  --resource-group islamic-learning-rg \
  --name redis-private-endpoint \
  --vnet-name ilp-vnet \
  --subnet private-endpoints-subnet \
  --private-connection-resource-id <redis-resource-id> \
  --group-id redisCache \
  --connection-name redis-connection

# Disable public access to PostgreSQL
az postgres flexible-server update \
  --resource-group islamic-learning-rg \
  --name islamic-learning-db \
  --public-access Disabled
```

### 6.3 CORS Configuration

The backend already configures CORS via the `FRONTEND_URL` env var:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: config.frontend.url,  // Set to Static Web App URL
  credentials: true,
}));
```

For production, set `FRONTEND_URL` (or `CORS_ORIGIN`) to your Static Web App domain:
```
https://<your-app>.azurestaticapps.net
```

If using a custom domain:
```
https://learn.yourdomain.com
```

### 6.4 Security Checklist

- [ ] **Helmet.js** — Already configured (sets security headers)
- [ ] **Rate limiting** — Already configured (`express-rate-limit`)
- [ ] **HTTPS only** — Enforce in App Service: `az webapp update --https-only true`
- [ ] **Managed Identity** — Use for Key Vault, Storage access (no keys in env vars)
- [ ] **PostgreSQL SSL** — Enforced via `?sslmode=require` in connection string
- [ ] **Redis TLS** — Enforced via `rediss://` protocol (port 6380)
- [ ] **JWT secrets** — Store in Key Vault, minimum 64 bytes, rotate quarterly
- [ ] **CORS** — Restrict to specific frontend domain (no wildcards)
- [ ] **Blob Storage** — Public read for media container only; private for user uploads
- [ ] **Network isolation** — VNet + private endpoints for prod databases

---

## 7. Monitoring

### 7.1 Application Insights Setup

```bash
# Create Application Insights (workspace-based)
az monitor app-insights component create \
  --resource-group islamic-learning-rg \
  --app ilp-insights \
  --location eastus \
  --kind web \
  --application-type Node.JS \
  --workspace <log-analytics-workspace-id>

# Get connection string
az monitor app-insights component show \
  --resource-group islamic-learning-rg \
  --app ilp-insights \
  --query "connectionString" -o tsv

# Add to App Service
az webapp config appsettings set \
  --resource-group islamic-learning-rg \
  --name islamic-learning-api \
  --settings \
    APPLICATIONINSIGHTS_CONNECTION_STRING="<connection-string>" \
    ApplicationInsightsAgent_EXTENSION_VERSION="~3"
```

### 7.2 Backend Instrumentation

Install the Application Insights SDK:

```bash
cd backend
npm install applicationinsights
```

Add to `src/index.ts` (before other imports):

```typescript
import appInsights from 'applicationinsights';

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights.setup()
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .start();
}
```

### 7.3 Key Metrics to Monitor

| Metric | Alert Threshold | Action |
|---|---|---|
| Response time (P95) | > 2s | Check DB query performance, add indexes |
| Error rate (5xx) | > 1% | Check logs, Prisma connection pool |
| CPU usage | > 80% sustained | Scale up App Service tier |
| Memory usage | > 80% | Check for memory leaks, increase plan |
| DB connections | > 80% of pool | Increase Prisma connection pool size |
| Redis memory | > 80% | Evict stale cache, upgrade tier |
| Failed requests | > 10/min | Investigate, check health endpoint |

### 7.4 Log Streaming

```bash
# Real-time log streaming
az webapp log tail \
  --resource-group islamic-learning-rg \
  --name islamic-learning-api

# Enable application logging
az webapp log config \
  --resource-group islamic-learning-rg \
  --name islamic-learning-api \
  --application-logging filesystem \
  --level information \
  --detailed-error-messages true
```

---

## 8. Cost Estimates

### 8.1 Development / Staging Environment

| Service | SKU | Estimated Monthly Cost |
|---|---|---|
| App Service (Backend) | B1 (1 core, 1.75 GB) | ~$13 |
| Static Web Apps (Frontend) | Free | $0 |
| PostgreSQL Flexible Server | Burstable B1ms | ~$12 |
| Azure Cache for Redis | Basic C0 (250 MB) | ~$16 |
| Blob Storage | Standard LRS, <10 GB | ~$1 |
| Key Vault | Standard, <10K ops | ~$1 |
| Application Insights | Free tier (5 GB/mo) | $0 |
| **Total (Dev)** | | **~$43/month** |

### 8.2 Production Environment

| Service | SKU | Estimated Monthly Cost |
|---|---|---|
| App Service (Backend) | P1v3 (2 cores, 8 GB) | ~$110 |
| Static Web Apps (Frontend) | Standard | ~$9 |
| PostgreSQL Flexible Server | GP D2s_v3, 128 GB, HA | ~$200 |
| Azure Cache for Redis | Standard C1 (1 GB, HA) | ~$80 |
| Blob Storage | Standard GRS, 100 GB | ~$5 |
| Key Vault | Standard | ~$3 |
| Application Insights | 10 GB/mo ingestion | ~$23 |
| Azure Front Door | Standard | ~$35 |
| VNet / Private Endpoints | 3 endpoints | ~$22 |
| **Total (Prod)** | | **~$487/month** |

### 8.3 Cost Optimization Tips

- **Dev/Test pricing:** Use Azure Dev/Test subscription for ~30% savings
- **Reserved Instances:** 1-year commitment saves ~35% on App Service and PostgreSQL
- **Auto-shutdown:** Stop dev database outside work hours (saves ~60%)
- **Redis:** Start with Basic C0 for dev; only upgrade when you need HA
- **Blob Storage:** Use lifecycle management to archive old course media to Cool tier

---

## 9. Step-by-Step Deployment

### Prerequisites

```bash
# Install Azure CLI
winget install Microsoft.AzureCLI   # Windows
brew install azure-cli               # macOS

# Login
az login

# Set subscription (if multiple)
az account set --subscription "<subscription-name-or-id>"
```

### Step 1: Create Resource Group

```bash
RESOURCE_GROUP="islamic-learning-rg"
LOCATION="eastus"

az group create --name $RESOURCE_GROUP --location $LOCATION
```

### Step 2: Create Azure Database for PostgreSQL

```bash
DB_SERVER="islamic-learning-db"
DB_ADMIN="dbadmin"
DB_PASSWORD="$(openssl rand -base64 32)"  # Save this securely!
DB_NAME="islamic_learning"

az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER \
  --location $LOCATION \
  --admin-user $DB_ADMIN \
  --admin-password "$DB_PASSWORD" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 14 \
  --public-access 0.0.0.0

az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER \
  --database-name $DB_NAME

# Save connection string
DB_URL="postgresql://${DB_ADMIN}:${DB_PASSWORD}@${DB_SERVER}.postgres.database.azure.com:5432/${DB_NAME}?sslmode=require"
echo "DATABASE_URL=$DB_URL"
```

### Step 3: Create Azure Cache for Redis

```bash
REDIS_NAME="islamic-learning-redis"

az redis create \
  --resource-group $RESOURCE_GROUP \
  --name $REDIS_NAME \
  --location $LOCATION \
  --sku Basic \
  --vm-size c0

# Wait for provisioning (~5 min), then get key
REDIS_KEY=$(az redis list-keys \
  --resource-group $RESOURCE_GROUP \
  --name $REDIS_NAME \
  --query "primaryKey" -o tsv)

REDIS_URL="rediss://:${REDIS_KEY}@${REDIS_NAME}.redis.cache.windows.net:6380"
echo "REDIS_URL=$REDIS_URL"
```

### Step 4: Create Azure Blob Storage

```bash
STORAGE_ACCOUNT="islamiclearningstorage"  # Must be globally unique, lowercase

az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2

az storage container create \
  --name media \
  --account-name $STORAGE_ACCOUNT \
  --public-access blob

STORAGE_CONN=$(az storage account show-connection-string \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --query "connectionString" -o tsv)
```

### Step 5: Create Key Vault and Store Secrets

```bash
KEYVAULT_NAME="ilp-keyvault"

az keyvault create \
  --resource-group $RESOURCE_GROUP \
  --name $KEYVAULT_NAME \
  --location $LOCATION

# Generate JWT secrets
JWT_ACCESS=$(openssl rand -base64 64)
JWT_REFRESH=$(openssl rand -base64 64)

# Store all secrets
az keyvault secret set --vault-name $KEYVAULT_NAME --name "DatabaseUrl" --value "$DB_URL"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "RedisUrl" --value "$REDIS_URL"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "JwtAccessSecret" --value "$JWT_ACCESS"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "JwtRefreshSecret" --value "$JWT_REFRESH"
az keyvault secret set --vault-name $KEYVAULT_NAME --name "StorageConnectionString" --value "$STORAGE_CONN"
```

### Step 6: Deploy Backend to App Service

```bash
APP_PLAN="islamic-learning-plan"
BACKEND_APP="islamic-learning-api"

# Create App Service Plan
az appservice plan create \
  --resource-group $RESOURCE_GROUP \
  --name $APP_PLAN \
  --location $LOCATION \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_PLAN \
  --name $BACKEND_APP \
  --runtime "NODE:18-lts"

# Enable managed identity
IDENTITY_ID=$(az webapp identity assign \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --query "principalId" -o tsv)

# Grant Key Vault access
az keyvault set-policy \
  --name $KEYVAULT_NAME \
  --object-id $IDENTITY_ID \
  --secret-permissions get list

# Configure app settings with Key Vault references
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --settings \
    NODE_ENV="production" \
    PORT="8080" \
    DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/DatabaseUrl)" \
    REDIS_URL="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/RedisUrl)" \
    JWT_ACCESS_SECRET="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/JwtAccessSecret)" \
    JWT_REFRESH_SECRET="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/JwtRefreshSecret)" \
    JWT_ACCESS_EXPIRES_IN="24h" \
    JWT_REFRESH_EXPIRES_IN="30d" \
    BCRYPT_ROUNDS="12" \
    AZURE_STORAGE_CONNECTION_STRING="@Microsoft.KeyVault(SecretUri=https://${KEYVAULT_NAME}.vault.azure.net/secrets/StorageConnectionString)" \
    AZURE_STORAGE_CONTAINER_NAME="media" \
    FRONTEND_URL="https://<your-static-web-app>.azurestaticapps.net" \
    RATE_LIMIT_WINDOW_MS="900000" \
    RATE_LIMIT_MAX_REQUESTS="1000"

# Enforce HTTPS
az webapp update \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --https-only true

# Set startup command
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --startup-file "node dist/index.js"
```

### Step 7: Run Database Migrations and Seed

```bash
# From your local machine (ensure your IP is allowed through PG firewall)
cd backend

# Add your IP to PostgreSQL firewall
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER \
  --rule-name AllowMyIP \
  --start-ip-address <your-ip> \
  --end-ip-address <your-ip>

# Run migrations
DATABASE_URL="$DB_URL" npx prisma migrate deploy

# Run initial seed
DATABASE_URL="$DB_URL" npx ts-node prisma/seed.ts

# Run additional course seeds as needed
DATABASE_URL="$DB_URL" npx ts-node prisma/seed-maktab-coursebook1.ts
DATABASE_URL="$DB_URL" npx ts-node prisma/seed-maktab-coursebook2.ts
# ... etc

# Remove firewall rule after seeding (if using private endpoints in prod)
az postgres flexible-server firewall-rule delete \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER \
  --rule-name AllowMyIP --yes
```

### Step 8: Deploy Backend Code

```bash
cd backend

# Build
npm ci
npm run build
npx prisma generate

# Create ZIP for deployment
zip -r deploy.zip dist/ prisma/ package.json package-lock.json node_modules/.prisma/

# Deploy via ZIP
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --src deploy.zip

# Verify
curl https://${BACKEND_APP}.azurewebsites.net/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Step 9: Deploy Frontend to Static Web Apps

```bash
STATIC_APP="islamic-learning-frontend"

# Create Static Web App
az staticwebapp create \
  --resource-group $RESOURCE_GROUP \
  --name $STATIC_APP \
  --location eastus2 \
  --sku Free \
  --source https://github.com/<your-org>/islamic-learning-platform \
  --branch main \
  --app-location "frontend" \
  --output-location "dist" \
  --login-with-github
```

Create `frontend/staticwebapp.config.json`:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.js", "/*.css", "/*.ico", "/*.svg", "/*.png"]
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  },
  "mimeTypes": {
    ".json": "application/json",
    ".woff2": "font/woff2"
  }
}
```

### Step 10: Configure Custom Domain (Optional)

```bash
# Backend custom domain
az webapp config hostname add \
  --resource-group $RESOURCE_GROUP \
  --webapp-name $BACKEND_APP \
  --hostname api.yourdomain.com

az webapp config ssl create \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP \
  --hostname api.yourdomain.com

# Frontend — configure via Azure Portal
# Static Web App → Custom domains → Add → Follow DNS verification
```

### Step 11: Verify End-to-End

```bash
# 1. Health check
curl https://${BACKEND_APP}.azurewebsites.net/health

# 2. API test (should return 401 for auth-required routes)
curl -s https://${BACKEND_APP}.azurewebsites.net/api/v1/courses | head -20

# 3. Frontend loads
curl -s -o /dev/null -w "%{http_code}" https://${STATIC_APP}.azurestaticapps.net

# 4. Check Application Insights for incoming requests
az monitor app-insights query \
  --resource-group $RESOURCE_GROUP \
  --app ilp-insights \
  --analytics-query "requests | take 5"
```

---

## 10. Scaling Considerations

### 10.1 When to Scale Up

| Signal | Current Tier | Action |
|---|---|---|
| Response P95 > 3s consistently | B1 App Service | Upgrade to S1 or P1v3 |
| DB CPU > 80% sustained | Burstable B1ms | Move to General Purpose D2s |
| Redis hit ratio < 90% or evictions | Basic C0 | Upgrade to Standard C1 |
| Concurrent users > 500 | B1 App Service | Enable auto-scaling (S1+) |
| Database > 80% storage | 32 GB | Increase storage (online operation) |
| Need deployment slots | B1 | Upgrade to S1+ (staging slots) |

### 10.2 Horizontal Scaling

**App Service:**
```bash
# Scale out (multiple instances)
az appservice plan update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_PLAN \
  --number-of-workers 3

# Auto-scale rules (requires S1 or higher)
az monitor autoscale create \
  --resource-group $RESOURCE_GROUP \
  --resource $APP_PLAN \
  --resource-type Microsoft.Web/serverfarms \
  --name "ilp-autoscale" \
  --min-count 2 \
  --max-count 10 \
  --count 2

az monitor autoscale rule create \
  --resource-group $RESOURCE_GROUP \
  --autoscale-name "ilp-autoscale" \
  --condition "CpuPercentage > 70 avg 5m" \
  --scale out 2

az monitor autoscale rule create \
  --resource-group $RESOURCE_GROUP \
  --autoscale-name "ilp-autoscale" \
  --condition "CpuPercentage < 30 avg 10m" \
  --scale in 1
```

### 10.3 Database Scaling

- **Vertical:** Change compute tier online (Burstable → GP → Memory Optimized)
- **Read replicas:** Add for read-heavy workloads (course browsing, leaderboards)
- **Connection pooling:** Prisma uses connection pooling by default; increase pool size:
  ```
  DATABASE_URL="postgresql://...?connection_limit=20&pool_timeout=10"
  ```

### 10.4 Redis Scaling

- **Vertical:** Upgrade SKU (C0 → C1 → C2) for more memory
- **Clustering:** Premium tier supports sharding across multiple nodes
- **Key areas consuming Redis in this app:**
  - Rate limiting state
  - JWT token blacklist (logout)
  - SRS review queue caching
  - Game session state (temporary)

### 10.5 Growth Milestones

| Users | Recommended Infra Changes |
|---|---|
| < 100 families | Dev tier is fine (B1, Burstable, Basic Redis) |
| 100–500 families | S1 App Service, GP D2s PostgreSQL, Standard C1 Redis |
| 500–2000 families | P1v3, read replica, Standard C2 Redis, Front Door |
| 2000+ families | Container Apps (auto-scale to zero off-peak), Premium Redis, geo-replication |

### 10.6 Container Apps Migration Path

When the platform outgrows App Service (need event-driven scaling, multi-service architecture):

1. Add `Dockerfile` to backend:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY prisma ./prisma/
   RUN npx prisma generate
   COPY dist ./dist/
   EXPOSE 8080
   CMD ["node", "dist/index.js"]
   ```

2. Push to Azure Container Registry
3. Deploy to Container Apps with auto-scaling rules
4. Benefits: Scale to zero (dev), per-request pricing, Dapr integration

---

## Appendix A: Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| `ECONNREFUSED` to Redis | Wrong port or missing TLS | Use `rediss://` (note double-s) and port `6380` |
| Prisma migration fails | Missing `prisma` directory in deployment | Ensure `prisma/` is included in ZIP deploy |
| `P1001: Can't reach database` | Firewall blocking | Add App Service outbound IPs to PG firewall, or use VNet |
| CORS errors in browser | `FRONTEND_URL` mismatch | Ensure exact match including protocol (https://) |
| App starts but 502 | Wrong startup command or port | Set `PORT=8080`, startup: `node dist/index.js` |
| Key Vault references show raw `@Microsoft.KeyVault(...)` | Identity not configured or policy missing | Verify managed identity and Key Vault policy |
| Static Web App 404 on refresh | SPA fallback not configured | Add `staticwebapp.config.json` with `navigationFallback` |

## Appendix B: File Reference

| File | Purpose |
|---|---|
| `backend/package.json` | Node.js deps, build/start scripts, `engines: >=18` |
| `backend/.env.example` | All required environment variables |
| `backend/prisma/schema.prisma` | Full database schema (PostgreSQL) |
| `backend/prisma/migrations/` | Migration history for `prisma migrate deploy` |
| `backend/src/index.ts` | Express server entry point (port, CORS, helmet, routes) |
| `frontend/package.json` | React deps, `build: tsc && vite build` |
| `frontend/vite.config.ts` | Dev proxy (`/api/v1` → backend), path aliases |
| `frontend/staticwebapp.config.json` | SPA routing rules for Azure Static Web Apps |
| `startup.ps1` | Local development startup script |

# Azure Deployment Guide

This guide covers deploying the Islamic Studies Learning Platform to Microsoft Azure using Azure App Service, Azure Database for PostgreSQL, Azure Cache for Redis, and Azure Blob Storage.

## 📋 Prerequisites

- Azure subscription ([Create free account](https://azure.microsoft.com/free/))
- Azure CLI installed ([Install guide](https://docs.microsoft.com/cli/azure/install-azure-cli))
- Node.js 18+ installed locally
- Git installed

### Install Azure CLI

**Windows (PowerShell):**
```powershell
winget install Microsoft.AzureCLI
```

**macOS:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Login to Azure

```bash
az login
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Azure Front Door                         │
│                    (CDN + WAF + SSL)                         │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌──────────────────┐                   ┌──────────────────┐
│  Static Web App  │                   │   App Service    │
│    (Frontend)    │                   │    (Backend)     │
│   React + Vite   │                   │  Node.js API     │
└──────────────────┘                   └──────────────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    ▼                           ▼                           ▼
          ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
          │ Azure PostgreSQL │       │  Azure Redis     │       │  Azure Blob      │
          │   Flexible       │       │  Cache           │       │  Storage         │
          └──────────────────┘       └──────────────────┘       └──────────────────┘
```

---

## 🚀 Step 1: Create Resource Group

```bash
# Set variables
RESOURCE_GROUP="islamic-learning-rg"
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION
```

---

## 🗄️ Step 2: Create Azure Database for PostgreSQL

```bash
# Variables
DB_SERVER_NAME="islamic-learning-db"
DB_ADMIN_USER="dbadmin"
DB_ADMIN_PASSWORD="YourSecurePassword123!"  # Change this!
DB_NAME="islamic_learning"

# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --location $LOCATION \
  --admin-user $DB_ADMIN_USER \
  --admin-password $DB_ADMIN_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 14 \
  --public-access 0.0.0.0

# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name $DB_NAME

# Get connection string
az postgres flexible-server show-connection-string \
  --server-name $DB_SERVER_NAME \
  --database-name $DB_NAME \
  --admin-user $DB_ADMIN_USER \
  --admin-password $DB_ADMIN_PASSWORD
```

**Connection String Format:**
```
postgresql://dbadmin:YourSecurePassword123!@islamic-learning-db.postgres.database.azure.com:5432/islamic_learning?sslmode=require
```

---

## 🔴 Step 3: Create Azure Cache for Redis

```bash
REDIS_NAME="islamic-learning-redis"

# Create Redis Cache (Basic tier for dev, Standard/Premium for production)
az redis create \
  --resource-group $RESOURCE_GROUP \
  --name $REDIS_NAME \
  --location $LOCATION \
  --sku Basic \
  --vm-size c0

# Get connection info (takes a few minutes to provision)
az redis show \
  --resource-group $RESOURCE_GROUP \
  --name $REDIS_NAME \
  --query "hostName"

az redis list-keys \
  --resource-group $RESOURCE_GROUP \
  --name $REDIS_NAME
```

**Redis Connection String Format:**
```
rediss://:YourRedisKey@islamic-learning-redis.redis.cache.windows.net:6380
```

---

## 📦 Step 4: Create Azure Blob Storage

```bash
STORAGE_ACCOUNT="islamiclearningstorage"  # Must be globally unique, lowercase

# Create Storage Account
az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2

# Create container for media files
az storage container create \
  --name media \
  --account-name $STORAGE_ACCOUNT \
  --public-access blob

# Get storage key
az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT \
  --query "[0].value" -o tsv
```

---

## 🖥️ Step 5: Deploy Backend to Azure App Service

### Create App Service Plan and Web App

```bash
APP_SERVICE_PLAN="islamic-learning-plan"
BACKEND_APP_NAME="islamic-learning-api"  # Must be globally unique

# Create App Service Plan (Linux)
az appservice plan create \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_PLAN \
  --location $LOCATION \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $BACKEND_APP_NAME \
  --runtime "NODE:18-lts"
```

### Configure Environment Variables

```bash
# Set application settings
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings \
    NODE_ENV="production" \
    PORT="8080" \
    DATABASE_URL="postgresql://dbadmin:YourSecurePassword123!@islamic-learning-db.postgres.database.azure.com:5432/islamic_learning?sslmode=require" \
    REDIS_URL="rediss://:YourRedisKey@islamic-learning-redis.redis.cache.windows.net:6380" \
    JWT_ACCESS_SECRET="your-production-access-secret" \
    JWT_REFRESH_SECRET="your-production-refresh-secret" \
    JWT_ACCESS_EXPIRES_IN="24h" \
    JWT_REFRESH_EXPIRES_IN="30d" \
    AZURE_STORAGE_ACCOUNT="islamiclearningstorage" \
    AZURE_STORAGE_KEY="your-storage-key" \
    AZURE_STORAGE_CONTAINER="media" \
    CORS_ORIGIN="https://your-frontend-domain.azurestaticapps.net"
```

### Deploy Backend Code

**Option A: Deploy from Local (ZIP Deploy)**

```bash
cd backend

# Build the application
npm run build

# Create deployment package
zip -r deploy.zip dist package.json package-lock.json prisma

# Deploy
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --src deploy.zip
```

**Option B: GitHub Actions (Recommended)**

Create `.github/workflows/backend-deploy.yml`:

```yaml
name: Deploy Backend to Azure

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Build
        working-directory: backend
        run: npm run build
      
      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.AZURE_BACKEND_APP_NAME }}
          publish-profile: ${{ secrets.AZURE_BACKEND_PUBLISH_PROFILE }}
          package: backend
```

### Run Database Migrations

```bash
# Connect to App Service via SSH or use deployment script
az webapp ssh --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME

# In SSH session
cd /home/site/wwwroot
npx prisma migrate deploy
```

---

## 🌐 Step 6: Deploy Frontend to Azure Static Web Apps

### Create Static Web App

```bash
STATIC_APP_NAME="islamic-learning-frontend"

# Create Static Web App (via Azure Portal recommended for GitHub integration)
az staticwebapp create \
  --resource-group $RESOURCE_GROUP \
  --name $STATIC_APP_NAME \
  --location $LOCATION \
  --sku Free
```

### Configure Build Settings

Create `frontend/staticwebapp.config.json`:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.js", "/*.css", "/*.ico", "/*.svg"]
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;"
  },
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

### GitHub Actions Deployment

Create `.github/workflows/frontend-deploy.yml`:

```yaml
name: Deploy Frontend to Azure Static Web Apps

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [main]

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    
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
          action: "upload"
          app_location: "frontend"
          output_location: "dist"

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

---

## 🔐 Step 7: Configure Custom Domain & SSL

### Backend Custom Domain

```bash
# Add custom domain
az webapp config hostname add \
  --resource-group $RESOURCE_GROUP \
  --webapp-name $BACKEND_APP_NAME \
  --hostname api.yourdomain.com

# Create managed certificate
az webapp config ssl create \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --hostname api.yourdomain.com

# Bind SSL certificate
az webapp config ssl bind \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --certificate-thumbprint <cert-thumbprint> \
  --ssl-type SNI
```

### Frontend Custom Domain

Configure via Azure Portal:
1. Go to Static Web App → Custom domains
2. Add your domain
3. Azure automatically provisions SSL certificate

---

## 📊 Step 8: Set Up Application Insights (Monitoring)

```bash
APP_INSIGHTS_NAME="islamic-learning-insights"

# Create Application Insights
az monitor app-insights component create \
  --resource-group $RESOURCE_GROUP \
  --app $APP_INSIGHTS_NAME \
  --location $LOCATION \
  --kind web \
  --application-type Node.JS

# Get instrumentation key
az monitor app-insights component show \
  --resource-group $RESOURCE_GROUP \
  --app $APP_INSIGHTS_NAME \
  --query "instrumentationKey" -o tsv

# Add to App Service
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="your-instrumentation-key"
```

---

## 🔄 Step 9: Configure Auto-Scaling (Production)

```bash
# Enable autoscale on App Service Plan
az monitor autoscale create \
  --resource-group $RESOURCE_GROUP \
  --resource $APP_SERVICE_PLAN \
  --resource-type Microsoft.Web/serverfarms \
  --name "autoscale-config" \
  --min-count 1 \
  --max-count 5 \
  --count 1

# Add CPU-based scale rule
az monitor autoscale rule create \
  --resource-group $RESOURCE_GROUP \
  --autoscale-name "autoscale-config" \
  --condition "CpuPercentage > 70 avg 5m" \
  --scale out 1

az monitor autoscale rule create \
  --resource-group $RESOURCE_GROUP \
  --autoscale-name "autoscale-config" \
  --condition "CpuPercentage < 30 avg 5m" \
  --scale in 1
```

---

## 💰 Cost Estimation

| Service | SKU | Est. Monthly Cost |
|---------|-----|-------------------|
| App Service | B1 (Basic) | ~$13 |
| PostgreSQL Flexible | B1ms (Burstable) | ~$15 |
| Redis Cache | C0 (Basic) | ~$16 |
| Static Web Apps | Free | $0 |
| Blob Storage | Standard LRS | ~$2 |
| Application Insights | 5GB/month | $0 (free tier) |
| **Total (Dev/Test)** | | **~$46/month** |

**Production Recommendations:**
- App Service: P1v2 (~$73/month)
- PostgreSQL: D2s_v3 (~$125/month)
- Redis: C1 Standard (~$81/month)

---

## 🔧 GitHub Secrets Configuration

Add these secrets to your GitHub repository:

| Secret Name | Description |
|-------------|-------------|
| `AZURE_BACKEND_APP_NAME` | Backend App Service name |
| `AZURE_BACKEND_PUBLISH_PROFILE` | Download from App Service → Deployment Center |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | From Static Web App → Manage deployment token |
| `VITE_API_URL` | Backend API URL (e.g., https://islamic-learning-api.azurewebsites.net/api/v1) |

---

## ✅ Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Seed data loaded (if needed)
- [ ] Environment variables configured
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] CORS settings verified
- [ ] Application Insights connected
- [ ] Health check endpoint responding
- [ ] Authentication flow working
- [ ] File uploads working (Blob Storage)
- [ ] Redis caching working

---

## 🐛 Troubleshooting

### View Application Logs

```bash
# Stream live logs
az webapp log tail \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME

# Download logs
az webapp log download \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME
```

### Check App Service Health

```bash
# Get app status
az webapp show \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --query "state"

# Restart app
az webapp restart \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME
```

### Database Connection Issues

1. Check firewall rules allow Azure services
2. Verify connection string format
3. Ensure SSL mode is set to `require`

```bash
# Add firewall rule for Azure services
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

## 🧹 Cleanup Resources

To delete all resources when no longer needed:

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

---

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/)
- [Azure Cache for Redis](https://docs.microsoft.com/azure/azure-cache-for-redis/)
- [Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/)

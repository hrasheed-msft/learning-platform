# Dev Environment Setup Guide

This guide walks you through provisioning a separate Azure dev environment and wiring it into the CI/CD pipeline so that pushes to the `dev` branch deploy automatically.

---

## 1. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Azure CLI | ≥ 2.55 | https://docs.microsoft.com/cli/azure/install-azure-cli |
| Azure Developer CLI (azd) | ≥ 1.5 | https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd |
| Node.js | 20.x | https://nodejs.org |
| GitHub CLI (optional but useful) | ≥ 2.40 | https://cli.github.com |

Log in to both CLIs before starting:

```bash
az login
azd auth login
```

---

## 2. Provision the Dev Environment with azd

The Bicep templates are already parameterised by `environmentName`. A second `azd` environment named `islamic-learning-dev` produces a completely independent set of Azure resources.

```bash
# From the repo root
azd env new islamic-learning-dev

# Set the region (keep it consistent with prod)
azd env set AZURE_LOCATION centralus

# Provision all infrastructure (Resource Group, ACR, Container App,
# PostgreSQL, Redis, Key Vault, SWA, App Insights)
azd provision
```

`azd provision` will prompt for:
- `postgresAdminPassword` — choose a strong password and store it in a password manager
- `postgresAdminUser`     — default is `pgadmin`; you can accept the default

This creates a resource group named `rg-islamic-learning-dev-centralus` and all resources inside it.

> **Note:** `azd provision` does NOT deploy application code; it only creates infrastructure.

---

## 3. Retrieve the Resource Names (for CI/CD secrets)

After provisioning, read the azd outputs to get the exact resource names:

```bash
azd env get-values --environment islamic-learning-dev
```

The values you need for CI/CD secrets:

| azd output key | GitHub Secret name | Example value |
|---|---|---|
| `AZURE_RESOURCE_GROUP` | `RESOURCE_GROUP` | `rg-islamic-learning-dev-centralus` |
| `AZURE_CONTAINER_REGISTRY_NAME` | `ACR_NAME` | `cr<token>` |
| (Container App name — see below) | `CONTAINER_APP_NAME` | `ca-api-islamic-learning-dev-<token>` |

The Container App name is not currently emitted as an azd output. Retrieve it directly:

```bash
az containerapp list \
  --resource-group rg-islamic-learning-dev-centralus \
  --query "[].name" -o tsv
```

---

## 4. Create the Azure Service Principal for the Dev Environment

The CI/CD workflow needs a service principal scoped to the dev resource group.

```bash
DEV_RG="rg-islamic-learning-dev-centralus"
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

az ad sp create-for-rbac \
  --name "sp-islamic-learning-dev-cicd" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$DEV_RG \
  --sdk-auth
```

Copy the entire JSON output — this becomes the `AZURE_CREDENTIALS` secret for the `dev` GitHub environment.

---

## 5. Get the Static Web App Deployment Token (Dev)

```bash
DEV_RG="rg-islamic-learning-dev-centralus"

# List the SWA name first
az staticwebapp list --resource-group $DEV_RG --query "[].name" -o tsv

# Then get the token
az staticwebapp secrets list \
  --name <swa-name-from-above> \
  --resource-group $DEV_RG \
  --query "properties.apiKey" -o tsv
```

---

## 6. Configure GitHub Environments and Secrets

### 6.1 Create GitHub Environments

Go to **GitHub → your repo → Settings → Environments** and create two environments:

- `dev`
- `prod`

### 6.2 Set Secrets for the `prod` Environment

Move the existing repository-level secrets into the `prod` environment. Each secret below must be added under **Settings → Environments → prod → Environment secrets**.

| Secret name | Value |
|---|---|
| `AZURE_CREDENTIALS` | Existing `AZURE_CREDENTIALS` repo secret value |
| `SWA_DEPLOYMENT_TOKEN` | Existing `SWA_DEPLOYMENT_TOKEN` repo secret value |
| `ACR_NAME` | `cr34odstpjgaabg` (current prod ACR) |
| `CONTAINER_APP_NAME` | `ca-api-islamic-learning` (current prod container app) |
| `RESOURCE_GROUP` | `rg-islamic-learning-centralus` |

Once the environment secrets are set, **delete the old repository-level secrets** (`AZURE_CREDENTIALS` and `SWA_DEPLOYMENT_TOKEN`) so they don't conflict.

### 6.3 Set Secrets for the `dev` Environment

Under **Settings → Environments → dev → Environment secrets**, add:

| Secret name | Value |
|---|---|
| `AZURE_CREDENTIALS` | JSON from step 4 (dev service principal) |
| `SWA_DEPLOYMENT_TOKEN` | Token from step 5 |
| `ACR_NAME` | Dev ACR name from step 3 |
| `CONTAINER_APP_NAME` | Dev container app name from step 3 |
| `RESOURCE_GROUP` | `rg-islamic-learning-dev-centralus` |

### 6.4 Optional: Add Environment Protection Rules

For prod, consider enabling **required reviewers** under the environment settings so that every push to `main` requires a manual approval before deploying.

---

## 7. Create the `dev` Branch and Test the Pipeline

```bash
git checkout -b dev
git push origin dev
```

The CI/CD workflow (`ci-cd.yml`) will:
1. Run backend and frontend tests
2. On success, trigger `deploy-backend-dev` and `deploy-frontend-dev`
3. Both jobs pull secrets from the `dev` GitHub environment

Monitor progress in **GitHub → Actions**.

---

## 8. Seed the Dev Database

After the Container App is running, seed the dev database by exec-ing into the container:

```bash
DEV_RG="rg-islamic-learning-dev-centralus"
DEV_CA=$(az containerapp list --resource-group $DEV_RG --query "[0].name" -o tsv)

# Open an interactive shell in the running container
az containerapp exec \
  --name $DEV_CA \
  --resource-group $DEV_RG \
  --command /bin/sh

# Inside the container:
node dist/prisma/seed.js
```

Alternatively, run the seed from a developer machine by temporarily pointing `DATABASE_URL` at the dev Postgres instance (requires opening the dev Postgres firewall rule for your IP):

```bash
# On the dev machine (not in prod — guarded by NODE_ENV check in seed.ts)
cd backend
DATABASE_URL="postgresql://pgadmin:<password>@<dev-psql-host>:5432/postgres?sslmode=require" \
  NODE_ENV=development \
  npx ts-node prisma/seed.ts
```

---

## 9. CI/CD Flow Summary

```
Push to dev  →  tests pass  →  deploy-backend-dev  +  deploy-frontend-dev
Push to main →  tests pass  →  deploy-backend      +  deploy-frontend
PR to dev    →  tests only
PR to main   →  tests only
```

Both deploy paths are structurally identical; they differ only in which GitHub Environment is referenced (`dev` vs `prod`), and therefore which scoped secrets are injected.

---

## 10. Cost Considerations

The dev environment replicates the prod resource SKUs as defined in `infra/resources.bicep`. To reduce dev costs, consider:

- Scaling down PostgreSQL to the smallest burstable SKU after provisioning:
  ```bash
  az postgres flexible-server update \
    --resource-group rg-islamic-learning-dev-centralus \
    --name <psql-name> \
    --sku-name Standard_B1ms
  ```
- Setting Container App min replicas to 0 (scale to zero when idle):
  ```bash
  az containerapp update \
    --name <ca-name> \
    --resource-group rg-islamic-learning-dev-centralus \
    --min-replicas 0
  ```
- Redis: Basic C0 tier is sufficient for dev.

---

## 11. Tearing Down the Dev Environment

```bash
azd down --environment islamic-learning-dev
```

This deletes all resources in `rg-islamic-learning-dev-centralus`. Prod is unaffected.

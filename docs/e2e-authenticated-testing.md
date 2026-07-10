# Authenticated E2E testing (production verification)

This project uses Playwright for authenticated production smoke checks.

## 1. Install dependencies

```powershell
cd frontend
npm install
npx playwright install chromium
```

## 2. Configure local test credentials

Create `frontend/.env.e2e.local` (local only, do not commit) from `frontend/.env.e2e.example`:

```dotenv
E2E_BASE_URL=https://icy-field-0f8ffd710.7.azurestaticapps.net
E2E_API_URL=https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1
E2E_PARENT_EMAIL=...
E2E_PARENT_PASSWORD=...
```

Then load the variables in your shell before running tests.

PowerShell example:

```powershell
Get-Content frontend/.env.e2e.local | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
  $name, $value = $_ -split '=', 2
  [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), 'Process')
}
```

## 3. Run authenticated E2E tests

```powershell
cd frontend
npm run test:e2e
```

The suite validates:
1. Parent login
2. Maktab navigation
3. Enrollment modal learner selection
4. Start button enabled and enrollment action response

import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

const parentEmail = process.env.E2E_PARENT_EMAIL || 'hassan.rasheed1@live.com';
const parentPassword = process.env.E2E_PARENT_PASSWORD || 'MrBaby12!';

// Ibn Sharif — the only child learner for this parent
const IBN_SHARIF = {
  id: 'b32bf819-1662-47c5-b80f-2e2ca6bd26ab',
  name: 'Ibn Sharif',
  isAccountOwner: false,
  age: null as null,
  ageCategory: 'CHILD' as const,
  avatarUrl: null as null,
  currentStreak: 0,
  longestStreak: 0,
  totalPoints: 0,
  familyId: 'fb93318f-648d-4bee-808e-71ff89f6c371',
};

function ensureResultsDir() {
  const dir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function parentLogin(request: Parameters<Parameters<typeof test>[1]>[0]['request']) {
  const resp = await request.post(`${apiUrl}/auth/login`, {
    data: { email: parentEmail, password: parentPassword },
  });
  if (!resp.ok()) throw new Error(`Parent login failed: ${resp.status()} ${await resp.text()}`);
  const body = await resp.json() as {
    data: { accessToken: string; refreshToken: string; user: unknown; family: unknown };
  };
  return body.data;
}

test.describe('Phase 1 — Nav permissions', () => {
  test('MainLayout hides Parent Dashboard + Settings when child member is selected', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');

    const authData = await parentLogin(request);

    // Inject parent auth + Ibn Sharif as selected member into localStorage
    await page.addInitScript(({ auth, member }) => {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: auth.user,
            family: auth.family,
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
            isAuthenticated: true,
          },
          version: 0,
        })
      );
      localStorage.setItem(
        'family-storage',
        JSON.stringify({
          state: { selectedMember: member },
          version: 0,
        })
      );
    }, { auth: authData, member: IBN_SHARIF });

    // Navigate to /dashboard — should use MainLayout (parent auth, child selected)
    await page.goto('/dashboard', { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(2000);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'phase1-nav-child-selected.png'), fullPage: true });

    const bodyText = await page.locator('body').innerText();
    console.log('URL after /dashboard nav:', page.url());
    console.log('Body text (first 1500):', bodyText.slice(0, 1500));

    // The ProtectedRoute allows /dashboard when selectedMember is not null
    // even if it's a child member — the parent can view the family dashboard.
    // MainLayout filters parentOnly nav items when selectedMember.isAccountOwner === false.

    // Assert sidebar nav: parent-only items HIDDEN
    const navLinks = page.locator('aside nav a');
    const navTexts = await navLinks.allInnerTexts();
    console.log('Nav links visible:', navTexts);

    expect(
      navTexts.some((t) => t.includes('Parent Dashboard')),
      `"Parent Dashboard" link should be hidden when child is selected, but found in nav: ${JSON.stringify(navTexts)}`
    ).toBe(false);

    expect(
      navTexts.some((t) => t.includes('Settings')),
      `"Settings" link should be hidden when child is selected, but found in nav: ${JSON.stringify(navTexts)}`
    ).toBe(false);

    // Assert non-parent-only items ARE visible
    expect(
      navTexts.some((t) => t.includes('Dashboard')),
      'Top-level "Dashboard" link should still be visible'
    ).toBe(true);

    expect(
      navTexts.some((t) => t.includes('Courses')),
      '"Courses" link should still be visible'
    ).toBe(true);

    console.log('[PASS] MainLayout correctly hides Parent Dashboard and Settings when child is selected.');
  });

  test('clicking Ibn Sharif tile on /select-learner redirects to /child/dashboard with ChildLayout nav', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');

    const authData = await parentLogin(request);

    // Inject parent auth (no selectedMember) — triggers /select-learner redirect
    await page.addInitScript(({ auth }) => {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: auth.user,
            family: auth.family,
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
            isAuthenticated: true,
          },
          version: 0,
        })
      );
      // Explicitly clear selectedMember
      localStorage.setItem(
        'family-storage',
        JSON.stringify({ state: { selectedMember: null }, version: 0 })
      );
    }, { auth: authData });

    // Go to /select-learner
    await page.goto('/select-learner', { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(2000);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'phase1-select-learner.png'), fullPage: true });
    console.log('select-learner URL:', page.url());
    console.log('Page text:', (await page.locator('body').innerText()).slice(0, 800));

    // Find and click Ibn Sharif's tile
    const ibnSharifBtn = page.getByRole('button', { name: /Ibn Sharif/i });
    await expect(ibnSharifBtn, 'Ibn Sharif tile not found on /select-learner').toBeVisible();
    await ibnSharifBtn.click();

    // Wait for redirect to /child/dashboard
    await page.waitForURL(/\/child\/dashboard/, { timeout: 15_000 });
    const childDashUrl = page.url();
    console.log('After tile click URL:', childDashUrl);
    expect(childDashUrl, 'Expected redirect to /child/dashboard').toContain('/child/dashboard');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(resultsDir, 'phase1-child-dashboard-via-parent.png'), fullPage: true });

    // /child/dashboard uses ChildLayout — assert child nav items
    const navLinks = page.locator('aside nav a');
    const navTexts = await navLinks.allInnerTexts();
    console.log('ChildLayout nav links:', navTexts);

    // Assert child-specific nav items ARE visible
    expect(
      navTexts.some((t) => t.includes('My Dashboard')),
      '"My Dashboard" link should be in ChildLayout nav'
    ).toBe(true);

    expect(
      navTexts.some((t) => t.includes('My Courses')),
      '"My Courses" link should be in ChildLayout nav'
    ).toBe(true);

    // Assert parent-only items NOT in ChildLayout nav
    expect(
      navTexts.some((t) => t.includes('Parent Dashboard')),
      '"Parent Dashboard" must not appear in ChildLayout nav'
    ).toBe(false);

    expect(
      navTexts.some((t) => t.includes('Settings')),
      '"Settings" must not appear in ChildLayout nav'
    ).toBe(false);

    console.log('[PASS] Redirect to /child/dashboard confirmed; ChildLayout nav correct (no parent-only items).');
  });
});

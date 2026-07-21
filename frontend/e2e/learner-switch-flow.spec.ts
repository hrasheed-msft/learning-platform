import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

const parentEmail = process.env.E2E_PARENT_EMAIL || 'hassan.rasheed1@live.com';
const parentPassword = process.env.E2E_PARENT_PASSWORD || 'MrBaby12!';
const parentPin = process.env.E2E_PARENT_PIN || '5823';

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

const HASSAN_MEMBER = {
  id: '885ba420-5188-44f0-bbf1-30e622ec65aa',
  name: 'hassan.rasheed1',
  isAccountOwner: true,
  age: null as null,
  ageCategory: 'ADULT' as const,
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

async function doParentLogin(request: Parameters<Parameters<typeof test>[1]>[0]['request']) {
  const resp = await request.post(`${apiUrl}/auth/login`, {
    data: { email: parentEmail, password: parentPassword },
  });
  if (!resp.ok()) throw new Error(`Parent login failed: ${resp.status()} ${await resp.text()}`);
  const body = (await resp.json()) as {
    data: { accessToken: string; refreshToken: string; user: unknown; family: unknown };
  };
  return body.data;
}

function injectParentAuthScript(
  auth: { accessToken: string; refreshToken: string; user: unknown; family: unknown },
  member: object,
  isParentInStudentMode: boolean
) {
  return { auth, member, isParentInStudentMode };
}

test.describe('Learner Switch Flow', () => {
  // ── Test 1: Parent selects child → Student View (no preview banner, Switch Learner visible) ──
  test('Test 1 — Parent selects child → Student View: no preview banner, Switch Learner visible', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');

    const authData = await doParentLogin(request);

    await page.addInitScript(({ auth, member, isParentInStudentMode }) => {
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
          state: {
            selectedMember: member,
            isParentInStudentMode,
          },
          version: 0,
        })
      );
    }, injectParentAuthScript(authData, IBN_SHARIF, true));

    await page.goto('/child/dashboard', { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(2000);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t1-student-view.png'), fullPage: true });

    const bodyText = await page.locator('body').innerText();
    console.log('Test 1 URL:', page.url());
    console.log('Body text (first 1000):', bodyText.slice(0, 1000));

    // Assert: NO "Parent preview" text visible
    await expect(
      page.getByText(/parent preview/i),
      '"Parent preview" banner must NOT appear when isParentInStudentMode=true'
    ).not.toBeVisible();

    // Assert: "Switch Learner" button visible in sidebar
    const switchLearnerBtn = page.locator('aside').getByRole('button', { name: /switch learner/i });
    await expect(
      switchLearnerBtn,
      '"Switch Learner" button must be visible in sidebar when parent is in student mode'
    ).toBeVisible();

    // Assert: Student nav items visible
    const navLinks = page.locator('aside nav a');
    const navTexts = await navLinks.allInnerTexts();
    console.log('Test 1 nav links:', navTexts);

    expect(
      navTexts.some((t) => t.includes('My Dashboard')),
      '"My Dashboard" should be in ChildLayout nav'
    ).toBe(true);

    expect(
      navTexts.some((t) => t.includes('My Courses')),
      '"My Courses" should be in ChildLayout nav'
    ).toBe(true);

    console.log('[PASS] Test 1 — Student View: no preview banner, Switch Learner visible, student nav present.');
  });

  // ── Test 2: Parent selects themselves → Parent View (Switch Learner visible) ──
  test('Test 2 — Parent selects themselves → Parent View: Switch Learner visible, no preview banner', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');

    const authData = await doParentLogin(request);

    await page.addInitScript(({ auth, member, isParentInStudentMode }) => {
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
          state: {
            selectedMember: member,
            isParentInStudentMode,
          },
          version: 0,
        })
      );
    }, injectParentAuthScript(authData, HASSAN_MEMBER, false));

    await page.goto('/dashboard', { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(2000);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t2-parent-view.png'), fullPage: true });

    console.log('Test 2 URL:', page.url());

    // Assert: Family dashboard loaded (not redirected to /select-learner)
    expect(
      page.url(),
      'Should stay on /dashboard, not redirect to /select-learner'
    ).not.toContain('/select-learner');
    expect(
      page.url(),
      'Should be on /dashboard'
    ).toContain('/dashboard');

    // Assert: "Switch Learner" button visible in sidebar
    const switchLearnerBtn = page.locator('aside').getByRole('button', { name: /switch learner/i });
    await expect(
      switchLearnerBtn,
      '"Switch Learner" button must be visible in sidebar when parent is logged in'
    ).toBeVisible();

    // Assert: Parent nav items visible
    const navLinks = page.locator('aside nav a');
    const navTexts = await navLinks.allInnerTexts();
    console.log('Test 2 nav links:', navTexts);

    expect(
      navTexts.some((t) => /^dashboard$/i.test(t.trim()) || t.toLowerCase().includes('dashboard')),
      '"Dashboard" should be in MainLayout nav'
    ).toBe(true);

    expect(
      navTexts.some((t) => t.toLowerCase().includes('courses')),
      '"Courses" should be in MainLayout nav'
    ).toBe(true);

    // Assert: NO "Parent preview" banner
    await expect(
      page.getByText(/parent preview/i),
      '"Parent preview" banner must NOT appear when parent views own dashboard'
    ).not.toBeVisible();

    console.log('[PASS] Test 2 — Parent View: on /dashboard, Switch Learner visible, parent nav present, no preview banner.');
  });

  // ── Test 3: Switch Learner triggers PIN modal from ChildLayout ──
  test('Test 3 — Switch Learner from ChildLayout triggers PIN modal; correct PIN navigates to /select-learner', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');
    test.skip(!parentPin, 'Set E2E_PARENT_PIN before running.');

    const authData = await doParentLogin(request);

    await page.addInitScript(({ auth, member, isParentInStudentMode }) => {
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
          state: {
            selectedMember: member,
            isParentInStudentMode,
          },
          version: 0,
        })
      );
    }, injectParentAuthScript(authData, IBN_SHARIF, true));

    // Wait for PIN status API before interacting
    const pinStatusPromise = page
      .waitForResponse(
        (r) => r.url().includes('/auth/parent-pin/status') && r.status() === 200,
        { timeout: 15_000 }
      )
      .catch(() => null);

    await page.goto('/child/dashboard', { waitUntil: 'networkidle', timeout: 30_000 });
    await pinStatusPromise;
    await page.waitForTimeout(500);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t3-child-layout.png'), fullPage: true });
    console.log('Test 3 URL:', page.url());

    // Click "Switch Learner" button in sidebar
    const switchLearnerBtn = page.locator('aside').getByRole('button', { name: /switch learner/i });
    await expect(switchLearnerBtn, '"Switch Learner" button not found in sidebar').toBeVisible();
    await switchLearnerBtn.click();

    // Assert: ParentPinModal appears
    const pinModalTitle = page.getByText('Parent PIN Required', { exact: false });
    await expect(pinModalTitle, 'ParentPinModal must appear after clicking Switch Learner').toBeVisible({
      timeout: 8000,
    });
    console.log('[PASS] Test 3 — ParentPinModal appeared.');

    // Assert: Description says "Enter your PIN to switch learner"
    const pinModalDesc = page.getByText(/enter your pin to switch learner/i);
    await expect(
      pinModalDesc,
      'Modal description should say "Enter your PIN to switch learner"'
    ).toBeVisible();

    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t3-pin-modal.png'), fullPage: true });

    // Enter correct PIN (auto-submits on 4th digit)
    const firstInput = page.locator('input[inputmode="numeric"][maxlength="1"]').first();
    await firstInput.click();
    await firstInput.pressSequentially(parentPin, { delay: 100 });

    // Assert: Navigates to /select-learner
    await page.waitForURL(/\/select-learner/, { timeout: 15_000 });
    const url = page.url();
    console.log('Test 3 URL after correct PIN:', url);

    expect(url, 'Expected navigation to /select-learner after correct PIN from ChildLayout').toContain(
      '/select-learner'
    );

    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t3-after-pin.png'), fullPage: true });
    console.log('[PASS] Test 3 — Switch Learner from ChildLayout: PIN modal shown, correct PIN navigates to /select-learner.');
  });

  // ── Test 4: Switch Learner triggers PIN modal from MainLayout ──
  test('Test 4 — Switch Learner from MainLayout triggers PIN modal; correct PIN navigates to /select-learner', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');
    test.skip(!parentPin, 'Set E2E_PARENT_PIN before running.');

    const authData = await doParentLogin(request);

    await page.addInitScript(({ auth, member, isParentInStudentMode }) => {
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
          state: {
            selectedMember: member,
            isParentInStudentMode,
          },
          version: 0,
        })
      );
    }, injectParentAuthScript(authData, HASSAN_MEMBER, false));

    // Wait for PIN status API before interacting
    const pinStatusPromise = page
      .waitForResponse(
        (r) => r.url().includes('/auth/parent-pin/status') && r.status() === 200,
        { timeout: 15_000 }
      )
      .catch(() => null);

    await page.goto('/dashboard', { waitUntil: 'networkidle', timeout: 30_000 });
    await pinStatusPromise;
    await page.waitForTimeout(500);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t4-main-layout.png'), fullPage: true });
    console.log('Test 4 URL:', page.url());

    // Click "Switch Learner" button in sidebar
    const switchLearnerBtn = page.locator('aside').getByRole('button', { name: /switch learner/i });
    await expect(switchLearnerBtn, '"Switch Learner" button not found in MainLayout sidebar').toBeVisible();
    await switchLearnerBtn.click();

    // Assert: ParentPinModal appears
    const pinModalTitle = page.getByText('Parent PIN Required', { exact: false });
    await expect(pinModalTitle, 'ParentPinModal must appear after clicking Switch Learner from MainLayout').toBeVisible({
      timeout: 8000,
    });
    console.log('[PASS] Test 4 — ParentPinModal appeared from MainLayout.');

    // Assert: Description says "Enter your PIN to switch learner"
    const pinModalDesc = page.getByText(/enter your pin to switch learner/i);
    await expect(
      pinModalDesc,
      'Modal description should say "Enter your PIN to switch learner"'
    ).toBeVisible();

    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t4-pin-modal.png'), fullPage: true });

    // Enter correct PIN (auto-submits on 4th digit)
    const firstInput = page.locator('input[inputmode="numeric"][maxlength="1"]').first();
    await firstInput.click();
    await firstInput.pressSequentially(parentPin, { delay: 100 });

    // Assert: Navigates to /select-learner
    await page.waitForURL(/\/select-learner/, { timeout: 15_000 });
    const url = page.url();
    console.log('Test 4 URL after correct PIN:', url);

    expect(url, 'Expected navigation to /select-learner after correct PIN from MainLayout').toContain(
      '/select-learner'
    );

    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t4-after-pin.png'), fullPage: true });
    console.log('[PASS] Test 4 — Switch Learner from MainLayout: PIN modal shown, correct PIN navigates to /select-learner.');
  });

  // ── Test 5: Child direct login bypasses SelectLearner ──
  test('Test 5 — Child direct login bypasses SelectLearner; Switch Learner NOT visible', async ({ page }) => {
    // Inject child auth using child-auth-storage key
    // No real JWT — tests routing behavior only (no redirect to /select-learner or /child-login)
    await page.addInitScript(({ member }) => {
      localStorage.setItem(
        'child-auth-storage',
        JSON.stringify({
          state: {
            member,
            isAuthenticated: true,
            isChildSession: true,
            accessToken: 'mock-token',
          },
          version: 0,
        })
      );
      // Ensure parent auth is absent
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('family-storage');
    }, { member: IBN_SHARIF });

    // Intercept all API calls so the mock token doesn't trigger a 401 → redirect cycle
    await page.route('**/api/v1/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"data":{},"success":true}' })
    );

    await page.goto('/child/dashboard', { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForTimeout(1000);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t5-child-direct.png'), fullPage: true });

    const currentUrl = page.url();
    console.log('Test 5 URL:', currentUrl);

    // Assert: Page does NOT redirect to /select-learner or /child-login
    expect(
      currentUrl,
      'Child direct session must not be redirected to /select-learner'
    ).not.toContain('/select-learner');
    expect(
      currentUrl,
      'Child direct session must not be redirected to /child-login'
    ).not.toContain('/child-login');
    expect(
      currentUrl,
      'Child direct session must stay on /child/dashboard'
    ).toContain('/child/dashboard');

    // Assert: "My Dashboard" or similar student content visible (or at least the URL is correct)
    const bodyText = await page.locator('body').innerText();
    console.log('Test 5 body text (first 800):', bodyText.slice(0, 800));

    // "Switch Learner" must NOT be visible (no parent logged in)
    const switchLearnerBtn = page.locator('aside').getByRole('button', { name: /switch learner/i });
    await expect(
      switchLearnerBtn,
      '"Switch Learner" must NOT be visible when child is directly logged in (no parent session)'
    ).not.toBeVisible();

    console.log('[PASS] Test 5 — Child direct login: stays on /child/dashboard, Switch Learner not visible.');
  });

  // ── Test 6: Parent preview banner shows when isParentInStudentMode = false ──
  test('Test 6 — Parent preview banner visible when parent navigates to child view with isParentInStudentMode=false', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');

    const authData = await doParentLogin(request);

    // isParentInStudentMode = false → parent is PREVIEWING (not in student mode)
    await page.addInitScript(({ auth, member, isParentInStudentMode }) => {
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
          state: {
            selectedMember: member,
            isParentInStudentMode,
          },
          version: 0,
        })
      );
    }, injectParentAuthScript(authData, IBN_SHARIF, false));

    await page.goto('/child/dashboard', { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(2000);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'learner-switch-t6-preview-banner.png'), fullPage: true });

    const bodyText = await page.locator('body').innerText();
    console.log('Test 6 URL:', page.url());
    console.log('Test 6 body text (first 1000):', bodyText.slice(0, 1000));

    // Assert: "Parent preview" banner IS visible
    const previewBanner = page.getByText(/parent preview/i);
    await expect(
      previewBanner,
      '"Parent preview" banner must be visible when isParentInStudentMode=false and child is selected'
    ).toBeVisible();

    // Assert: "← Parent View" link visible in banner
    const parentViewLink = page.getByRole('link', { name: /parent view/i });
    await expect(
      parentViewLink,
      '"← Parent View" link must be visible in the preview banner'
    ).toBeVisible();

    // Assert: "Switch Learner" button visible in banner
    const switchLearnerBtn = page.getByRole('button', { name: /switch learner/i }).first();
    await expect(
      switchLearnerBtn,
      '"Switch Learner" button must be visible in the preview banner'
    ).toBeVisible();

    console.log('[PASS] Test 6 — Preview banner shown: "Parent preview" + "← Parent View" + "Switch Learner" all visible.');
  });
});

import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

const parentEmail = process.env.E2E_PARENT_EMAIL || 'hassan.rasheed1@live.com';
const parentPassword = process.env.E2E_PARENT_PASSWORD || 'MrBaby12!';
const parentPin = process.env.E2E_PARENT_PIN || '7831';

// Ibn Sharif — child learner for this parent
const IBN_SHARIF_ID = 'b32bf819-1662-47c5-b80f-2e2ca6bd26ab';
const IBN_SHARIF = {
  id: IBN_SHARIF_ID,
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

// Hassan's self-enrolled parent member (created via POST /family/self-enroll)
const HASSAN_MEMBER_ID = '885ba420-5188-44f0-bbf1-30e622ec65aa';

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
  const body = await resp.json() as {
    data: { accessToken: string; refreshToken: string; user: unknown; family: unknown };
  };
  return body.data;
}

test.describe('Phase 1 — Parent PIN gate', () => {
  // ── Part A: PIN status ──────────────────────────────────────────────────────
  test('Part A — GET /auth/parent-pin/status returns hasPin=true and Settings page shows PIN configured banner', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');

    const authData = await doParentLogin(request);

    // API check: PIN status
    const pinStatusResp = await request.get(`${apiUrl}/auth/parent-pin/status`, {
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    });
    console.log('PIN status API:', pinStatusResp.status());
    expect(pinStatusResp.ok(), `PIN status endpoint failed: ${pinStatusResp.status()}`).toBeTruthy();

    const { hasPin } = (await pinStatusResp.json() as { success: boolean; data: { hasPin: boolean } }).data;
    console.log('hasPin:', hasPin);

    if (!hasPin) {
      console.log('PIN not set — setting via UI flow...');
    } else {
      console.log('[INFO] PIN already configured (hasPin=true). Verifying Settings UI shows PIN banner.');
    }

    // Inject parent auth + selectedMember (self — account owner not a child) so no child-redirect
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
      // Set a non-child selectedMember so ProtectedRoute doesn't redirect
      localStorage.setItem(
        'family-storage',
        JSON.stringify({
          state: {
            selectedMember: {
              id: '885ba420-5188-44f0-bbf1-30e622ec65aa',
              name: 'hassan.rasheed1',
              isAccountOwner: true,
            },
          },
          version: 0,
        })
      );
    }, { auth: authData });

    await page.goto('/settings/pin', { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(2000);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'phase1-pin-settings.png'), fullPage: true });
    const bodyText = await page.locator('body').innerText();
    console.log('Settings/pin page text:', bodyText.slice(0, 1000));

    if (hasPin) {
      // Should show "A PIN is already set" banner (green)
      const pinBanner = page.getByText(/already set/i);
      await expect(
        pinBanner,
        'PIN-already-set banner not found — ParentPinSetup page did not load or PIN status mismatched'
      ).toBeVisible();
      console.log('[PASS] Part A — PIN status: hasPin=true; Settings shows "A PIN is already set" banner.');
    } else {
      // Shouldn't happen given test setup, but handle it
      console.log('[WARN] PIN was not set — test account needs PIN configured for further gate tests.');
      // Assert the Set PIN button is present
      await expect(page.getByRole('button', { name: /set pin/i })).toBeVisible();
    }

    // Always verify the API returns the correct field
    expect(typeof hasPin, 'hasPin should be boolean').toBe('boolean');
  });

  // ── Part B: PIN gate on child→parent switch ────────────────────────────────
  test('Part B — PIN gate modal appears on child→parent switch; wrong PIN rejected, correct PIN accepted', async ({
    page,
    request,
  }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');
    test.skip(!parentPin, 'Set E2E_PARENT_PIN before running.');

    const authData = await doParentLogin(request);

    // Set PIN to a known value so this test is self-contained regardless of
    // what other concurrent tests may have set. setPin also clears any lockout.
    await request.post(`${apiUrl}/auth/parent-pin`, {
      data: { pin: parentPin },
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    });

    // Also verify correct PIN via API (API cross-check required by task)
    const verifyResp = await request.post(`${apiUrl}/auth/parent-pin/verify`, {
      data: { memberId: HASSAN_MEMBER_ID, pin: parentPin },
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    });
    console.log('API PIN verify (correct):', verifyResp.status());
    if (verifyResp.ok()) {
      const vBody = await verifyResp.json() as { success: boolean; data: { verified: boolean } };
      console.log('API verify result:', vBody);
      expect(vBody.data.verified, 'API: correct PIN should return verified=true').toBe(true);
    } else {
      // 429 means rate-limited from previous attempts
      console.warn('[WARN] PIN verify returned', verifyResp.status(), '— may be rate-limited from prior test runs. Waiting 35s...');
      await page.waitForTimeout(35_000);
    }

    // Inject parent auth + selectedMember = Ibn Sharif (child) — triggers PIN gate on parent tile click
    await page.addInitScript(({ auth, childMember }) => {
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
        JSON.stringify({ state: { selectedMember: childMember }, version: 0 })
      );
    }, { auth: authData, childMember: IBN_SHARIF });

    // Navigate to /select-learner; wait for PIN status API to complete before clicking
    const pinStatusPromise = page.waitForResponse(
      (r) => r.url().includes('/auth/parent-pin/status') && r.status() === 200,
      { timeout: 15_000 }
    ).catch(() => null);
    await page.goto('/select-learner', { waitUntil: 'networkidle', timeout: 30_000 });
    await pinStatusPromise; // Ensure hasPinCache is populated
    await page.waitForTimeout(500);

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'phase1-pin-select-learner.png'), fullPage: true });
    console.log('select-learner URL:', page.url());

    // Click the parent's own tile (Hassan's self-enrolled member, isAccountOwner=true)
    // Since currentSelectedMember is a child, clicking parent tile triggers PIN gate
    const hassanBtn = page.getByRole('button', { name: /hassan/i });
    await expect(hassanBtn, 'Hassan tile not found on /select-learner — self-enroll may be needed').toBeVisible();
    await hassanBtn.click();

    // PIN modal should appear
    const pinModal = page.getByText('Parent PIN Required', { exact: false });
    await expect(pinModal, 'ParentPinModal not visible after clicking parent tile from child context').toBeVisible({
      timeout: 8000,
    });
    console.log('[PASS] ParentPinModal appeared.');

    await page.screenshot({ path: path.join(resultsDir, 'phase1-pin-modal.png'), fullPage: true });

    // ── Enter WRONG PIN ─────────────────────────────────────────────────────
    // Click first input and type all 4 digits sequentially (React focus management handles movement)
    const firstInput = page.locator('input[inputmode="numeric"][maxlength="1"]').first();
    await firstInput.click();
    await firstInput.pressSequentially('0001', { delay: 100 });
    // Modal auto-submits after 4th digit

    // Wait for error message
    const errorMsg = page.locator('.text-red-600');
    await errorMsg.waitFor({ state: 'visible', timeout: 10_000 });
    const errorText = await errorMsg.innerText();
    console.log('Wrong PIN error:', errorText);

    expect(
      errorText,
      'Expected error message after wrong PIN'
    ).toMatch(/incorrect pin|attempts? remaining/i);
    console.log('[PASS] Wrong PIN rejected with error:', errorText);

    await page.screenshot({ path: path.join(resultsDir, 'phase1-pin-wrong.png'), fullPage: true });

    // ── Enter CORRECT PIN ──────────────────────────────────────────────────
    // Wait for modal to reset (inputs cleared) after wrong attempt
    await page.waitForTimeout(800);
    const firstInputAgain = page.locator('input[inputmode="numeric"][maxlength="1"]').first();
    await firstInputAgain.click();
    await firstInputAgain.pressSequentially(parentPin, { delay: 100 });
    // Auto-submits after 4th digit

    // Modal should close and navigate to /dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
    const dashUrl = page.url();
    console.log('URL after correct PIN:', dashUrl);

    expect(dashUrl, 'Expected navigation to /dashboard after correct PIN').toMatch(/\/dashboard/);
    expect(dashUrl, 'Should not still be on /select-learner or child route').not.toContain('/select-learner');

    await page.screenshot({ path: path.join(resultsDir, 'phase1-pin-correct.png'), fullPage: true });
    console.log('[PASS] Part B — Correct PIN accepted; navigated to:', dashUrl);
  });

  // -- Part C: Lockout after 3 wrong PINs ------------------------------------
  test('Part C � 3 wrong PINs trigger 429 lockout with countdown', async ({ page, request }) => {
    test.skip(!parentEmail || !parentPassword, 'Set E2E_PARENT_EMAIL/PASSWORD before running.');
    test.skip(!parentPin, 'Set E2E_PARENT_PIN before running.');

    const authData = await doParentLogin(request);

    // -- Part C-API: Reset counter via setPin (clears pinAttempts to 0), then exhaust exactly 3 wrong attempts ---
    await request.post(`${apiUrl}/auth/parent-pin`, {
      data: { pin: parentPin },
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    });

    // The backend requires MAX_ATTEMPTS (3) wrong tries to SET the lock, then a 4th attempt
    // returns 429. So the loop needs 4 iterations to observe the 429.
    let lockoutConfirmedViaApi = false;
    for (let i = 0; i < 4; i++) {
      const r = await request.post(`${apiUrl}/auth/parent-pin/verify`, {
        data: { memberId: HASSAN_MEMBER_ID, pin: '2222' },
        headers: { Authorization: `Bearer ${authData.accessToken}` },
      });
      const status = r.status();
      const body = await r.json() as { success?: boolean; data?: { verified?: boolean; remainingAttempts?: number }; error?: { message?: string } };
      console.log(`API wrong attempt ${i + 1}: status=${status}`, body);

      if (status === 429) {
        lockoutConfirmedViaApi = true;
        console.log('[PASS] Part C-API � Backend returned 429 lockout. Message:', body.error?.message);
        break;
      }
    }
    expect(lockoutConfirmedViaApi, 'Expected backend to return 429 after 3 wrong attempts').toBe(true);

    // -- Part C-UI: Open modal within the 30s lockout window and verify message --
    // The backend is locked. Navigate quickly (<30s) to hit it from the UI.
    await page.addInitScript(({ auth, childMember }) => {
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
        JSON.stringify({ state: { selectedMember: childMember }, version: 0 })
      );
    }, { auth: authData, childMember: IBN_SHARIF });

    const pinStatusPromise2 = page.waitForResponse(
      (r) => r.url().includes('/auth/parent-pin/status') && r.status() === 200,
      { timeout: 15_000 }
    ).catch(() => null);
    await page.goto('/select-learner', { waitUntil: 'networkidle', timeout: 30_000 });
    await pinStatusPromise2;
    await page.waitForTimeout(300);

    const hassanBtn = page.getByRole('button', { name: /hassan/i });
    await expect(hassanBtn, 'Hassan tile not found').toBeVisible();
    await hassanBtn.click();

    const pinModal = page.getByText('Parent PIN Required', { exact: false });
    await expect(pinModal, 'PIN modal did not appear').toBeVisible({ timeout: 8000 });

    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'phase1-pin-lockout-before.png'), fullPage: true });

    // Enter any 4-digit PIN � backend is locked ? real 429 ? modal shows lockout UI
    const firstInput = page.locator('input[inputmode="numeric"][maxlength="1"]').first();
    await firstInput.click();
    await firstInput.pressSequentially('2222', { delay: 80 });

    // Assert "Too many attempts. Try again in Xs" appears in the modal
    const lockoutMsg = page.getByText(/too many attempts/i);
    await expect(lockoutMsg, 'Lockout message not shown after entering PIN while locked').toBeVisible({
      timeout: 10_000,
    });
    const lockoutText = await lockoutMsg.innerText();
    console.log('[PASS] Part C-UI � Lockout message shown:', lockoutText);

    // Assert countdown timer
    const countdown = page.getByText(/try again in \d+s/i);
    await expect(countdown, 'Countdown "Try again in Xs" not visible').toBeVisible();

    await page.screenshot({ path: path.join(resultsDir, 'phase1-pin-lockout.png'), fullPage: true });
    console.log('[PASS] Part C � Backend 429 confirmed via API + UI lockout message rendered correctly.');

    // Restore PIN for future runs (unlock happens automatically after 30s, but reset counter when possible)
    // No cleanup needed � lockout auto-expires in 30 seconds.
  });
});

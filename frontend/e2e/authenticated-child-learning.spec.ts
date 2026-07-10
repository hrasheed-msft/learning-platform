import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

const childUsername = process.env.E2E_CHILD_USERNAME;
const childPassword = process.env.E2E_CHILD_PASSWORD;

test.describe('Child /child/maktab page — reproduction & diagnosis', () => {
  test('child can view /child/maktab and content is not empty', async ({ page, request }) => {
    test.skip(
      !childUsername || !childPassword,
      'Set E2E_CHILD_USERNAME and E2E_CHILD_PASSWORD before running authenticated child tests.'
    );

    // ── Step 1: Login via API ──────────────────────────────────────────────
    const loginResponse = await request.post(`${apiUrl}/auth/child-login`, {
      data: { username: childUsername, password: childPassword },
    });

    console.log('Child login status:', loginResponse.status());
    const loginBody = await loginResponse.json() as {
      success?: boolean;
      data?: {
        accessToken: string;
        refreshToken?: string;
        member: { id: string; name: string; ageCategory: string; avatarUrl: string | null };
        family: { id: string; name: string };
      };
      message?: string;
      error?: string;
    };
    console.log('Child login response body:', JSON.stringify(loginBody, null, 2));

    expect(loginResponse.ok(), `Child login failed: ${JSON.stringify(loginBody)}`).toBeTruthy();
    expect(loginBody.data?.accessToken, 'No accessToken in child login response').toBeTruthy();

    const { accessToken, member } = loginBody.data!;
    console.log('Logged in as member:', member.id, member.name);

    // ── Step 2: Probe enrollment API directly ─────────────────────────────
    const enrollmentsApiResponse = await request.get(
      `${apiUrl}/programs/enrollment/${member.id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const enrollmentsApiBody = await enrollmentsApiResponse.json() as unknown;
    console.log('Enrollment API status:', enrollmentsApiResponse.status());
    console.log('Enrollment API body:', JSON.stringify(enrollmentsApiBody, null, 2));

    const stageSummaryApiResponse = await request.get(
      `${apiUrl}/programs/enrollment/${member.id}/stage-summary`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const stageSummaryApiBody = await stageSummaryApiResponse.json() as unknown;
    console.log('Stage summary API status:', stageSummaryApiResponse.status());
    console.log('Stage summary API body:', JSON.stringify(stageSummaryApiBody, null, 2));

    // ── Step 3: Inject child auth into localStorage ───────────────────────
    await page.addInitScript(({ authData }) => {
      localStorage.setItem(
        'child-auth-storage',
        JSON.stringify({
          state: {
            member: authData.member,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken ?? null,
            isAuthenticated: true,
            isChildSession: true,
          },
          version: 0,
        })
      );
    }, {
      authData: {
        member,
        accessToken,
        refreshToken: loginBody.data!.refreshToken ?? null,
      },
    });

    // ── Step 4: Capture network responses on /child/maktab ───────────────
    const capturedNetworkCalls: Array<{
      url: string;
      status: number;
      body: string;
    }> = [];

    page.on('response', async (response) => {
      const url = response.url();
      if (
        url.includes('/programs') ||
        url.includes('/enrollment') ||
        url.includes('/maktab') ||
        url.includes('/lessons') ||
        url.includes('/content')
      ) {
        try {
          const body = await response.text();
          capturedNetworkCalls.push({ url, status: response.status(), body });
        } catch {
          capturedNetworkCalls.push({ url, status: response.status(), body: '<unreadable>' });
        }
      }
    });

    // ── Step 5: Navigate to /child/maktab ─────────────────────────────────
    await page.goto('/child/maktab', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait briefly for any deferred rendering
    await page.waitForTimeout(2000);

    // ── Step 6: Screenshot ────────────────────────────────────────────────
    const resultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    const screenshotPath = path.join(resultsDir, 'child-maktab-page.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to:', screenshotPath);

    // ── Step 7: Capture rendered HTML text ───────────────────────────────
    const bodyText = await page.locator('body').innerText();
    console.log('=== PAGE TEXT CONTENT ===');
    console.log(bodyText.slice(0, 3000));
    console.log('=========================');

    // ── Step 8: Log all captured network calls ────────────────────────────
    console.log('=== CAPTURED NETWORK CALLS ===');
    for (const call of capturedNetworkCalls) {
      console.log(`[${call.status}] ${call.url}`);
      console.log(call.body.slice(0, 1000));
    }
    console.log('==============================');

    // ── Step 9: Diagnose — find key elements ─────────────────────────────
    const currentUrl = page.url();
    console.log('Final URL after navigation:', currentUrl);

    // Did we get redirected away from /child/maktab?
    const wasRedirected = !currentUrl.includes('/child/maktab');
    console.log('Was redirected away from /child/maktab?', wasRedirected);

    // Check for "not enrolled" empty state
    const notEnrolledMsg = page.getByText("You haven't started yet!", { exact: false });
    const isNotEnrolledVisible = await notEnrolledMsg.isVisible().catch(() => false);
    console.log('Is "not enrolled" empty state visible?', isNotEnrolledVisible);

    // Check for grade dashboard header (enrolled state)
    const gradeDashboardHeader = page.locator('.bg-gradient-to-br').first();
    const isGradeDashboardVisible = await gradeDashboardHeader.isVisible().catch(() => false);
    console.log('Is grade dashboard (enrolled state) visible?', isGradeDashboardVisible);

    // Check for loading spinner still active
    const spinner = page.locator('.animate-pulse').first();
    const isSpinnerVisible = await spinner.isVisible().catch(() => false);
    console.log('Is loading spinner still visible (stuck loading)?', isSpinnerVisible);

    // Check for child-login redirect
    const isOnChildLogin = currentUrl.includes('/child-login');
    console.log('Was redirected to /child-login (auth failure)?', isOnChildLogin);

    // ── Assertions ────────────────────────────────────────────────────────
    // Confirm we're on the maktab page (not redirected)
    expect(wasRedirected, `Redirected away from /child/maktab to: ${currentUrl}`).toBe(false);

    // The page should show SOME meaningful content (either enrolled or empty state)
    const hasMeaningfulContent = isNotEnrolledVisible || isGradeDashboardVisible;
    expect(
      hasMeaningfulContent,
      [
        'No meaningful content rendered on /child/maktab.',
        `Enrollment API status: ${enrollmentsApiResponse.status()}`,
        `Stage summary API status: ${stageSummaryApiResponse.status()}`,
        `Network calls captured: ${capturedNetworkCalls.map((c) => `[${c.status}] ${c.url}`).join(', ')}`,
        `Page text (truncated): ${bodyText.slice(0, 500)}`,
      ].join('\n')
    ).toBe(true);
  });
});

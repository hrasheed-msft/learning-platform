import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

const childUsername = process.env.E2E_CHILD_USERNAME;
const childPassword = process.env.E2E_CHILD_PASSWORD;

test.describe('Child /child/maktab page — verification after backend+frontend fix', () => {
  test('child sees enrolled maktab content (stage name + courses visible)', async ({ page, request }) => {
    test.skip(
      !childUsername || !childPassword,
      'Set E2E_CHILD_USERNAME and E2E_CHILD_PASSWORD before running authenticated child tests.'
    );

    // ── Step 1: Child login via API ────────────────────────────────────────
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
    expect(loginResponse.ok(), `Child login failed: ${JSON.stringify(loginBody)}`).toBeTruthy();
    const { accessToken, member } = loginBody.data!;
    console.log('Logged in as member:', member.id, member.name);

    // ── Step 2: Assert stage-summary returns HTTP 200 (was 500 before fix) ─
    const stageSummaryApiResponse = await request.get(
      `${apiUrl}/programs/enrollment/${member.id}/stage-summary`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const stageSummaryApiBody = await stageSummaryApiResponse.json() as {
      success?: boolean;
      data?: {
        stageId?: string;
        stageName?: string;
        totalCourses?: number;
        completedCourses?: number;
        overallProgress?: number;
        subjectProgress?: Array<{ courseId: string; courseTitle: string; category: string }>;
      };
      error?: unknown;
    };
    console.log('Stage summary API status:', stageSummaryApiResponse.status());
    console.log('Stage summary API body:', JSON.stringify(stageSummaryApiBody, null, 2));

    // KEY ASSERTION: stage-summary must now return 200, not 500
    expect(
      stageSummaryApiResponse.status(),
      `stage-summary still returning non-200: ${JSON.stringify(stageSummaryApiBody)}`
    ).toBe(200);
    expect(stageSummaryApiBody.success).toBe(true);

    // ── Step 3: Inject child auth into localStorage ────────────────────────
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

    // ── Step 4: Capture relevant network calls on page load ────────────────
    const capturedNetworkCalls: Array<{ url: string; status: number; body: string }> = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('/programs') || url.includes('/enrollment')) {
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
    await page.waitForTimeout(2000);

    // ── Step 6: Screenshot ─────────────────────────────────────────────────
    const resultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
    const screenshotPath = path.join(resultsDir, 'child-maktab-verified.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to:', screenshotPath);

    // ── Step 7: Capture rendered text + network log ────────────────────────
    const bodyText = await page.locator('body').innerText();
    console.log('=== PAGE TEXT CONTENT ===');
    console.log(bodyText.slice(0, 3000));
    console.log('=========================');
    console.log('=== NETWORK CALLS ===');
    for (const c of capturedNetworkCalls) {
      console.log(`[${c.status}] ${c.url}`);
      console.log(c.body.slice(0, 800));
    }
    console.log('=====================');

    const currentUrl = page.url();
    console.log('Final URL:', currentUrl);

    // ── Step 8: Verify the fix — no redirect, no blank page ───────────────
    expect(
      currentUrl.includes('/child/maktab'),
      `Redirected away to: ${currentUrl}`
    ).toBe(true);

    // Should NOT show "not enrolled" empty state (child IS enrolled)
    const notEnrolledMsg = page.getByText("You haven't started yet!", { exact: false });
    await expect(notEnrolledMsg, 'Unexpected "not enrolled" state — enrollment data not loaded').not.toBeVisible();

    // Should NOT be a completely blank body
    expect(bodyText.trim().length, 'Page body is empty — React crashed or nothing rendered').toBeGreaterThan(10);

    // ── Step 9: Assert enrolled content is visible ─────────────────────────
    // Expect the green gradient header card (only shown when enrollment is found)
    const gradientHeader = page.locator('.bg-gradient-to-br').first();
    await expect(
      gradientHeader,
      'Enrolled stage header card not visible — dashboard still not rendering'
    ).toBeVisible();

    // Expect "Foundation 1" stage name (the enrolled stage for this child)
    const stageNameEl = page.getByRole('heading', { name: 'Foundation 1', exact: true });
    await expect(
      stageNameEl,
      '"Foundation 1" stage name not found on page — stage data not rendered'
    ).toBeVisible();

    // Expect "Your Subjects" heading (shown when enrolled and content loaded)
    const subjectsHeading = page.getByText('Your Subjects', { exact: false });
    await expect(
      subjectsHeading,
      '"Your Subjects" section heading not visible — subject grid not rendered'
    ).toBeVisible();

    // Expect at least one subject/course card to be rendered
    const subjectCards = page.locator('button[aria-label*="% complete"]');
    const cardCount = await subjectCards.count();
    console.log('Subject cards visible:', cardCount);
    expect(cardCount, 'No subject cards rendered — subjectProgress array is empty or missing').toBeGreaterThan(0);

    // Log the visible course titles for the record
    const allTitles = await page.locator('button[aria-label*="% complete"]').evaluateAll(
      (els) => els.map((el) => el.getAttribute('aria-label') ?? '')
    );
    console.log('Rendered subject cards:', allTitles);
  });
});


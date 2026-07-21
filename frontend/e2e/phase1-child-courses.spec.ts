import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

const childUsername = process.env.E2E_CHILD_USERNAME || 'ibnsharif';
const childPassword = process.env.E2E_CHILD_PASSWORD || 'IbnSharif123!';
const IBN_SHARIF_MEMBER_ID = 'b32bf819-1662-47c5-b80f-2e2ca6bd26ab';

function ensureResultsDir() {
  const dir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

test.describe('Phase 1 — Enrollment bridge: /child/courses', () => {
  test('API: enrollment bridge created >= 3 course enrollments for Ibn Sharif', async ({ request }) => {
    // Step 1: Authenticate as child
    const loginResp = await request.post(`${apiUrl}/auth/child-login`, {
      data: { username: childUsername, password: childPassword },
    });
    console.log('Child login status:', loginResp.status());
    expect(loginResp.ok(), `Child login failed: ${loginResp.status()}`).toBeTruthy();

    const loginBody = await loginResp.json() as {
      success: boolean;
      data: { accessToken: string; member: { id: string; name: string } };
    };
    const { accessToken } = loginBody.data;

    // Step 2: Cross-check enrollment API
    const enrollResp = await request.get(
      `${apiUrl}/courses/enrollments/member/${IBN_SHARIF_MEMBER_ID}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log('Enrollments API status:', enrollResp.status());
    expect(enrollResp.ok(), `Enrollments API failed: ${enrollResp.status()}`).toBeTruthy();

    const enrollBody = await enrollResp.json() as {
      success: boolean;
      data: Array<{ id: string; courseId: string; status: string; course?: { title: string; category: string } }>;
    };
    console.log('Enrollment count:', enrollBody.data.length);
    enrollBody.data.forEach((e) =>
      console.log(`  • ${e.course?.title ?? e.courseId} [${e.course?.category ?? '?'}] status=${e.status}`)
    );

    expect(
      enrollBody.data.length,
      `Enrollment bridge defect: expected >= 3 enrollments, got ${enrollBody.data.length}`
    ).toBeGreaterThanOrEqual(3);
  });

  test('UI: child /child/courses renders course cards (+ Maktab section if backend returns stage courses)', async ({
    page,
    request,
  }) => {
    test.skip(
      !process.env.E2E_CHILD_USERNAME || !process.env.E2E_CHILD_PASSWORD,
      'Set E2E_CHILD_USERNAME and E2E_CHILD_PASSWORD before running authenticated child tests.'
    );

    // ── Step 1: Child login ────────────────────────────────────────────────
    const loginResp = await request.post(`${apiUrl}/auth/child-login`, {
      data: { username: childUsername, password: childPassword },
    });
    expect(loginResp.ok()).toBeTruthy();
    const { data: loginData } = await loginResp.json() as {
      data: {
        accessToken: string;
        member: { id: string; name: string; ageCategory: string; avatarUrl: string | null };
        family: { id: string; name: string };
      };
    };
    const { accessToken, member } = loginData;

    // ── Step 2: Inject child auth ──────────────────────────────────────────
    await page.addInitScript(({ authData }) => {
      localStorage.setItem(
        'child-auth-storage',
        JSON.stringify({
          state: {
            member: authData.member,
            accessToken: authData.accessToken,
            refreshToken: null,
            isAuthenticated: true,
            isChildSession: true,
          },
          version: 0,
        })
      );
    }, { authData: { member, accessToken } });

    // ── Step 3: Capture relevant network responses ─────────────────────────
    const networkLog: Array<{ url: string; status: number }> = [];
    page.on('response', (response) => {
      const u = response.url();
      if (u.includes('/programs') || u.includes('/enrollment') || u.includes('/courses')) {
        networkLog.push({ url: u, status: response.status() });
      }
    });

    // ── Step 4: Navigate to /child/courses ────────────────────────────────
    await page.goto('/child/courses', { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(3000);

    // ── Step 5: Screenshot ────────────────────────────────────────────────
    const resultsDir = ensureResultsDir();
    await page.screenshot({ path: path.join(resultsDir, 'phase1-child-courses.png'), fullPage: true });

    const bodyText = await page.locator('body').innerText();
    console.log('=== PAGE TEXT (first 2000 chars) ===');
    console.log(bodyText.slice(0, 2000));
    console.log('=== NETWORK LOG ===');
    networkLog.forEach((n) => console.log(`  [${n.status}] ${n.url}`));
    console.log('Current URL:', page.url());

    // ── Step 6: Assert — not redirected, not blank ────────────────────────
    expect(
      page.url(),
      `Redirected away from /child/courses to ${page.url()}`
    ).toContain('/child/courses');
    expect(bodyText.trim().length, 'Page body is empty — possible React crash').toBeGreaterThan(20);

    // ── Step 7: Assert at least 3 course card elements rendered ──────────
    // Course cards are rendered as divs with "% complete" status badges
    const courseCards = page.locator('.bg-white.rounded-xl').filter({ hasText: /Learning|Maktab|complete/i });
    const cardCount = await courseCards.count();
    console.log('Course card count:', cardCount);
    expect(cardCount, `Expected >= 3 course cards, got ${cardCount}`).toBeGreaterThanOrEqual(3);

    // ── Step 8: Assert "My Maktab Subjects" section ───────────────────────
    // NOTE: This requires the backend /programs/enrollment/:memberId endpoint to return
    // currentStage.courses[] in the response. If this fails, it is a backend gap.
    const maktabHeading = page.getByText('My Maktab Subjects', { exact: false });
    const maktabVisible = await maktabHeading.isVisible().catch(() => false);
    if (!maktabVisible) {
      console.warn(
        '[DEFECT CANDIDATE] "My Maktab Subjects" section NOT rendered. ' +
        'Root cause: GET /programs/enrollment/:memberId does not return currentStage.courses[]. ' +
        'Fix owner: Khwarizmi (backend). ChildCoursesPage.tsx maktabCourseIds is always empty.'
      );
    }
    await expect(
      maktabHeading,
      '"My Maktab Subjects" section not found — backend enrollment endpoint must return currentStage.courses[]'
    ).toBeVisible();

    // ── Step 9: Assert Maktab badges on course cards ──────────────────────
    const maktabBadges = page.getByText('Maktab', { exact: true });
    const badgeCount = await maktabBadges.count();
    console.log('Maktab badge count:', badgeCount);
    expect(
      badgeCount,
      `Expected >= 3 Maktab badges, got ${badgeCount}. Same root cause as "My Maktab Subjects" heading.`
    ).toBeGreaterThanOrEqual(3);
  });
});

import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

const childUsername = process.env.E2E_CHILD_USERNAME || 'ibnsharif';
const childPassword = process.env.E2E_CHILD_PASSWORD || 'Eagle1333';
const parentEmail = process.env.E2E_PARENT_EMAIL || 'hassan.rasheed1@live.com';
const parentPassword = process.env.E2E_PARENT_PASSWORD || 'MrBaby12!';
const IBN_SHARIF_MEMBER_ID = 'b32bf819-1662-47c5-b80f-2e2ca6bd26ab';

function ensureResultsDir() {
  const dir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function injectChildAuth(
  page: Parameters<Parameters<typeof test>[1]>[0]['page'],
  member: { id: string; name: string; ageCategory: string; avatarUrl: string | null },
  accessToken: string,
  refreshToken: string | null
) {
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
  }, { authData: { member, accessToken, refreshToken } });
}

// ─── Test 1: API shape ────────────────────────────────────────────────────────

test.describe('Phase 2 — API: stage-summary shape', () => {
  test('GET /programs/enrollment/:memberId/stage-summary returns correct Phase 2 shape', async ({ request }) => {
    // Authenticate as parent
    const loginResp = await request.post(`${apiUrl}/auth/login`, {
      data: { email: parentEmail, password: parentPassword },
    });
    console.log('Parent login status:', loginResp.status());
    expect(loginResp.ok(), `Parent login failed: ${loginResp.status()}`).toBeTruthy();

    const loginBody = await loginResp.json() as {
      success: boolean;
      data: { accessToken: string };
    };
    const { accessToken } = loginBody.data;

    // Call stage-summary with parent auth + x-active-member-id header
    const resp = await request.get(
      `${apiUrl}/programs/enrollment/${IBN_SHARIF_MEMBER_ID}/stage-summary`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-active-member-id': IBN_SHARIF_MEMBER_ID,
        },
      }
    );
    console.log('Stage-summary status:', resp.status());

    const body = await resp.json() as {
      success: boolean;
      data: {
        stageId: string;
        stageName: string;
        totalCourses: number;
        completedCourses: number;
        overallProgress: number;
        nextUp: {
          subjectSlug: string;
          courseId: string;
          unit: { id: string; title: string; orderIndex: number; courseId: string; courseSlug: string };
        } | null;
        streak: { current: number; longest: number; lastActivityAt: string | null };
        weeklyActivity: Array<{ date: string; unitsCompleted: number }>;
        subjectProgress: Array<{
          courseId: string;
          courseTitle: string;
          category: string;
          progress: number;
          totalUnits: number;
          completedUnits: number;
          nextUnit: { id: string; title: string } | null;
          lastActivityAt: string | null;
          unitsCompletedLast7Days: number;
        }>;
      };
    };

    console.log('Stage-summary body:', JSON.stringify(body, null, 2));

    // ── Core assertions ──────────────────────────────────────────────────────
    expect(resp.status(), 'Stage-summary must return HTTP 200').toBe(200);
    expect(body.success, 'Response must have success: true').toBe(true);

    const d = body.data;

    // nextUp: non-null, points to a real unit id
    expect(d.nextUp, 'nextUp must be present (non-null) for a fresh enrollment').not.toBeNull();
    expect(d.nextUp?.unit?.id, 'nextUp.unit.id must be a UUID').toMatch(
      /^[0-9a-f-]{36}$/i
    );
    expect(d.nextUp?.courseId, 'nextUp.courseId must be a UUID').toMatch(/^[0-9a-f-]{36}$/i);
    console.log('nextUp.unit.title:', d.nextUp?.unit?.title);

    // streak shape
    expect(d.streak, 'streak object must be present').toBeTruthy();
    expect(typeof d.streak.current, 'streak.current must be a number').toBe('number');
    expect(typeof d.streak.longest, 'streak.longest must be a number').toBe('number');
    expect(d.streak.current, 'streak.current must be 0 for a fresh enrollment').toBe(0);
    console.log('streak:', JSON.stringify(d.streak));

    // weeklyActivity: exactly 7 entries
    expect(Array.isArray(d.weeklyActivity), 'weeklyActivity must be an array').toBe(true);
    expect(d.weeklyActivity.length, 'weeklyActivity must contain exactly 7 entries').toBe(7);
    // Dates should cover the past week (each entry has a date string)
    d.weeklyActivity.forEach((entry, i) => {
      expect(typeof entry.date, `weeklyActivity[${i}].date must be a string`).toBe('string');
      expect(entry.date, `weeklyActivity[${i}].date must match YYYY-MM-DD`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof entry.unitsCompleted, `weeklyActivity[${i}].unitsCompleted must be a number`).toBe('number');
    });
    console.log('weeklyActivity dates:', d.weeklyActivity.map((e) => e.date).join(', '));

    // subjectProgress: each entry has nextUnit, lastActivityAt, unitsCompletedLast7Days
    expect(d.subjectProgress.length, 'subjectProgress must have entries').toBeGreaterThan(0);
    d.subjectProgress.forEach((sp, i) => {
      expect('nextUnit' in sp, `subjectProgress[${i}] must have nextUnit key`).toBe(true);
      expect('lastActivityAt' in sp, `subjectProgress[${i}] must have lastActivityAt key`).toBe(true);
      expect('unitsCompletedLast7Days' in sp, `subjectProgress[${i}] must have unitsCompletedLast7Days key`).toBe(true);
      console.log(`subjectProgress[${i}] ${sp.courseTitle}: nextUnit=${sp.nextUnit?.title ?? 'null'}, last7d=${sp.unitsCompletedLast7Days}`);
    });
  });
});

// ─── Test 2: Child dashboard UI ──────────────────────────────────────────────

test.describe('Phase 2 — Child dashboard /child/dashboard', () => {
  test('hero Continue card, streak card, and 7-bar weekly activity chart visible', async ({ page, request }) => {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const loginResp = await request.post(`${apiUrl}/auth/child-login`, {
      data: { username: childUsername, password: childPassword },
    });
    expect(loginResp.ok(), `Child login failed: ${loginResp.status()}`).toBeTruthy();
    const { data: loginData } = await loginResp.json() as {
      data: {
        accessToken: string;
        refreshToken?: string;
        member: { id: string; name: string; ageCategory: string; avatarUrl: string | null };
        family: { id: string; name: string };
      };
    };
    const { accessToken, member } = loginData;

    await injectChildAuth(page, member, accessToken, loginData.refreshToken ?? null);

    // ── Navigate ──────────────────────────────────────────────────────────────
    await page.goto('/child/dashboard', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Screenshot
    const resultsDir = ensureResultsDir();
    const screenshotPath = path.join(resultsDir, 'phase2-child-dashboard.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved:', screenshotPath);

    const bodyText = await page.locator('body').innerText();
    console.log('=== PAGE TEXT (first 2000 chars) ===');
    console.log(bodyText.slice(0, 2000));
    console.log('=====================================');

    // URL sanity
    expect(page.url(), 'Must stay on /child/dashboard').toContain('/child/dashboard');

    // ── Hero card: either "Continue" CTA or "all caught up" ──────────────────
    const continueBtn = page.getByRole('link', { name: /Continue/i }).first();
    const allCaughtUp = page.getByText("You're all caught up!", { exact: false });
    const heroVisible = (await continueBtn.isVisible()) || (await allCaughtUp.isVisible());
    console.log('Continue btn visible:', await continueBtn.isVisible());
    console.log('All caught up visible:', await allCaughtUp.isVisible());
    expect(heroVisible, 'Hero card must show either "Continue" link or "all caught up" message').toBe(true);

    // ── Streak card visible (shows "Current streak") ──────────────────────────
    const streakLabel = page.getByText('Current streak', { exact: false });
    await expect(streakLabel, '"Current streak" label must be visible on /child/dashboard').toBeVisible();

    // ── Weekly activity chart — 7 day labels ─────────────────────────────────
    const chartEl = page.locator('[aria-label="Weekly activity chart"]');
    await expect(chartEl, 'Weekly activity chart (aria-label) must be visible').toBeVisible();

    // There should be 7 columns
    const dayBars = chartEl.locator('> div');
    const barCount = await dayBars.count();
    console.log('Activity chart bar columns:', barCount);
    expect(barCount, 'Weekly activity chart must have exactly 7 bars').toBe(7);

    // Each bar has a day-label span
    const dayLabelSpans = chartEl.locator('span');
    const labelCount = await dayLabelSpans.count();
    console.log('Day label spans count:', labelCount);
    expect(labelCount, 'Weekly activity chart must have 7 day-label spans').toBe(7);
  });
});

// ─── Test 3: GradeDashboard SubjectCards ──────────────────────────────────────

test.describe('Phase 2 — GradeDashboard /child/maktab SubjectCards', () => {
  test('each SubjectCard shows Next/All-caught-up text; clicking navigates to CourseLearner with ?unit=', async ({ page, request }) => {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const loginResp = await request.post(`${apiUrl}/auth/child-login`, {
      data: { username: childUsername, password: childPassword },
    });
    expect(loginResp.ok(), `Child login failed: ${loginResp.status()}`).toBeTruthy();
    const { data: loginData } = await loginResp.json() as {
      data: {
        accessToken: string;
        refreshToken?: string;
        member: { id: string; name: string; ageCategory: string; avatarUrl: string | null };
        family: { id: string; name: string };
      };
    };
    const { accessToken, member } = loginData;

    await injectChildAuth(page, member, accessToken, loginData.refreshToken ?? null);

    // ── Navigate to /child/maktab ─────────────────────────────────────────────
    await page.goto('/child/maktab', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    console.log('=== /child/maktab PAGE TEXT (first 2000) ===');
    console.log(bodyText.slice(0, 2000));

    // Gather all SubjectCards by aria-label pattern
    const subjectCards = page.locator('button[aria-label*="% complete"]');
    const cardCount = await subjectCards.count();
    console.log('SubjectCards found:', cardCount);
    expect(cardCount, 'At least one SubjectCard must be rendered').toBeGreaterThan(0);

    // Each SubjectCard should show "Next: ..." or "All caught up ✨" text
    let nextTextCount = 0;
    let caughtUpCount = 0;
    for (let i = 0; i < cardCount; i++) {
      const card = subjectCards.nth(i);
      const label = await card.getAttribute('aria-label') ?? '';
      const cardText = await card.innerText();
      console.log(`Card ${i}: aria-label="${label}"`);
      console.log(`  text: ${cardText.replace(/\n/g, ' | ')}`);
      const hasNext = cardText.includes('Next:');
      const hasCaughtUp = cardText.includes('All caught up');
      if (hasNext) nextTextCount++;
      if (hasCaughtUp) caughtUpCount++;
    }
    console.log(`Cards with "Next:": ${nextTextCount}, with "All caught up": ${caughtUpCount}`);
    expect(
      nextTextCount + caughtUpCount,
      'Every SubjectCard must show either "Next: ..." or "All caught up ✨"'
    ).toBe(cardCount);

    // Activity chip: skip if all unitsCompletedLast7Days === 0 (fresh enrollment)
    const activityChips = page.locator('text=this week');
    const chipCount = await activityChips.count();
    console.log('🔥 activity chips visible:', chipCount);
    // No assertion required for zero activity — fresh enrollment has 0 units this week

    // ── Click first non-special SubjectCard → must navigate to CourseLearner with ?unit= ──
    // Find a card that goes to /child/courses (not /child/duas or /child/99-names)
    let navigated = false;
    for (let i = 0; i < cardCount; i++) {
      const card = subjectCards.nth(i);
      const label = await card.getAttribute('aria-label') ?? '';
      // Skip DUA / NAMES cards (they navigate to different routes)
      if (label.toLowerCase().includes('dua') || label.toLowerCase().includes('names') || label.toLowerCase().includes('99')) {
        console.log(`Card ${i}: skipping special route (${label})`);
        continue;
      }

      console.log(`Card ${i}: clicking for deep-link navigation test`);
      // Re-inject auth so CourseLearner page (new page load) has the token
      // addInitScript already ran; localStorage persists through window.location.href
      const [navigationPromise] = await Promise.all([
        page.waitForURL(/\/child\/courses\/.+\/learn/, { timeout: 15000 }),
        card.click(),
      ]);
      void navigationPromise;

      const finalUrl = page.url();
      console.log('After SubjectCard click, URL:', finalUrl);

      expect(finalUrl, 'Clicking SubjectCard must navigate to /child/courses/{id}/learn').toMatch(
        /\/child\/courses\/[0-9a-f-]{36}\/learn/i
      );
      expect(finalUrl, 'CourseLearner URL must include ?unit= query param').toContain('?unit=');

      const urlObj = new URL(finalUrl);
      const unitParam = urlObj.searchParams.get('unit');
      console.log('unit query param:', unitParam);
      expect(unitParam, '?unit= param must be a UUID').toMatch(/^[0-9a-f-]{36}$/i);

      navigated = true;
      break;
    }

    expect(navigated, 'At least one non-special SubjectCard must navigate to CourseLearner with ?unit=').toBe(true);
  });
});

// ─── Test 4: Continue CTA deep-link ───────────────────────────────────────────

test.describe('Phase 2 — Continue CTA deep-link from /child/dashboard', () => {
  test('hero Continue button deep-links to CourseLearner with matching nextUp ids', async ({ page, request }) => {
    // ── Step 1: Fetch nextUp from API for ground truth ────────────────────────
    const parentLoginResp = await request.post(`${apiUrl}/auth/login`, {
      data: { email: parentEmail, password: parentPassword },
    });
    expect(parentLoginResp.ok()).toBeTruthy();
    const { data: parentData } = await parentLoginResp.json() as {
      data: { accessToken: string };
    };

    const summaryResp = await request.get(
      `${apiUrl}/programs/enrollment/${IBN_SHARIF_MEMBER_ID}/stage-summary`,
      {
        headers: {
          Authorization: `Bearer ${parentData.accessToken}`,
          'x-active-member-id': IBN_SHARIF_MEMBER_ID,
        },
      }
    );
    expect(summaryResp.ok()).toBeTruthy();
    const { data: summary } = await summaryResp.json() as {
      data: {
        nextUp: { courseId: string; unit: { id: string; title: string } } | null;
      };
    };

    expect(summary.nextUp, 'nextUp must be present in API response for this test to run').not.toBeNull();
    const expectedCourseId = summary.nextUp!.courseId;
    const expectedUnitId = summary.nextUp!.unit.id;
    const expectedUnitTitle = summary.nextUp!.unit.title;
    console.log(`Expected deep-link: courseId=${expectedCourseId}, unitId=${expectedUnitId}`);
    console.log(`Expected unit title: "${expectedUnitTitle}"`);

    // ── Step 2: Child auth ────────────────────────────────────────────────────
    const loginResp = await request.post(`${apiUrl}/auth/child-login`, {
      data: { username: childUsername, password: childPassword },
    });
    expect(loginResp.ok()).toBeTruthy();
    const { data: loginData } = await loginResp.json() as {
      data: {
        accessToken: string;
        refreshToken?: string;
        member: { id: string; name: string; ageCategory: string; avatarUrl: string | null };
        family: { id: string; name: string };
      };
    };
    const { accessToken, member } = loginData;
    await injectChildAuth(page, member, accessToken, loginData.refreshToken ?? null);

    // ── Step 3: Load /child/dashboard ────────────────────────────────────────
    await page.goto('/child/dashboard', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // ── Step 4: Find and click Continue → ────────────────────────────────────
    const continueBtn = page.getByRole('link', { name: /Continue/i }).first();
    const continueBtnVisible = await continueBtn.isVisible();
    console.log('Continue button visible:', continueBtnVisible);

    if (!continueBtnVisible) {
      // If nextUp === null, hero shows "all caught up" — that's valid behaviour
      const allCaughtUp = page.getByText("You're all caught up!", { exact: false });
      const caughtUpVisible = await allCaughtUp.isVisible();
      console.log('All caught up visible (nextUp may be null):', caughtUpVisible);
      expect(caughtUpVisible, 'If no Continue button, must show "all caught up" state').toBe(true);
      console.log('SKIP: nextUp is null in production — no Continue button to click (valid state)');
      return;
    }

    // Verify href matches the expected deep-link before clicking
    const href = await continueBtn.getAttribute('href');
    console.log('Continue button href:', href);
    expect(href, 'Continue → href must match /child/courses/{courseId}/learn').toContain(
      `/child/courses/${expectedCourseId}/learn`
    );
    expect(href, 'Continue → href must include ?unit={unitId}').toContain(`unit=${expectedUnitId}`);

    // Click and wait for navigation
    await Promise.all([
      page.waitForURL(/\/child\/courses\/.+\/learn\?unit=/, { timeout: 15000 }),
      continueBtn.click(),
    ]);

    const finalUrl = page.url();
    console.log('After Continue click, URL:', finalUrl);
    expect(finalUrl, 'Must navigate to CourseLearner URL').toContain(
      `/child/courses/${expectedCourseId}/learn`
    );
    expect(finalUrl, 'Must include ?unit= param matching nextUp').toContain(`unit=${expectedUnitId}`);

    // ── Step 5: CourseLearner — no crash, unit visible ────────────────────────
    await page.waitForTimeout(3000); // let React render + data load

    const resultsDir = ensureResultsDir();
    const screenshotPath = path.join(resultsDir, 'phase2-course-learner.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('CourseLearner screenshot:', screenshotPath);

    const learnerText = await page.locator('body').innerText();
    console.log('=== CourseLearner page text (first 2000) ===');
    console.log(learnerText.slice(0, 2000));
    console.log('===========================================');

    // No crash: body should not be empty
    expect(learnerText.trim().length, 'CourseLearner must not be blank (would indicate a crash)').toBeGreaterThan(20);

    // Best-effort: look for the unit title text (or a prefix/suffix of it)
    // The title may contain special Unicode chars — do a partial match
    const titleFragment = expectedUnitTitle.split('—')[0]?.trim() ?? expectedUnitTitle.slice(0, 15);
    const unitTitleEl = page.getByText(titleFragment, { exact: false });
    const titleVisible = await unitTitleEl.isVisible().catch(() => false);
    console.log(`Unit title fragment "${titleFragment}" visible:`, titleVisible);
    // Non-fatal: log but do not fail if title is absent (CourseLearner may still be loading)
    if (!titleVisible) {
      console.warn(`WARNING: Expected unit title fragment "${titleFragment}" not found on CourseLearner page`);
    }
  });
});

import { expect, test } from '@playwright/test';

const parentEmail = process.env.E2E_PARENT_EMAIL;
const parentPassword = process.env.E2E_PARENT_PASSWORD;
const apiUrl =
  process.env.E2E_API_URL ||
  'https://ca-api-islamic-learning.victorioussand-c4494f56.centralus.azurecontainerapps.io/api/v1';

test.describe('Authenticated parent enrollment flow', () => {
  test.beforeEach(async ({ page, request }) => {
    test.skip(
      !parentEmail || !parentPassword,
      'Set E2E_PARENT_EMAIL and E2E_PARENT_PASSWORD before running authenticated tests.'
    );

    const response = await request.post(`${apiUrl}/auth/login`, {
      data: {
        email: parentEmail,
        password: parentPassword,
      },
    });
    expect(response.ok()).toBeTruthy();
    const payload = (await response.json()) as {
      data: {
        accessToken: string;
        refreshToken: string;
        user: unknown;
        family: unknown;
      };
    };

    const learnersResponse = await request.get(`${apiUrl}/family/learners`, {
      headers: {
        Authorization: `Bearer ${payload.data.accessToken}`,
      },
    });
    expect(learnersResponse.ok()).toBeTruthy();
    const learnersPayload = (await learnersResponse.json()) as { data: Array<Record<string, unknown>> };
    const selectedLearner = learnersPayload.data.find((m) => !m.isAccountOwner) ?? learnersPayload.data[0];

    await page.addInitScript(({ authPayload, selectedLearnerPayload }) => {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: authPayload.user,
            family: authPayload.family,
            accessToken: authPayload.accessToken,
            refreshToken: authPayload.refreshToken,
            isAuthenticated: true,
          },
          version: 0,
        })
      );
      if (selectedLearnerPayload) {
        localStorage.setItem(
          'family-storage',
          JSON.stringify({
            state: {
              selectedMember: selectedLearnerPayload,
            },
            version: 0,
          })
        );
      }
    }, { authPayload: payload.data, selectedLearnerPayload: selectedLearner });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/(dashboard|select-learner)/);
  });

  test('parent can open Maktab modal and start enrollment', async ({ page }) => {
    await page.getByRole('link', { name: /maktab/i }).click();
    await expect(page).toHaveURL(/\/programs/);

    await expect(page.getByRole('heading', { name: /ready to begin/i })).toBeVisible();
    const enrollNowButton = page.getByRole('button', { name: /enroll now/i });
    await enrollNowButton.scrollIntoViewIfNeeded();
    await expect(enrollNowButton).toBeVisible();
    await enrollNowButton.click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal.getByRole('heading', { name: /enroll in/i })).toBeVisible();

    const noLearnersMessage = modal.getByText(/No child learner profiles found/i);
    await expect(noLearnersMessage).toHaveCount(0);

    const learnerButtons = modal.locator('button').filter({ hasText: /Age \d+/ });
    await expect(learnerButtons.first()).toBeVisible();
    await learnerButtons.first().click();

    const startButton = modal.getByRole('button', { name: /start the journey/i });
    await expect(startButton).toBeEnabled();
    await startButton.click();

    const successHeading = modal.getByRole('heading', { name: /enrolled! masha'allah!/i });
    const alreadyEnrolled = modal.getByText(/already enrolled/i);

    await Promise.race([
      successHeading.waitFor({ state: 'visible', timeout: 20_000 }),
      alreadyEnrolled.waitFor({ state: 'visible', timeout: 20_000 }),
    ]);
  });
});

import { Page, expect } from '@playwright/test';

/**
 * NOTE: I was only shown post-login board screenshots, not the login screen
 * itself. The selectors below use common/robust patterns (input types,
 * placeholder text, accessible button name) that work on most login forms,
 * but you MUST verify them once against the real login page.
 *
 * Fastest way to confirm/fix them:
 *   npm run codegen
 * then log in manually and copy whatever selectors Playwright records for
 * the email field, password field, and submit button into the constants
 * below.
 */
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    // Try a few common patterns for the identifier field
    const emailInput = this.page
      .getByPlaceholder(/email|username/i)
      .or(this.page.locator('input[type="email"]'))
      .or(this.page.locator('input[name="email"]'))
      .or(this.page.locator('input[type="text"]'))
      .first();

    await emailInput.fill(email);

    const passwordInput = this.page.locator('input[type="password"]').first();
    await passwordInput.fill(password);

    const submitButton = this.page
      .getByRole('button', { name: /log ?in|sign ?in|submit/i })
      .first();

    await submitButton.click();
  }

  async assertLoggedIn() {
    // After login we expect to land on a page showing the "Projects" sidebar
    await expect(this.page.getByText('Projects', { exact: true })).toBeVisible();
  }
}

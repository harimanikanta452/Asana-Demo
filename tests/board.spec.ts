import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import testCases from '../data/testCases.json';

const CREDENTIALS = {
  email: 'admin',
  password: 'password123',
};

test.describe('Asana demo board — data-driven verification', () => {
  for (const tc of testCases) {
    test(`[${tc.id}] "${tc.task}" is in "${tc.column}" with tags [${tc.tags.join(', ')}] (${tc.project})`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const boardPage = new BoardPage(page);

      await test.step('Log in', async () => {
        await loginPage.goto();
        await loginPage.login(CREDENTIALS.email, CREDENTIALS.password);
        await loginPage.assertLoggedIn();
      });

      await test.step(`Navigate to "${tc.project}"`, async () => {
        await boardPage.openProject(tc.project);
      });

      await test.step(`Verify "${tc.task}" is in "${tc.column}"`, async () => {
        await boardPage.assertTaskInColumn(tc.column, tc.task);
      });

      await test.step(`Verify tags: ${tc.tags.join(', ')}`, async () => {
        await boardPage.assertTaskHasTags(tc.column, tc.task, tc.tags);
      });
    });
  }
});

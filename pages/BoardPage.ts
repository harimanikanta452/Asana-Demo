import { Page, Locator, expect } from '@playwright/test';

export class BoardPage {
  constructor(private page: Page) {}

  /** Click a project in the left sidebar (e.g. "Web Application"). */
  async openProject(projectName: string) {
    // Prefer a real link/button role if the sidebar item is one.
    const navItem = this.page
      .getByRole('link', { name: projectName, exact: true })
      .or(this.page.getByText(projectName, { exact: true }))
      .first();

    await navItem.click();

    // Confirm navigation landed on the right project. Scoped to the main
    // content banner because the sidebar nav item is ALSO an <h2> with the
    // same accessible name, which caused a strict-mode violation here.
    await expect(
      this.page.getByRole('banner').getByRole('heading', { name: projectName, exact: true })
    ).toBeVisible();
  }

  /**
   * Returns the locator for a column's container (e.g. "To Do", "In Progress").
   * The board renders each column heading as "To Do (2)" / "In Progress (1)" etc,
   * so we match on the leading text and ignore the count.
   *
   * ADJUSTABLE: if this over- or under-selects the column area on the real DOM,
   * change `xpath=..` to go up an extra level, e.g. `xpath=../..`.
   */
  private getColumn(columnName: string): Locator {
    const heading = this.page.getByText(new RegExp(`^${escapeRegex(columnName)}\\s*\\(\\d+\\)`));
    return heading.locator('xpath=..');
  }

  /**
   * Returns the locator for a specific task card within a given column.
   * ADJUSTABLE: if tag lookups inside the card fail, change the ancestor
   * level here too (card wrapper may be 1 or 2 divs up from the title text).
   */
  getTaskCard(columnName: string, taskTitle: string): Locator {
    const column = this.getColumn(columnName);
    return column.getByText(taskTitle, { exact: true }).locator('xpath=ancestor::div[1]');
  }

  async assertTaskInColumn(columnName: string, taskTitle: string) {
    const card = this.getTaskCard(columnName, taskTitle);
    await expect(card).toBeVisible();
  }

  async assertTaskHasTags(columnName: string, taskTitle: string, tags: string[]) {
    const card = this.getTaskCard(columnName, taskTitle);
    for (const tag of tags) {
      await expect(card.getByText(tag, { exact: true })).toBeVisible();
    }
  }
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

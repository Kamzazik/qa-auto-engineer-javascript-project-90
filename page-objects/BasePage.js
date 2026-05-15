export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async clickSidebarItem(name) {
    await this.page.getByRole('menuitem', { name }).click();
    await this.page.waitForTimeout(500);
  }
}
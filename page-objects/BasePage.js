export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async clickTab(tabName) {
    await this.page.getByTestId(`tab-${tabName}`).click();
  }
}
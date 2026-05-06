export class MainPage {
  constructor(page) {
    this.page = page;
    this.usernameDisplay = page.getByTestId('username-display');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async getUsernameText() {
    return await this.usernameDisplay.textContent();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
export class UsersPage {
  constructor(page) {
    this.page = page;
    this.tabUsers = page.getByTestId('tab-users');
    this.createUserButton = page.getByTestId('create-user-button');
    this.userForm = page.getByTestId('user-form');
    this.firstNameInput = page.getByTestId('user-firstname-input');
    this.lastNameInput = page.getByTestId('user-lastname-input');
    this.emailInput = page.getByTestId('user-email-input');
    this.emailError = page.getByTestId('email-error');
    this.saveUserButton = page.getByTestId('save-user-button');
    this.cancelUserButton = page.getByTestId('cancel-user-button');
    this.usersTable = page.getByTestId('users-table');
    this.selectAllCheckbox = page.getByTestId('select-all-checkbox');
    this.deleteSelectedButton = page.getByTestId('delete-selected-button');
  }

  async goToTab() {
    await this.tabUsers.click();
  }

  async openCreateForm() {
    await this.createUserButton.click();
  }

  async fillUserForm(firstName, lastName, email) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
  }

  async saveUser() {
    await this.saveUserButton.click();
  }

  async createUser(firstName, lastName, email) {
    await this.openCreateForm();
    await this.fillUserForm(firstName, lastName, email);
    await this.saveUser();
  }

  async editUser(userId, firstName, lastName, email) {
    await this.page.getByTestId(`edit-user-${userId}`).click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.saveUser();
  }

  async getUserInfo(userId) {
    return {
      firstName: await this.page.getByTestId(`user-firstname-${userId}`).textContent(),
      lastName: await this.page.getByTestId(`user-lastname-${userId}`).textContent(),
      email: await this.page.getByTestId(`user-email-${userId}`).textContent(),
    };
  }

  async selectUser(userId) {
    await this.page.getByTestId(`select-user-${userId}`).check();
  }

  async selectAllUsers() {
    await this.selectAllCheckbox.check();
  }

  async deleteSelected() {
    await this.deleteSelectedButton.click();
  }

  async isUserInTable(userId) {
    return await this.page.getByTestId(`user-row-${userId}`).isVisible();
  }
}
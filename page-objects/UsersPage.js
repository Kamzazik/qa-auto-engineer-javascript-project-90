import { BasePage } from './BasePage.js';

export class UsersPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('link', { name: 'Create' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goTo() {
    await this.clickSidebarItem('Users');
  }

  async openCreate() {
    await this.createButton.click();
  }

  async createUser(email, firstName, lastName) {
    await this.openCreate();
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }

    async openEdit(email) {
    await this.page.getByRole('cell', { name: email }).click();
  }

  async editUser(email, newFirstName) {
    await this.openEdit(email);
    await this.firstNameInput.fill(newFirstName);
    await this.saveButton.click();
  }

    async deleteUser(email) {
    await this.openEdit(email);
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }
}
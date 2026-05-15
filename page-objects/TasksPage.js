import { BasePage } from './BasePage.js';

export class TasksPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('link', { name: 'Create' });
    this.titleInput = page.getByRole('textbox', { name: 'Title' });
    this.contentInput = page.getByRole('textbox', { name: 'Content' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goTo() {
    await this.clickSidebarItem('Tasks');
  }

  async openCreate() {
    await this.createButton.click();
  }

  async createTask(title, content = '') {
    await this.openCreate();
    await this.titleInput.fill(title);
    if (content) await this.contentInput.fill(content);
    await this.saveButton.click();
  }

  async editTask(oldTitle, newTitle) {
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
    await this.titleInput.fill(newTitle);
    await this.saveButton.click();
  }

  async deleteTask(title) {
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }
}
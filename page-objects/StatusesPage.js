import { BasePage } from './BasePage.js';

export class StatusesPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('link', { name: 'Create' });
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.slugInput = page.getByRole('textbox', { name: 'Slug' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goTo() {
    await this.clickSidebarItem('Task statuses');
  }

  async openCreate() {
    await this.createButton.click();
  }

  async createStatus(name, slug) {
    await this.openCreate();
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
    await this.saveButton.click();
  }

  async openEdit(name) {
    await this.page.getByRole('cell', { name }).click();
  }

  async editStatus(oldName, newName, newSlug) {
    await this.openEdit(oldName);
    await this.nameInput.fill(newName);
    await this.slugInput.fill(newSlug);
    await this.saveButton.click();
  }

  async deleteStatus(name) {
    await this.openEdit(name);
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }
}
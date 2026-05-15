import { BasePage } from './BasePage.js';

export class LabelsPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('link', { name: 'Create' });
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goTo() {
    await this.clickSidebarItem('Labels');
  }

  async openCreate() {
    await this.createButton.click();
  }

  async createLabel(name) {
    await this.openCreate();
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }

  async openEdit(name) {
    await this.page.getByRole('cell', { name }).click();
  }

  async editLabel(oldName, newName) {
    await this.openEdit(oldName);
    await this.nameInput.fill(newName);
    await this.saveButton.click();
  }

  async deleteLabel(name) {
    await this.openEdit(name);
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }
}
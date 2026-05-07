import { BasePage } from './BasePage.js';

export class StatusesPage extends BasePage {
  constructor(page) {
    super(page);
    this.createStatusButton = page.getByTestId('create-status-button');
    this.statusForm = page.getByTestId('status-form');
    this.nameInput = page.getByTestId('status-name-input');
    this.slugInput = page.getByTestId('status-slug-input');
    this.saveButton = page.getByTestId('save-status-button');
    this.cancelButton = page.getByTestId('cancel-status-button');
    this.statusesTable = page.getByTestId('statuses-table');
    this.selectAllCheckbox = page.getByTestId('select-all-statuses-checkbox');
    this.deleteSelectedButton = page.getByTestId('delete-statuses-selected-button');
  }

  async goToTab() {
    await this.clickTab('statuses');
  }

  async openCreateForm() {
    await this.createStatusButton.click();
  }

  async fillForm(name, slug) {
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
  }

  async save() {
    await this.saveButton.click();
  }

  async createStatus(name, slug) {
    await this.openCreateForm();
    await this.fillForm(name, slug);
    await this.save();
  }

  async editStatus(id, name, slug) {
    await this.page.getByTestId(`edit-status-${id}`).click();
    await this.nameInput.fill(name);
    await this.slugInput.fill(slug);
    await this.save();
  }

  async selectStatus(id) {
    await this.page.getByTestId(`select-status-${id}`).check();
  }

  async selectAll() {
    await this.selectAllCheckbox.check();
  }

  async deleteSelected() {
    await this.deleteSelectedButton.click();
  }
}
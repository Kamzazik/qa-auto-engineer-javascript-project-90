import { BasePage } from './BasePage.js';

export class LabelsPage extends BasePage {
  constructor(page) {
    super(page);
    this.createLabelButton = page.getByTestId('create-label-button');
    this.labelForm = page.getByTestId('label-form');
    this.nameInput = page.getByTestId('label-name-input');
    this.saveButton = page.getByTestId('save-label-button');
    this.cancelButton = page.getByTestId('cancel-label-button');
    this.labelsTable = page.getByTestId('labels-table');
    this.selectAllCheckbox = page.getByTestId('select-all-labels-checkbox');
    this.deleteSelectedButton = page.getByTestId('delete-labels-selected-button');
  }

  async goToTab() {
    await this.clickTab('labels');
  }

  async openCreateForm() {
    await this.createLabelButton.click();
  }

  async fillForm(name) {
    await this.nameInput.fill(name);
  }

  async save() {
    await this.saveButton.click();
  }

  async createLabel(name) {
    await this.openCreateForm();
    await this.fillForm(name);
    await this.save();
  }

  async editLabel(id, name) {
    await this.page.getByTestId(`edit-label-${id}`).click();
    await this.nameInput.fill(name);
    await this.save();
  }

  async selectLabel(id) {
    await this.page.getByTestId(`select-label-${id}`).check();
  }

  async selectAll() {
    await this.selectAllCheckbox.check();
  }

  async deleteSelected() {
    await this.deleteSelectedButton.click();
  }
}
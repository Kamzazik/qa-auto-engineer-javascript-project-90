export class LabelsPage {
  constructor(page) {
    this.page = page;
    this.tabLabels = page.getByTestId('tab-labels');
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
    await this.tabLabels.click();
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

  async getLabelName(id) {
    return await this.page.getByTestId(`label-name-${id}`).textContent();
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
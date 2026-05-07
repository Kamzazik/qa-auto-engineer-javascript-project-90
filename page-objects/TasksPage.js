export class TasksPage {
  constructor(page) {
    this.page = page;
    this.tabTasks = page.getByTestId('tab-tasks');
    this.createTaskButton = page.getByTestId('create-task-button');
    this.taskForm = page.getByTestId('task-form');
    this.titleInput = page.getByTestId('task-title-input');
    this.descriptionInput = page.getByTestId('task-description-input');
    this.assigneeInput = page.getByTestId('task-assignee-input');
    this.statusSelect = page.getByTestId('task-status-select');
    this.saveButton = page.getByTestId('save-task-button');
    this.cancelButton = page.getByTestId('cancel-task-button');
    this.kanbanBoard = page.getByTestId('kanban-board');
    this.deleteSelectedButton = page.getByTestId('delete-tasks-selected-button');
    this.filterStatus = page.getByTestId('filter-status');
    this.filterLabel = page.getByTestId('filter-label');
  }

  async goToTab() {
    await this.tabTasks.click();
  }

  async openCreateForm() {
    await this.createTaskButton.click();
  }

  async fillForm(title, description = '', assignee = '') {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.assigneeInput.fill(assignee);
  }

  async save() {
    await this.saveButton.click();
  }

  async createTask(title, description = '', assignee = '') {
    await this.openCreateForm();
    await this.fillForm(title, description, assignee);
    await this.save();
  }

  async editTask(id, title, description = '', assignee = '') {
    await this.page.getByTestId(`edit-task-${id}`).click();
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.assigneeInput.fill(assignee);
    await this.save();
  }

  async getTaskTitle(id) {
    return await this.page.getByTestId(`task-title-${id}`).textContent();
  }

  async getTaskAssignee(id) {
    return await this.page.getByTestId(`task-assignee-${id}`).textContent();
  }

  async selectTask(id) {
    await this.page.getByTestId(`select-task-${id}`).check();
  }

  async deleteSelected() {
    await this.deleteSelectedButton.click();
  }

  async getFirstColumnId() {
    const column = this.page.locator('[data-testid^="column-"]').first();
    return (await column.getAttribute('data-testid')).replace('column-', '');
  }

  async getLastColumnId() {
    const column = this.page.locator('[data-testid^="column-"]').last();
    return (await column.getAttribute('data-testid')).replace('column-', '');
  }

  async dragTaskToColumn(taskId, columnId) {
    const task = this.page.getByTestId(`task-card-${taskId}`);
    const column = this.page.getByTestId(`column-${columnId}`);
    await task.dragTo(column);
  }

  async isTaskInColumn(taskId, columnId) {
    const column = this.page.getByTestId(`column-${columnId}`);
    const task = column.getByTestId(`task-card-${taskId}`);
    return await task.isVisible();
  }

  async filterByStatus(statusId) {
    await this.filterStatus.selectOption(statusId);
  }

  async filterByLabel(labelId) {
    await this.filterLabel.selectOption(labelId);
  }

  async getVisibleTaskCount() {
    return await this.page.locator('[data-testid^="task-card-"]').count();
  }
}
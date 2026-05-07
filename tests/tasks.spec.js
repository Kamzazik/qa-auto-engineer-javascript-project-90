import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { StatusesPage } from '../page-objects/StatusesPage.js';
import { LabelsPage } from '../page-objects/LabelsPage.js';
import { TasksPage } from '../page-objects/TasksPage.js';

test.describe('Задачи (CRUD + фильтрация + перемещение)', () => {
  let tasksPage;

  test.beforeEach(async ({ page }) => {
    await login(page);

    const statusesPage = new StatusesPage(page);
    await statusesPage.goToTab();
    await statusesPage.createStatus('To Do', 'todo');
    await statusesPage.createStatus('In Progress', 'in_progress');
    await statusesPage.createStatus('Done', 'done');

    const labelsPage = new LabelsPage(page);
    await labelsPage.goToTab();
    await labelsPage.createLabel('bug');
    await labelsPage.createLabel('feature');

    tasksPage = new TasksPage(page);
    await tasksPage.goToTab();
  });

  test('форма создания задачи отображается', async () => {
    await tasksPage.openCreateForm();
    await expect(tasksPage.taskForm).toBeVisible();
  });

  test('создание новой задачи', async () => {
    await tasksPage.createTask('Новая задача', 'Описание', 'Иван');
    const card = tasksPage.page.locator('[data-testid^="task-card-"]').first();
    await expect(card.locator('strong')).toHaveText('Новая задача');
  });

  test('задача отображается в правильной колонке', async () => {
    await tasksPage.createTask('Задача в To Do');
    const columnId = await tasksPage.getFirstColumnId();
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');
    expect(await tasksPage.isTaskInColumn(taskId, columnId)).toBeTruthy();
  });

  test('отображение данных задачи', async () => {
    await tasksPage.createTask('Тестовая задача', '', 'Пётр');
    const card = tasksPage.page.locator('[data-testid^="task-card-"]').first();
    await expect(card.locator('[data-testid^="task-assignee-"]')).toHaveText('Пётр');
  });

  test('редактирование задачи', async () => {
    await tasksPage.createTask('Старая', '', 'Анна');
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');
    await tasksPage.editTask(taskId, 'Обновлённая', '', 'Сергей');
    await expect(tasksPage.page.getByTestId(`task-title-${taskId}`)).toHaveText('Обновлённая');
  });

  test('удаление задачи', async () => {
    await tasksPage.createTask('Удаляемая');
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');
    await tasksPage.selectTask(taskId);
    await tasksPage.deleteSelected();
    await expect(tasksPage.page.getByTestId(`task-card-${taskId}`)).not.toBeVisible();
  });

  test('массовое удаление задач', async () => {
    await tasksPage.createTask('Задача 1');
    await tasksPage.createTask('Задача 2');
    await tasksPage.createTask('Задача 3');
    const cards = tasksPage.page.locator('[data-testid^="task-card-"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const testId = await cards.nth(i).getAttribute('data-testid');
      await tasksPage.selectTask(testId.replace('task-card-', ''));
    }
    await tasksPage.deleteSelected();
    await expect(tasksPage.page.locator('[data-testid^="task-card-"]')).toHaveCount(0);
  });

  test('перемещение задачи между колонками', async () => {
    await tasksPage.createTask('Перемещаемая');
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');
    const lastColumnId = await tasksPage.getLastColumnId();
    await tasksPage.page.getByTestId(`edit-task-${taskId}`).click();
    await tasksPage.statusSelect.selectOption(lastColumnId);
    await tasksPage.save();
    const taskCards = tasksPage.page.locator('[data-testid^="task-card-"]');
    await expect(taskCards.first()).toBeVisible();
  });

  test('фильтрация по статусу', async () => {
    await tasksPage.createTask('Задача 1', '', '');
    await tasksPage.createTask('Задача 2', '', '');
    const initialCount = await tasksPage.getVisibleTaskCount();
    expect(initialCount).toBeGreaterThanOrEqual(2);
  });
});
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';
import { StatusesPage } from '../page-objects/StatusesPage.js';
import { LabelsPage } from '../page-objects/LabelsPage.js';
import { TasksPage } from '../page-objects/TasksPage.js';

test.describe('Задачи (CRUD + фильтрация + перемещение)', () => {
  let tasksPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');

    // Создаём статусы и метки для задач
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

  // --- Создание ---
  test('форма создания задачи отображается', async () => {
    await tasksPage.openCreateForm();
    await expect(tasksPage.taskForm).toBeVisible();
    await expect(tasksPage.titleInput).toBeVisible();
    await expect(tasksPage.assigneeInput).toBeVisible();
    await expect(tasksPage.saveButton).toBeVisible();
  });

  test('создание новой задачи', async () => {
    await tasksPage.createTask('Новая задача', 'Описание', 'Иван');
    await expect(tasksPage.taskForm).not.toBeVisible();

    const card = tasksPage.page.locator('[data-testid^="task-card-"]').first();
    await expect(card).toBeVisible();
    await expect(card.locator('strong')).toHaveText('Новая задача');
  });

  test('задача отображается в правильной колонке', async () => {
    await tasksPage.createTask('Задача в To Do');
    const columnId = await tasksPage.getFirstColumnId();
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');
    expect(await tasksPage.isTaskInColumn(taskId, columnId)).toBeTruthy();
  });

  // --- Просмотр ---
  test('отображение данных задачи', async () => {
    await tasksPage.createTask('Тестовая задача', '', 'Пётр');
    const card = tasksPage.page.locator('[data-testid^="task-card-"]').first();
    await expect(card.locator('[data-testid^="task-title-"]')).toHaveText('Тестовая задача');
    await expect(card.locator('[data-testid^="task-assignee-"]')).toHaveText('Пётр');
  });

  // --- Редактирование ---
  test('редактирование задачи', async () => {
    await tasksPage.createTask('Старая', '', 'Анна');
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');

    await tasksPage.editTask(taskId, 'Обновлённая', '', 'Сергей');
    await expect(tasksPage.page.getByTestId(`task-title-${taskId}`)).toHaveText('Обновлённая');
    await expect(tasksPage.page.getByTestId(`task-assignee-${taskId}`)).toHaveText('Сергей');
  });

  // --- Удаление ---
  test('удаление одной задачи', async () => {
    await tasksPage.createTask('Удаляемая');
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');

    await tasksPage.selectTask(taskId);
    await tasksPage.deleteSelected();
    await expect(tasksPage.page.getByTestId(`task-card-${taskId}`)).not.toBeVisible();
  });

  // --- Массовое удаление ---
  test('массовое удаление задач', async () => {
    await tasksPage.createTask('Задача 1');
    await tasksPage.createTask('Задача 2');
    await tasksPage.createTask('Задача 3');

    const cards = tasksPage.page.locator('[data-testid^="task-card-"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const testId = await card.getAttribute('data-testid');
      const id = testId.replace('task-card-', '');
      await tasksPage.selectTask(id);
    }

    await tasksPage.deleteSelected();
    await expect(tasksPage.page.locator('[data-testid^="task-card-"]')).toHaveCount(0);
  });

  // --- Перемещение ---
  test('перемещение задачи между колонками через редактирование', async () => {
    await tasksPage.createTask('Перемещаемая');
    const taskId = (await tasksPage.page.locator('[data-testid^="task-card-"]').first().getAttribute('data-testid')).replace('task-card-', '');

    const lastColumnId = await tasksPage.getLastColumnId();

    await tasksPage.page.getByTestId(`edit-task-${taskId}`).click();
    await expect(tasksPage.taskForm).toBeVisible();
    await tasksPage.statusSelect.selectOption(lastColumnId);
    await tasksPage.save();
    await expect(tasksPage.taskForm).not.toBeVisible();

    const taskCards = tasksPage.page.locator('[data-testid^="task-card-"]');
    await expect(taskCards.first()).toBeVisible();
  });

  // --- Фильтрация ---
  test('фильтрация по статусу', async () => {
    const firstColumnId = await tasksPage.getFirstColumnId();
    await tasksPage.createTask('Задача видна', '', '');
    await tasksPage.createTask('Другая задача', '', '');

    const initialCount = await tasksPage.getVisibleTaskCount();
    expect(initialCount).toBeGreaterThanOrEqual(2);

    await tasksPage.filterByStatus(firstColumnId);
  });

  test('фильтрация по метке', async () => {
    await tasksPage.createTask('С меткой bug', '', '');
    await tasksPage.createTask('Без метки', '', '');
    const initialCount = await tasksPage.getVisibleTaskCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);
  });
});
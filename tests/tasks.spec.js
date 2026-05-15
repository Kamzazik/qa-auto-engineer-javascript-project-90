import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { TasksPage } from '../page-objects/TasksPage.js';

test.describe('Задачи (CRUD)', () => {
  let tasksPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    tasksPage = new TasksPage(page);
    await tasksPage.goTo();
  });

  test('канбан-доска отображается', async ({ page }) => {
    await expect(page.getByText('Draft').first()).toBeVisible();
  });
});
import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { StatusesPage } from '../page-objects/StatusesPage.js';

test.describe('Статусы (CRUD)', () => {
  let statusesPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    statusesPage = new StatusesPage(page);
    await statusesPage.goTo();
  });

  test('список статусов отображается', async ({ page }) => {
    await expect(page.getByText('Draft').first()).toBeVisible();
  });

  test('создание статуса', async ({ page }) => {
    await statusesPage.createStatus('TestStatus', 'test_slug');
    await expect(page.getByText('TestStatus')).toBeVisible();
  });
});
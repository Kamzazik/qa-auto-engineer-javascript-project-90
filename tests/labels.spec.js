import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { LabelsPage } from '../page-objects/LabelsPage.js';

test.describe('Метки (CRUD)', () => {
  let labelsPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    labelsPage = new LabelsPage(page);
    await labelsPage.goTo();
  });

  test('список меток отображается', async ({ page }) => {
    await expect(page.getByText('bug')).toBeVisible();
  });

  test('создание метки', async ({ page }) => {
    await labelsPage.createLabel('test-label');
    await expect(page.getByText('test-label')).toBeVisible();
  });
});
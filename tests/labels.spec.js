import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { LabelsPage } from '../page-objects/LabelsPage.js';

test.describe('Метки (CRUD)', () => {
  let labelsPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    labelsPage = new LabelsPage(page);
    await labelsPage.goToTab();
  });

  test('форма создания метки отображается', async () => {
    await labelsPage.openCreateForm();
    await expect(labelsPage.labelForm).toBeVisible();
  });

  test('создание новой метки', async () => {
    await labelsPage.createLabel('bug');
    await expect(labelsPage.page.locator('tbody tr').first().locator('td:nth-child(2)')).toHaveText('bug');
  });

  test('просмотр списка меток', async () => {
    await labelsPage.createLabel('feature');
    await labelsPage.createLabel('docs');
    await expect(labelsPage.page.locator('tbody tr')).toHaveCount(2);
  });

  test('редактирование метки', async () => {
    await labelsPage.createLabel('old');
    const row = labelsPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('label-row-', '');
    await labelsPage.editLabel(id, 'new');
    await expect(labelsPage.page.getByTestId(`label-name-${id}`)).toHaveText('new');
  });

  test('удаление метки', async () => {
    await labelsPage.createLabel('to-delete');
    const row = labelsPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('label-row-', '');
    await labelsPage.selectLabel(id);
    await labelsPage.deleteSelected();
    await expect(labelsPage.page.getByTestId(`label-row-${id}`)).not.toBeVisible();
  });

  test('массовое удаление меток', async () => {
    await labelsPage.createLabel('label-1');
    await labelsPage.createLabel('label-2');
    await labelsPage.createLabel('label-3');
    await labelsPage.selectAll();
    await labelsPage.deleteSelected();
    await expect(labelsPage.page.locator('tbody tr')).toHaveCount(0);
  });
});
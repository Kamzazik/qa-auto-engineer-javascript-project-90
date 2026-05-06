import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';
import { LabelsPage } from '../page-objects/LabelsPage.js';

test.describe('Метки (CRUD)', () => {
  let labelsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');
    labelsPage = new LabelsPage(page);
    await labelsPage.goToTab();
  });

  test('форма создания метки отображается', async () => {
    await labelsPage.openCreateForm();
    await expect(labelsPage.labelForm).toBeVisible();
    await expect(labelsPage.nameInput).toBeVisible();
    await expect(labelsPage.saveButton).toBeVisible();
  });

  test('создание новой метки', async () => {
    await labelsPage.createLabel('bug');
    await expect(labelsPage.labelForm).not.toBeVisible();

    const row = labelsPage.page.locator('tbody tr').first();
    await expect(row.locator('td:nth-child(2)')).toHaveText('bug');
  });

  test('просмотр списка меток', async () => {
    await labelsPage.createLabel('feature');
    await labelsPage.createLabel('docs');

    await expect(labelsPage.labelsTable).toBeVisible();
    await expect(labelsPage.page.locator('tbody tr')).toHaveCount(2);
  });

  test('отображение названия метки', async () => {
    await labelsPage.createLabel('urgent');

    const row = labelsPage.page.locator('tbody tr').first();
    await expect(row.locator('td:nth-child(2)')).toHaveText('urgent');
  });

  test('редактирование метки', async () => {
    await labelsPage.createLabel('old-label');
    const row = labelsPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('label-row-', '');

    await labelsPage.editLabel(id, 'new-label');
    await expect(labelsPage.page.getByTestId(`label-name-${id}`)).toHaveText('new-label');
  });

  test('удаление одной метки', async () => {
    await labelsPage.createLabel('to-delete');
    const row = labelsPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('label-row-', '');

    await labelsPage.selectLabel(id);
    await labelsPage.deleteSelected();
    await expect(labelsPage.page.getByTestId(`label-row-${id}`)).not.toBeVisible();
  });

  test('массовое выделение и удаление всех меток', async () => {
    await labelsPage.createLabel('label-1');
    await labelsPage.createLabel('label-2');
    await labelsPage.createLabel('label-3');

    await labelsPage.selectAll();
    await expect(labelsPage.deleteSelectedButton).toBeVisible();
    await labelsPage.deleteSelected();
    await expect(labelsPage.page.locator('tbody tr')).toHaveCount(0);
  });
});
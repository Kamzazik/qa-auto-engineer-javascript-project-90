import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';
import { StatusesPage } from '../page-objects/StatusesPage.js';

test.describe('Статусы (CRUD)', () => {
  let statusesPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');
    statusesPage = new StatusesPage(page);
    await statusesPage.goToTab();
  });

  test('форма создания статуса отображается', async () => {
    await statusesPage.openCreateForm();
    await expect(statusesPage.statusForm).toBeVisible();
    await expect(statusesPage.nameInput).toBeVisible();
    await expect(statusesPage.slugInput).toBeVisible();
    await expect(statusesPage.saveButton).toBeVisible();
  });

  test('создание нового статуса', async () => {
    await statusesPage.createStatus('В работе', 'in_progress');
    await expect(statusesPage.statusForm).not.toBeVisible();

    const row = statusesPage.page.locator('tbody tr').first();
    await expect(row.locator('td:nth-child(2)')).toHaveText('В работе');
    await expect(row.locator('td:nth-child(3)')).toHaveText('in_progress');
  });

  test('просмотр списка статусов', async () => {
    await statusesPage.createStatus('Новый', 'new');
    await statusesPage.createStatus('Готово', 'done');

    await expect(statusesPage.statusesTable).toBeVisible();
    await expect(statusesPage.page.locator('tbody tr')).toHaveCount(2);
  });

  test('отображение информации о статусе', async () => {
    await statusesPage.createStatus('Ожидание', 'pending');

    const row = statusesPage.page.locator('tbody tr').first();
    await expect(row.locator('td:nth-child(2)')).toHaveText('Ожидание');
    await expect(row.locator('td:nth-child(3)')).toHaveText('pending');
  });

  test('редактирование статуса', async () => {
    await statusesPage.createStatus('Старое', 'old');
    const row = statusesPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('status-row-', '');

    await statusesPage.editStatus(id, 'Обновлённое', 'updated');
    await expect(statusesPage.page.getByTestId(`status-name-${id}`)).toHaveText('Обновлённое');
    await expect(statusesPage.page.getByTestId(`status-slug-${id}`)).toHaveText('updated');
  });

  test('удаление одного статуса', async () => {
    await statusesPage.createStatus('Удалить', 'delete');
    const row = statusesPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('status-row-', '');

    await statusesPage.selectStatus(id);
    await statusesPage.deleteSelected();
    await expect(statusesPage.page.getByTestId(`status-row-${id}`)).not.toBeVisible();
  });

  test('массовое выделение и удаление всех статусов', async () => {
    await statusesPage.createStatus('Первый', 'first');
    await statusesPage.createStatus('Второй', 'second');
    await statusesPage.createStatus('Третий', 'third');

    await statusesPage.selectAll();
    await expect(statusesPage.deleteSelectedButton).toBeVisible();
    await statusesPage.deleteSelected();
    await expect(statusesPage.page.locator('tbody tr')).toHaveCount(0);
  });
});
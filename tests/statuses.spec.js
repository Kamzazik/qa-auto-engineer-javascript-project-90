import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { StatusesPage } from '../page-objects/StatusesPage.js';

test.describe('Статусы (CRUD)', () => {
  let statusesPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    statusesPage = new StatusesPage(page);
    await statusesPage.goToTab();
  });

  test('форма создания статуса отображается', async () => {
    await statusesPage.openCreateForm();
    await expect(statusesPage.statusForm).toBeVisible();
  });

  test('создание нового статуса', async () => {
    await statusesPage.createStatus('В работе', 'in_progress');
    await expect(statusesPage.page.locator('tbody tr').first().locator('td:nth-child(2)')).toHaveText('В работе');
  });

  test('просмотр списка статусов', async () => {
    await statusesPage.createStatus('Новый', 'new');
    await statusesPage.createStatus('Готово', 'done');
    await expect(statusesPage.page.locator('tbody tr')).toHaveCount(2);
  });

  test('редактирование статуса', async () => {
    await statusesPage.createStatus('Старое', 'old');
    const row = statusesPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('status-row-', '');
    await statusesPage.editStatus(id, 'Обновлённое', 'updated');
    await expect(statusesPage.page.getByTestId(`status-name-${id}`)).toHaveText('Обновлённое');
  });

  test('удаление статуса', async () => {
    await statusesPage.createStatus('Удалить', 'delete');
    const row = statusesPage.page.locator('tbody tr').first();
    const id = (await row.getAttribute('data-testid')).replace('status-row-', '');
    await statusesPage.selectStatus(id);
    await statusesPage.deleteSelected();
    await expect(statusesPage.page.getByTestId(`status-row-${id}`)).not.toBeVisible();
  });

  test('массовое удаление статусов', async () => {
    await statusesPage.createStatus('Первый', 'first');
    await statusesPage.createStatus('Второй', 'second');
    await statusesPage.createStatus('Третий', 'third');
    await statusesPage.selectAll();
    await statusesPage.deleteSelected();
    await expect(statusesPage.page.locator('tbody tr')).toHaveCount(0);
  });
});
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';
import { UsersPage } from '../page-objects/UsersPage.js';

test.describe('Пользователи (CRUD)', () => {
  let usersPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');
    usersPage = new UsersPage(page);
    await usersPage.goToTab();
  });

  test('форма создания пользователя отображается', async () => {
    await usersPage.openCreateForm();
    await expect(usersPage.userForm).toBeVisible();
    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
    await expect(usersPage.emailInput).toBeVisible();
    await expect(usersPage.saveUserButton).toBeVisible();
  });

  test('создание нового пользователя', async () => {
    await usersPage.createUser('Иван', 'Иванов', 'ivan@example.com');
    await expect(usersPage.userForm).not.toBeVisible();

    const row = usersPage.page.locator('[data-testid^="user-row-"]').first();
    await expect(row).toBeVisible();
    await expect(row.locator('[data-testid^="user-firstname-"]')).toHaveText('Иван');
    await expect(row.locator('[data-testid^="user-lastname-"]')).toHaveText('Иванов');
    await expect(row.locator('[data-testid^="user-email-"]')).toHaveText('ivan@example.com');
  });

  test('просмотр списка пользователей', async () => {
    await usersPage.createUser('Пётр', 'Петров', 'petr@example.com');
    await usersPage.createUser('Анна', 'Сидорова', 'anna@example.com');

    await expect(usersPage.usersTable).toBeVisible();
    const rows = usersPage.page.locator('tbody tr');
    await expect(rows).toHaveCount(2);
  });

  test('отображение информации о пользователе', async () => {
    await usersPage.createUser('Сергей', 'Сергеев', 'sergey@example.com');

    const row = usersPage.page.locator('tbody tr').first();
    await expect(row.locator('td:nth-child(2)')).toHaveText('Сергей');
    await expect(row.locator('td:nth-child(3)')).toHaveText('Сергеев');
    await expect(row.locator('td:nth-child(4)')).toHaveText('sergey@example.com');
  });

  test('редактирование пользователя', async () => {
    await usersPage.createUser('Старое', 'Имя', 'old@example.com');

    const row = usersPage.page.locator('tbody tr').first();
    const testId = await row.getAttribute('data-testid');
    const userId = testId.replace('user-row-', '');

    await usersPage.editUser(userId, 'Новое', 'Имя', 'new@example.com');

    await expect(usersPage.page.getByTestId(`user-firstname-${userId}`)).toHaveText('Новое');
    await expect(usersPage.page.getByTestId(`user-lastname-${userId}`)).toHaveText('Имя');
    await expect(usersPage.page.getByTestId(`user-email-${userId}`)).toHaveText('new@example.com');
  });

  test('валидация email при редактировании', async () => {
    await usersPage.createUser('Тест', 'Тестов', 'test@example.com');

    const row = usersPage.page.locator('tbody tr').first();
    const testId = await row.getAttribute('data-testid');
    const userId = testId.replace('user-row-', '');

    await usersPage.page.getByTestId(`edit-user-${userId}`).click();
    await usersPage.emailInput.fill('bad-email');
    await expect(usersPage.emailError).toBeVisible();
    await expect(usersPage.emailError).toHaveText('Некорректный email');
  });

  test('удаление одного пользователя', async () => {
    await usersPage.createUser('Удаляемый', 'Пользователь', 'del@example.com');

    const row = usersPage.page.locator('tbody tr').first();
    const testId = await row.getAttribute('data-testid');
    const userId = testId.replace('user-row-', '');

    await usersPage.selectUser(userId);
    await usersPage.deleteSelected();

    await expect(usersPage.page.getByTestId(`user-row-${userId}`)).not.toBeVisible();
  });

  test('массовое выделение и удаление всех пользователей', async () => {
    await usersPage.createUser('User1', 'Last1', 'user1@example.com');
    await usersPage.createUser('User2', 'Last2', 'user2@example.com');
    await usersPage.createUser('User3', 'Last3', 'user3@example.com');

    await usersPage.selectAllUsers();
    await expect(usersPage.deleteSelectedButton).toBeVisible();
    await usersPage.deleteSelected();

    const rows = usersPage.page.locator('tbody tr');
    await expect(rows).toHaveCount(0);
  });
});
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';
import { MainPage } from '../page-objects/MainPage.js';
import { UsersPage } from '../page-objects/UsersPage.js';

test.describe('Пользователи (CRUD)', () => {
  let usersPage;

  test.beforeEach(async ({ page }) => {
    // Авторизуемся перед каждым тестом
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');
    usersPage = new UsersPage(page);
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

    // После создания форма закрыта, пользователь в таблице
    await expect(usersPage.userForm).not.toBeVisible();

    const row = usersPage.page.locator('[data-testid^="user-row-"]').first();
    await expect(row).toBeVisible();
    await expect(row.locator('[data-testid^="user-firstname-"]')).toHaveText('Иван');
    await expect(row.locator('[data-testid^="user-lastname-"]')).toHaveText('Иванов');
    await expect(row.locator('[data-testid^="user-email-"]')).toHaveText('ivan@example.com');
  });

  test('просмотр списка пользователей', async () => {
    // Создаём несколько пользователей
    await usersPage.createUser('Пётр', 'Петров', 'petr@example.com');
    await usersPage.createUser('Анна', 'Сидорова', 'anna@example.com');

    await expect(usersPage.usersTable).toBeVisible();

    // Проверяем, что в таблице минимум 2 строки (пользователя)
    const rows = usersPage.page.locator('tbody tr');
    await expect(rows).toHaveCount(2);
  });

  test('отображение информации о пользователе', async () => {
    await usersPage.createUser('Сергей', 'Сергеев', 'sergey@example.com');

    // Ищем строку и проверяем данные
    const row = usersPage.page.locator('tbody tr').first();
    await expect(row.locator('td:nth-child(2)')).toHaveText('Сергей');
    await expect(row.locator('td:nth-child(3)')).toHaveText('Сергеев');
    await expect(row.locator('td:nth-child(4)')).toHaveText('sergey@example.com');
  });

  test('редактирование пользователя', async () => {
    await usersPage.createUser('Старое', 'Имя', 'old@example.com');

    // Получаем id созданного пользователя
    const row = usersPage.page.locator('tbody tr').first();
    const testId = await row.getAttribute('data-testid');
    const userId = testId.replace('user-row-', '');

    // Редактируем
    await usersPage.editUser(userId, 'Новое', 'Имя', 'new@example.com');

    // Проверяем обновлённые данные
    await expect(usersPage.page.getByTestId(`user-firstname-${userId}`)).toHaveText('Новое');
    await expect(usersPage.page.getByTestId(`user-lastname-${userId}`)).toHaveText('Имя');
    await expect(usersPage.page.getByTestId(`user-email-${userId}`)).toHaveText('new@example.com');
  });

  test('валидация email при редактировании', async () => {
    await usersPage.createUser('Тест', 'Тестов', 'test@example.com');

    const row = usersPage.page.locator('tbody tr').first();
    const testId = await row.getAttribute('data-testid');
    const userId = testId.replace('user-row-', '');

    // Открываем редактирование и вводим некорректный email
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

    // Выделяем и удаляем
    await usersPage.selectUser(userId);
    await usersPage.deleteSelected();

    // Пользователь удалён
    await expect(usersPage.page.getByTestId(`user-row-${userId}`)).not.toBeVisible();
  });

  test('массовое выделение и удаление всех пользователей', async () => {
    // Создаём 3 пользователей
    await usersPage.createUser('User1', 'Last1', 'user1@example.com');
    await usersPage.createUser('User2', 'Last2', 'user2@example.com');
    await usersPage.createUser('User3', 'Last3', 'user3@example.com');

    // Выделяем всех
    await usersPage.selectAllUsers();

    // Кнопка удаления выбранных видна
    await expect(usersPage.deleteSelectedButton).toBeVisible();

    // Удаляем
    await usersPage.deleteSelected();

    // Таблица пуста
    const rows = usersPage.page.locator('tbody tr');
    await expect(rows).toHaveCount(0);
  });
});
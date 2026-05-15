import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { UsersPage } from '../page-objects/UsersPage.js';

test.describe('Пользователи (CRUD)', () => {
  let usersPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    usersPage = new UsersPage(page);
    await usersPage.goTo();
  });

  test('список пользователей отображается', async ({ page }) => {
    await expect(page.getByText('john@google.com')).toBeVisible();
  });

  test('создание пользователя', async ({ page }) => {
    await usersPage.createUser('test@test.com', 'Test', 'User');
    await expect(page.getByText('test@test.com')).toBeVisible();
  });

  test('редактирование пользователя', async ({ page }) => {
    await page.getByRole('cell', { name: 'jack@yahoo.com' }).click();
    await usersPage.firstNameInput.fill('NewName');
    await usersPage.saveButton.click();
    await expect(page.getByText('NewName')).toBeVisible();
  });
});
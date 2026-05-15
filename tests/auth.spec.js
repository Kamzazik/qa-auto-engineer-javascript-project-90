import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';

test.describe('Аутентификация', () => {

  test('успешный вход с любым логином и паролем', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin');
    await expect(page.getByText('Tasks')).toBeVisible();
  });

  test('нельзя войти с пустыми полями', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click();
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

});
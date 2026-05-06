import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';
import { MainPage } from '../page-objects/MainPage.js';

test.describe('Аутентификация', () => {

  test('успешный вход с любым логином и паролем', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser', 'testpass');

    const mainPage = new MainPage(page);
    await expect(mainPage.usernameDisplay).toBeVisible();
    const username = await mainPage.getUsernameText();
    expect(username).toBe('testuser');
  });

  test('нельзя войти с пустыми полями', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click();

    // Форма всё ещё видна — значит не вошли
    await expect(loginPage.loginForm).toBeVisible();
  });

});
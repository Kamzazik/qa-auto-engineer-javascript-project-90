import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { LoginPage } from '../page-objects/LoginPage.js';
import { MainPage } from '../page-objects/MainPage.js';

test.describe('Аутентификация', () => {

  test('успешный вход с любым логином и паролем', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser', 'testpass');

    const mainPage = new MainPage(page);
    await expect(mainPage.usernameDisplay).toBeVisible();
    expect(await mainPage.getUsernameText()).toBe('testuser');
  });

  test('нельзя войти с пустыми полями', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click();
    await expect(loginPage.loginForm).toBeVisible();
  });

});
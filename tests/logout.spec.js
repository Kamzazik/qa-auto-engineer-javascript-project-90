import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.js';
import { MainPage } from '../page-objects/MainPage.js';

test('выход из приложения', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('testuser', 'testpass');

  const mainPage = new MainPage(page);
  await mainPage.logout();

  // После выхода форма входа снова видна
  await expect(loginPage.loginForm).toBeVisible();
});
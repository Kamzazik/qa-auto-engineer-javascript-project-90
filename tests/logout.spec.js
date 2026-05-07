import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { LoginPage } from '../page-objects/LoginPage.js';
import { MainPage } from '../page-objects/MainPage.js';

test('выход из приложения', async ({ page }) => {
  await login(page, 'testuser', 'testpass');

  const mainPage = new MainPage(page);
  await mainPage.logout();

  const loginPage = new LoginPage(page);
  await expect(loginPage.loginForm).toBeVisible();
});
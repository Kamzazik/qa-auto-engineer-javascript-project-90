import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';
import { LoginPage } from '../page-objects/LoginPage.js';

test('выход из приложения', async ({ page }) => {
  await login(page);
  await page.getByText('Jane Doe').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  const loginPage = new LoginPage(page);
  await expect(loginPage.usernameInput).toBeVisible();
});
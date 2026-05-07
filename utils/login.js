import { LoginPage } from '../page-objects/LoginPage.js';

export async function login(page, username = 'admin', password = 'admin') {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
}
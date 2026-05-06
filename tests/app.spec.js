import { test, expect } from '@playwright/test';

test('приложение успешно рендерится', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Канбан-доска');
});
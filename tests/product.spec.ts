import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

let homePage: HomePage;
let createdTestUser: { email: string } | null = null;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  await homePage.goto();
});


test('Product detail page shows correct information', async ({ page }) => {
  
    // Click on first product
    await page.locator('.product-card').first().click();
  
    // Check product details
    await expect(page.locator('.product-title')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
    await expect(page.locator('.add-to-cart')).toBeEnabled();
  });
  
// tests/register.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { generateRandomEmail, generateRandomPassword, generateRandomName } from '../utils/dataGenerator';
import * as testData from '../test-data/registerUsers.json';
import { HomePage } from '../pages/HomePage';

test('Register with a new user', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const homePage = new HomePage(page);
  const name = generateRandomName();
  const email = generateRandomEmail();
  const password = generateRandomPassword();
  await registerPage.goto();

  await registerPage.fillRegistrationForm({
    name,
    email,
    password,
    confirmPassword: password,
  });

  await registerPage.submit();

  const actualUsername = await homePage.getUsername();
  await expect(page).toHaveTitle('StankinShop');
  await expect(homePage.usernameLocator).toBeVisible(); 
  expect(actualUsername).toBe(name.toLowerCase());

  //await page.waitForTimeout(3000);

  //await registerPage.expectAccountCreationSuccess();
});

test('Register with existing email should show warning', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  await registerPage.fillRegistrationForm({
    ...testData.existingUser,
  });

  await registerPage.submit();
  await expect(page).toHaveTitle('Register Account');

  // Check for the alert message
  const alertText = await registerPage.getAlertMessageText();
  expect(alertText).toBe('Warning: E-Mail Address is already registered!');
    

});

// tests/register.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { generateRandomEmail, generateRandomPassword } from '../utils/dataGenerator';
import * as testData from '../test-data/registerUsers.json';

test('Register with a new user', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const email = generateRandomEmail();
  const password = generateRandomPassword();
  await registerPage.goto();

  await registerPage.fillRegistrationForm({
    ...testData.newUser,
    email,
    password,
  });

  await registerPage.submit();
  await registerPage.expectAccountCreationSuccess();
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

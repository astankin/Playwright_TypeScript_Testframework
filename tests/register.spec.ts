// tests/register.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { generateRandomEmail, generateRandomPassword, generateRandomName, deleteUserFromDb } from '../utils/dataGenerator';
import * as testData from '../test-data/registerUsers.json';
import { HomePage } from '../pages/HomePage';
import axios from 'axios';

let registerPage: RegisterPage;
let createdTestUser: { email: string } | null = null;

test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.goto();
});

test.afterEach(async () => {
  if (createdTestUser) {
    await deleteUserFromDb(createdTestUser.email); 
    createdTestUser = null;
  }
});


test('Register with a new user', async ({ page }) => {
  const homePage = new HomePage(page);
  const name = generateRandomName();
  const email = generateRandomEmail();
  const password = generateRandomPassword();

  createdTestUser = { email };

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
  expect(actualUsername).toBe(name.toLowerCase().trim());
});

test('Register with existing email should show warning', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const password = generateRandomPassword();
  await registerPage.goto();

  await registerPage.fillRegistrationForm({
    name: testData.existingUser.username,
    email: testData.existingUser.email,
    password: password,
    confirmPassword: password,
  });

  await registerPage.submit();
  const expectedErrorText: string = 'User with this email already exists';
    
  await expect(registerPage.errorMessage).toBeVisible();
  await expect(registerPage.errorMessage).not.toHaveText('Loading...');
  
  const actualErrorText: string = await registerPage.getErrorMessageText();
  expect(actualErrorText).toBe(expectedErrorText);

});

test('Register with empty fields should show validation messages', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  await registerPage.submit();
  const validationMessage = await registerPage.name.evaluate(
    (input: HTMLInputElement) => input.validationMessage
  );

  expect(validationMessage).toContain('Please fill out this field');
});

test('Register with invalid email format should show email validation error', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  const password = generateRandomPassword();
  await registerPage.fillRegistrationForm({
    name: generateRandomName(),
    email: 'invalidemail.com',
    password,
    confirmPassword: password,
  });

  await registerPage.submit();
  const validationMessage = await registerPage.email.evaluate(
    (input: HTMLInputElement) => input.validationMessage
  );
  
  expect(validationMessage).toContain("include an '@' in the email address");
});

test('Register with mismatching passwords should show error', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  await registerPage.fillRegistrationForm({
    name: generateRandomName(),
    email: generateRandomEmail(),
    password: generateRandomPassword(),
    confirmPassword: generateRandomPassword(), // different password
  });

  await registerPage.submit();

  const validationMessage = await registerPage.getMismatchPasswordErrorText();
  await expect(registerPage.mismatchPasswordError).toBeVisible();
  expect(validationMessage).toContain('Passwords do not match');
  
});

test('Register with weak password should show validation error', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  const weakPassword = 'password'; // no special chars, numbers, etc.

  await registerPage.fillRegistrationForm({
    name: generateRandomName(),
    email: generateRandomEmail(),
    password: weakPassword,
    confirmPassword: weakPassword,
  });

  await registerPage.submit();

  const validationMessage = await registerPage.getInvalidPasswordErrorText();
  await expect(registerPage.invalidPasswordError).toBeVisible();
  expect(validationMessage).toContain('(!@#$%^&*?)');
});

// test('Register with special characters in name should show error', async ({ page }) => {
//   const registerPage = new RegisterPage(page);
//   await registerPage.goto();

//   const specialCharName = '@!#Doe';
//   const password = generateRandomPassword();

//   await registerPage.fillRegistrationForm({

//     name: specialCharName,
//     email: generateRandomEmail(),
//     password,
//     confirmPassword: password,
//   });

//   await registerPage.submit();

//   await expect(registerPage.nameError).toContainText(/invalid name/i);
// });

test('Register with very long name and email should be handled properly', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  const longName = 'A'.repeat(256);
  const longEmail = `longemail${'x'.repeat(244)}@test.com`; // total ~256 chars

  const password = generateRandomPassword();

  createdTestUser = { email: longEmail };

  await registerPage.fillRegistrationForm({
    name: longName,
    email: longEmail,
    password,
    confirmPassword: password,
  });

  await registerPage.submit();

  await expect(registerPage.errorMessage).toBeVisible();
});

test('Register with uppercase email should treat it the same as lowercase', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const homePage = new HomePage(page);
  const name = generateRandomName();
  await registerPage.goto();

  const email = generateRandomEmail().toUpperCase();
  const password = generateRandomPassword();

  createdTestUser = { email: email };

  await registerPage.fillRegistrationForm({
    name: name,
    email,
    password,
    confirmPassword: password,
  });

  await registerPage.submit();

  const actualUsername = await homePage.getUsername();
  await expect(page).toHaveTitle('StankinShop');
  await expect(homePage.usernameLocator).toBeVisible(); 
  expect(actualUsername).toBe(name.toLowerCase().trim());

});



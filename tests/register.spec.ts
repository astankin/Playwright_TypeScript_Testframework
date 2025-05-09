// tests/register.spec.ts

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { generateRandomEmail, generateRandomPassword, generateRandomName, deleteUserFromDb } from '../utils/dataGenerator';
import * as testData from '../test-data/registerUsers.json';
import { HomePage } from '../pages/HomePage';


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

test('Register with short the 8 chars password should show validation error', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  const weakPassword = 'password'; // no special chars, numbers, etc.

  await registerPage.fillRegistrationForm({
    name: generateRandomName(),
    email: generateRandomEmail(),
    password: 'As8@',
    confirmPassword: 'As8@',
  });

  await registerPage.submit();

  const validationMessage = await registerPage.getInvalidPasswordErrorText();
  await expect(registerPage.invalidPasswordError).toBeVisible();
  expect(validationMessage).toBe('Password must be at least 8 characters long.');
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

test('Register with SQL injection in name should show validation error', async () => {
  await registerPage.goto();

  const sqlInjectionName = "' OR 1=1 --";
  const password = generateRandomPassword();
  const email = generateRandomEmail();

  createdTestUser = { email: email };

  await registerPage.fillRegistrationForm({
    name: sqlInjectionName,
    email: email,
    password,
    confirmPassword: password,
  });

  await registerPage.submit();

  await expect(registerPage.errorMessage).toBeVisible();
  // Optionally, check if the database was affected (e.g., check for any unexpected behavior)
});

test('Register with XSS script injection should be escaped', async () => {
  await registerPage.goto();

  const xssName = '<script>alert("XSS Attack")</script>';
  const xssEmail = '<img src="x" onerror="alert(\'XSS Attack\')" />';
  const password = generateRandomPassword();

  createdTestUser = { email: xssEmail };

  await registerPage.fillRegistrationForm({
    name: xssName,
    email: xssEmail,
    password,
    confirmPassword: password,
  });

  await registerPage.submit();

  await expect(registerPage.errorMessage).toBeVisible();
  // Ensure the input is sanitized/escaped in the UI and doesn't execute malicious scripts
});

test('Register with invalid email format should show validation error', async ({ page }) => {

  const password = generateRandomPassword();
  await registerPage.fillRegistrationForm({
    name: generateRandomName(),
    email: 'invalidemail@mail', // missing domain
    password,
    confirmPassword: password,
  });

  await registerPage.submit();

  const validationMessage = await registerPage.getInvalidEmailErrorText();
  expect(validationMessage).toBe("Please enter a valid email address.");
});

test('Register with Disposable email addresses are not allowed', async ({ page }) => { 
  const disposableDomains = [
    'mailinator.com', 
    'guerrillamail.com', 
    '10minutemail.com',
    'tempmail.com', 
    'trashmail.com', 
    'yopmail.com', 
    'getnada.com'
  ];
  for (const domain of disposableDomains) {
      const name = generateRandomName();
      const disposableEmail = `${generateRandomEmail(domain)}`;
      const password = generateRandomPassword();
      
      await registerPage.fillRegistrationForm({
        name, 
        email: disposableEmail,
        password,
        confirmPassword: password,
      });
      await registerPage.submit();
      const expectedErrorText: string = 'Disposable email addresses are not allowed.';
      await expect(registerPage.errorMessage).not.toHaveText('Loading...');
      // await expect(registerPage.emailError).toBeVisible();
      const actualErrorText: string = await registerPage.getInvalidEmailErrorText();
      expect(actualErrorText).toBe(expectedErrorText);
      expect(page.url()).toContain('/register');
      
      await registerPage.email.fill(''); // Clear the email field for the next iteration  
      await page.waitForTimeout(2000);

  }

});





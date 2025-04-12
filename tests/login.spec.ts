import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as testData from '../test-data/registerUsers.json';
import { HomePage } from '../pages/HomePage';


test('Login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.fillLoginForm({
        email: testData.existingUser.email,
        password: 'WrongPassword123!',
    });

    await loginPage.submit();

    const expectedErrorMessage = 'No active account found with the given credentials';

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toHaveText('Loading...');

    const actualErrorMessage = await loginPage.getErrorMessageText();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

test('Login with invalid email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  
    await loginPage.fillLoginForm({
      email: 'nonexistent@example.com',
      password: testData.existingUser.password,
    });
    await loginPage.submit();
    const expectedErrorMessage = 'No active account found with the given credentials';
  
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toHaveText('Loading...');
  
    const actualErrorMessage = await loginPage.getErrorMessageText();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
  });

test('Login with empty email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  
    await loginPage.submit();
  
    const expectedErrorMessage = 'Request failed with status code 400';
  
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toHaveText('Loading...');
  
    const actualErrorMessage = await loginPage.getErrorMessageText();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
  });

test('Login with only email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  
    await loginPage.email.fill(testData.existingUser.email);
    await loginPage.submit();
  
    const expectedErrorMessage = 'Request failed with status code 400';
  
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toHaveText('Loading...');
  
    const actualErrorMessage = await loginPage.getErrorMessageText();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
  });

test('Login with only password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.password.fill(testData.existingUser.password);
    await loginPage.submit();

    const expectedErrorMessage = 'Request failed with status code 400';

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toHaveText('Loading...');

    const actualErrorMessage = await loginPage.getErrorMessageText();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

test('Login with improperly formatted email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await loginPage.fillLoginForm({
        email: 'wrongformat@com',
        password: testData.existingUser.password,
    });
    await loginPage.submit();
    
    const expectedErrorMessage = 'No active account found with the given credentials';

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toHaveText('Loading...');

    const actualErrorMessage = await loginPage.getErrorMessageText();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
      
test('Login with SQL injection input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.fillLoginForm({
        email: "' OR '1'='1",
        password: "' OR '1'='1",
    });
    await loginPage.submit();

    const message = await loginPage.getEmailValidationMessage();
    expect(message).toContain("Please include an '@' in the email address");

    });
      
  
test('Login with XSS attack input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.fillLoginForm({
        email: '<script>alert("XSS")</script>',
        password: '<script>alert("XSS")</script>',
    });
    await loginPage.submit();

    const message = await loginPage.getEmailValidationMessage();
    expect(message).toContain("Please include an '@' in the email address");
});

test('Login and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    await loginPage.goto();
  
    await loginPage.fillLoginForm({
      email: testData.existingUser.email,
      password: testData.existingUser.password,
    });
    await loginPage.submit();

    await homePage.usernameLocator.click();
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(homePage.usernameLocator).not.toBeVisible();
    await expect(homePage.logInBtn).toBeVisible();

  });
  
  
  
  
  
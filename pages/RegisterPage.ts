import { Page, Locator, expect } from '@playwright/test';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
}

export class RegisterPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly telephone: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly subscribe: Locator;
  readonly privacyPolicy: Locator;
  readonly continueBtn: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#input-firstname');
    this.lastName = page.locator('#input-lastname');
    this.email = page.locator('#input-email');
    this.telephone = page.locator('#input-telephone');
    this.password = page.locator('#input-password');
    this.confirmPassword = page.locator('#input-confirm');
    this.subscribe = page.locator('//input[@name="newsletter" and @value="1"]');
    this.privacyPolicy = page.locator('//input[@name="agree"]');
    this.continueBtn = page.locator('input[value="Continue"]');
    this.alertMessage = page.locator('.alert.alert-danger.alert-dismissible');
  }

  async goto() {
    await this.page.goto(
      'https://naveenautomationlabs.com/opencart/index.php?route=account/register'
    );
  }

  async fillRegistrationForm({
    firstName,
    lastName,
    email,
    telephone,
    password,
  }: RegistrationData) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.telephone.fill(telephone);
    await this.password.fill(password);
    await this.confirmPassword.fill(password);
    await this.subscribe.check();
    await this.privacyPolicy.check();
  }

  async submit() {
    await this.continueBtn.click();
  }

  async expectAccountCreationSuccess() {
    await expect(this.page).toHaveTitle('Your Account Has Been Created!');
  }

  async getAlertMessageText(): Promise<string> {
    const text = await this.alertMessage.textContent();
    if (text === null) {
      throw new Error('Alert message is missing!');
    }
    return text.trim();
  }
}

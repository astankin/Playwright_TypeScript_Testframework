import { Page, Locator, expect } from '@playwright/test';

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class RegisterPage {
  readonly page: Page;
  readonly name: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly registerBtn: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('#name');
    this.email = page.locator('#email');
    this.password = page.locator('input[type="password"]#password');
    this.confirmPassword = page.locator('input[type="password"]#passwordConfirm');
    this.registerBtn = page.locator('//*[@id="root"]/main/div/div/div/div/form/button');
    this.alertMessage = page.locator('.alert.alert-danger.alert-dismissible');
  }

  async goto() {
    await this.page.goto(
      'http://127.0.0.1:8000/#/register?redirect=/'
    );
  }

  async fillRegistrationForm({
    name,
    email,
    password,
    confirmPassword,
  }: RegistrationData) {
    await this.name.fill(name);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.confirmPassword.fill(confirmPassword);
  
  }

  async submit() {
    await this.registerBtn.click();
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

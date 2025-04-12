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
  readonly errorMessage: Locator;
  readonly nameError: Locator;  
  readonly emailError: Locator; 
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;
  readonly invalidPasswordError: Locator;
  readonly mismatchPasswordError: Locator;


  constructor(page: Page) {
    this.page = page;
    this.name = this.page.locator('#name');
    this.email = this.page.locator('#email');
    this.password = this.page.locator('input[type="password"]#password');
    this.confirmPassword = this.page.locator('input[type="password"]#passwordConfirm');
    this.registerBtn = this.page.locator('//*[@id="root"]/main/div/div/div/div/form/button');
    this.alertMessage = this.page.locator('.alert.alert-danger.alert-dismissible');
    this.errorMessage = this.page.locator('//*[@id="root"]/main/div/div/div/div/div[1]');
    this.nameError = this.page.locator('#nameError');
    this.emailError = this.page.locator('#emailError');
    this.passwordError = this.page.locator('#passwordError');
    this.confirmPasswordError = this.page.locator('#confirmPasswordError');
    this.mismatchPasswordError = this.page.locator('//*[@id="root"]/main/div/div/div/div/form/div[4]/div[2]');
    this.invalidPasswordError = this.page.locator('//*[@id="root"]/main/div/div/div/div/form/div[3]/div[2]');
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

  async getErrorMessageText(): Promise<string> {
    const text = await this.errorMessage.textContent();
    if (text === null) {
      throw new Error('Error message is missing!');
    }
    return text.trim();
  }

  async getAlertMessageText(): Promise<string> {
    const text = await this.alertMessage.textContent();
    if (text === null) {
      throw new Error('Alert message is missing!');
    }
    return text.trim();
  }

  async getInvalidPasswordErrorText(): Promise<string> {
    const text = await this.invalidPasswordError.textContent();
    if (text === null) {
      throw new Error('Invalid password error message is missing!');
    }
    return text.trim();
  }
  async getMismatchPasswordErrorText(): Promise<string> {
    const text = await this.mismatchPasswordError.textContent();
    if (text === null) {
      throw new Error('Mismatch password error message is missing!');
    }
    return text.trim();
  }
}




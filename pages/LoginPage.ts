import { Page, Locator, expect } from '@playwright/test';
import * as testData from '../test-data/registerUsers.json';

export interface LoginData {
  email: string;
  password: string;
}

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly signInBtn: Locator;
  readonly registerBtn: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator('#email');
    this.password = page.locator('#password');
    this.signInBtn = page.locator('//*[@id="root"]/main/div/div/div/div/form/button');
    this.registerBtn = page.locator('//*[@id="root"]/main/div/div/div/div/div/div/a');
    this.errorMessage = page.locator('//*[@id="root"]/main/div/div/div/div/div[1]');
  }

  async goto() {
    await this.page.goto(testData.loginData.url);
  }

  async fillLoginForm({
    email,
    password,
  }: LoginData) {
    await this.email.fill(email);
    await this.password.fill(password);
  }

  async submit() {
    await this.signInBtn.click();
  }


  async getErrorMessageText(): Promise<string> {
    const text = await this.errorMessage.textContent();
    if (text === null) {
      throw new Error('Error message is missing!');
    }
    return text.trim();
  }

  async getEmailValidationMessage(): Promise<string> {
    return await this.email.evaluate((input: HTMLInputElement) => input.validationMessage);
  }
  
}

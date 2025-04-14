import { Page, Locator, expect } from '@playwright/test';
import * as testData from '../test-data/registerUsers.json';


export class HomePage {
  readonly page: Page;
  readonly usernameLocator: Locator;
  readonly logoutBtn: Locator;
  readonly logInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameLocator = page.locator('#username');
    this.logoutBtn = page.locator('a.dropdown-item', { hasText: 'Logout' });
    this.logInBtn = this.page.locator('a.nav-link', { hasText: 'Login' });
  }

  async goto() {
    await this.page.goto(testData.home_page.url);
  }

  async getUsername(): Promise<string> {
    const text = await this.usernameLocator.textContent();
    if (text === null) {
      throw new Error('Username message is missing!');
    }
    return text.toLowerCase().trim();
  }

  
}


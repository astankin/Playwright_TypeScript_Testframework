import {test, expect, Browser, Page, Locator} from '@playwright/test';
import {webkit, chromium, firefox} from 'playwright';

test('login test', async() => {
    const browser:Browser =  await chromium.launch({ headless: false, channel: 'chrome' });
    const page:Page = await browser.newPage();
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/login');

    const emailId:Locator = page.locator('#input-email');
    const password:Locator = page.locator('#input-password');
    const loginBtn:Locator = page.locator('input[value="Login"]');

    await emailId.fill("a_stankin@abv.bg");
    await password.fill("Astankin83@");
    await loginBtn.click();

    const title = await page.title();
    console.log("home page title: ", title)

    await page.screenshot({ path: 'screenshot.png' });

    expect(title).toEqual("My Account");

    browser.close();

});
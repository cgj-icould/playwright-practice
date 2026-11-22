import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }
async goto() {
  // 加上 waitUntil: 'domcontentloaded'（不等图片加载，骨架出来就走）
  // 加上 timeout: 60000（把超时时间拉长到 60 秒，给足外网面子）
  await this.page.goto('https://opensource-demo.orangehrmlive.com/', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
}

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    await this.waitForLoaderToDisappear(); // 继承自 BasePage
  }
}
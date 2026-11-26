import { Page, Locator, expect } from '@playwright/test';
import { PimPage } from './PimPage';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // 使用 placeholder 定位用户名和密码输入框
    // await page.getByRole('textbox',{ name: 'Username'}).fill('Admin');
    // await page.getByRole('textbox', { name: 'Password'}).fill('admin123');
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.passwordInput = this.page.getByPlaceholder('Password');
    // 登录按钮使用 getByRole 定位最准确
  
    this.loginButton = this.page.getByRole('button', { name: /login/i });
  }

  async goto() {
    // 循环重试 2 次
    for (let i = 0; i < 2; i++) {
        try {
            await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
                waitUntil: 'domcontentloaded',
                timeout: 45000 // 给 45 秒
            });
            // 如果能走到这里，说明没报错，直接跳出循环
            break; 
        } catch (error) {
            console.log(`第 ${i + 1} 次打开页面超时，准备重试...`);
            if (i === 1) throw error; // 如果最后一次还是失败，抛出错误
            // 失败后等 2 秒再重试
            await this.page.waitForTimeout(2000);
        }
    }
  }

  async login(user = 'Admin', pass = 'admin123') {
    await expect(this.usernameInput).toBeVisible({ timeout: 30000});
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}
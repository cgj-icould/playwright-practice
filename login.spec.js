const { test, expect } = require('@playwright/test');

test('测试电商网站搜索功能', async ({ page }) => {
  // 1. 打开测试专用的电商靶场
  await page.goto('https://www.saucedemo.com/');

  // 2. 输入用户名
  await page.locator('#user-name').fill('standard_user');

  // 3. 输入密码
  await page.locator('#password').fill('secret_sauce');

  // 4. 点击登录
  await page.locator('#login-button').click();

  // 5. 断言：检查页面右上角的标题，是不是变成了 "Products"（产品列表）
  await expect(page.locator('.title')).toHaveText('Products');
  await page.waitForTimeout(5000);
  
  console.log('恭喜！成功登录并进入了产品列表页！');
});
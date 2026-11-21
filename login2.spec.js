const { test, expect } = require('@playwright/test');

test('测试购物车与错误截图', async ({ page }) => {
  // 1. 登录
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // 2. 将第一个商品加入购物车 (Sauce Labs Backpack)
  // 找到第一个 "Add to cart" 按钮并点击
  await page.locator('.btn_inventory').first().click();

  // 3. 验证右上角购物车角标是不是变成了 "1"
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');
  console.log('✅ 成功添加商品到购物车！角标显示为 1');

  // 4. 【刻意制造错误】我们故意去检查一个根本不存在的商品名称
  // 真实的测试中，如果这里报错，Playwright 会自动截图！
//   const wrongItem = page.locator('.inventory_item_name');
//   await expect(wrongItem).toHaveText('这是一段故意写错的文字，用来触发报错！');
});
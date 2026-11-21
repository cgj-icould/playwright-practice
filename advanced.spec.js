const { test, expect } = require('@playwright/test');

// ==========================================
// 技能一：元素定位高级方法
// ==========================================
test('高级定位：用人类思维寻找元素', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.waitForTimeout(5000); // 停顿 2 秒，看看登录页
  
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.waitForTimeout(3000); // 停顿 1 秒，看看输入框填了啥
  
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await expect(page.getByText('Products')).toBeVisible();
  await page.waitForTimeout(5000); // 停顿 3 秒，欣赏一下登录成功的商品页
});


// ==========================================
// 技能二：测试框架进阶（beforeEach）
// ==========================================
test.describe('电商核心业务流程', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    // 在每次测试开始前，登录后停顿 1.5 秒
    await page.waitForTimeout(5000); 
  });

  test('添加商品到购物车', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    await page.waitForTimeout(5000); // 停顿 3 秒，看看购物车角标变成 1 了
  });

  test('验证商品排序功能', async ({ page }) => {
    await page.locator('.product_sort_container').selectOption('lohi');
    const firstPrice = page.locator('.inventory_item_price').first();
    await expect(firstPrice).toHaveText('$7.99');
    
    await page.waitForTimeout(5000); // 停顿 3 秒，看看第一个商品变成了最便宜的
  });
});


// ==========================================
// 技能三：视觉回归测试（截图对比）
// ==========================================
test('视觉测试：截图对比', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  
  await page.waitForTimeout(5000); // 停顿 2 秒，让你看清页面
  
  // 进行截图对比
  await expect(page).toHaveScreenshot('login-page.png', { maxDiffPixels: 100 });
  
  await page.waitForTimeout(5000); // 截图完再停 2 秒
});
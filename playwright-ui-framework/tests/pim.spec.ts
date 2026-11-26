import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';




test.describe('OrangeHRM 员工管理测试', () => {
  let loginPage: LoginPage;
  let pimPage: PimPage;
    // 全局登录，复用登录状态
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pimPage = new PimPage(page);
      await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await page.waitForURL('**/dashboard/index');
  });

  test('管理员能够成功添加新员工并查看到列表', async () => {
    const testFirstName = `Auto_${Date.now()}`;
    const testLastName = 'Test';
    await pimPage.sideMenu.goToPIM();
  // 1. 执行添加动作 (这行代码掩盖了背后几十行的点击和输入)
    await pimPage.addEmployee(testFirstName, testLastName);
  // 2. 验证成功页面 
    await pimPage.page.waitForURL('**/viewPersonalDetails/**');
  // 3. 回到列表页验证数据是否真的存在（测试数据闭环）
    await pimPage.sideMenu.goToPIM();
    const searchInput = pimPage.page.getByRole('textbox',{name:'Type for hints...'}).first();
    await searchInput.fill(`${testFirstName} ${testLastName}`);
    await searchInput.press('Enter');
    const newRow = pimPage.getEmployeeRow(`${testFirstName} ${testLastName}`);
    
    await pimPage.page.waitForSelector('.oxd-table-loader',{state:'hidden',timeout:15000});
    await expect(newRow).toBeVisible({ timeout: 15000});
  });
});
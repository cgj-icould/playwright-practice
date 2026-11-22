import { Page } from '@playwright/test';
import { SideMenu } from '../components/SideMenu';

export class BasePage {
  readonly page: Page;
  readonly sideMenu: SideMenu;

  constructor(page: Page) {
    this.page = page;
    this.sideMenu = new SideMenu(page);
  }

  // 比如通用的加载遮罩层等待（企业系统常见的痛点）
  async waitForLoaderToDisappear() {
    const loader = this.page.locator('.oxd-loading-spinner');
    if (await loader.isVisible()) {
      await loader.waitFor({ state: 'hidden' });
    }
  }
}
import { Page, Locator } from '@playwright/test';

export class SideMenu {
  readonly page: Page;
  readonly pimMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    // 使用 Playwright 推荐的角色定位
    this.pimMenu = page.getByRole('link', { name: 'PIM' });
  }

  async goToPIM() {
    await this.pimMenu.click();
  }
}
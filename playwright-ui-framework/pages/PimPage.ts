import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;
  readonly employeeListTable: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeButton = page.getByRole('button', { name: 'Add' });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    // 针对复杂表单的提交按钮
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    this.employeeListTable = page.locator('.oxd-table-body');
  }

  async addEmployee(firstName:string,lastName:string) {
    await this.addEmployeeButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  // 难点：这里的保存按钮可能需要等待 DOM 渲染
    await this.saveButton.click();
  }
// 封装针对表格数据的断言方法（高级技巧）
  getEmployeeRow(name: string) {
    return this.employeeListTable.getByRole('row').filter({ hasText: name });
  }
}
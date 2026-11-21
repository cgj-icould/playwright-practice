const { test, expect } = require('@playwright/test');
const fs = require('fs'); // 引入文件系统模块

test('抓取新闻并保存为 CSV 文件', async ({ page }) => {
  await page.goto('https://news.baidu.com/');
  const newsLinks = page.locator('a[title]');
  const count = await newsLinks.count();
  const loopCount = count < 10 ? count : 10;

  // 准备一个空数组，用来存所有数据
  let csvData = '新闻标题,新闻链接\n'; // 这是 Excel 的表头

  for (let i = 0; i < loopCount; i++) {
    const element = newsLinks.nth(i);
    const title = await element.innerText();
    const link = await element.getAttribute('href');

    // 将标题和链接拼成一行，用逗号隔开，并加上换行符
    csvData += `"${title}","${link}"\n`;
  }

  // 把拼好的数据写进当前文件夹下的 news.csv 文件里
  fs.writeFileSync('news.csv', csvData, 'utf8');
  
  console.log('数据已成功保存到 news.csv 文件中！');
});
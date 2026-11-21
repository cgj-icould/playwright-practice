const { test, expect } = require('@playwright/test');

// ==========================================
// 技能一：多页面（多标签页）切换
// ==========================================
test('多页面切换：启动本地服务器的终极版', async ({ page, context }) => {
  // 1. 用 `http://localhost:3000` 这种方式启动。Playwright 会自动把你当前的文件夹变成服务器
  // 注意：因为咱们没有真的开服务器，这里我们用百度来代替，但用更聪明的"事件监听"方式
  await page.goto('https://www.baidu.com/');
  
  // 2. 为了测试多页面，我们在当前页面用 JS 强行开一个新窗口！
  // 这一招叫"降维打击"，不依赖网页里的链接，直接让浏览器弹新窗口。
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    // 用 evaluate 在浏览器里执行一段 JavaScript，强行开个新页面，并给它一个标题
    page.evaluate(() => {
      const newWin = window.open('', '_blank');
      newWin.document.write('<h1>我是用代码强制弹出的新页面</h1>');
      newWin.document.title = '新窗口页面';
      newWin.document.close(); // 写完要关掉文档流
    })
  ]);

  // 3. 等待新页面加载完成
  await newPage.waitForLoadState();
  
  // 4. 停顿3秒让你看清楚两个标签页
  await page.waitForTimeout(3000);
  
  // 5. 直接去新页面抓 h1 文本
  const text = await newPage.locator('h1').innerText();
  console.log('新页面显示的文字是：', text);
  
  // 6. 断言
  expect(text).toBe('我是用代码强制弹出的新页面');
  
  // 7. 关掉新页面，切回原来的页面
  await newPage.close();
});

// ==========================================
// 技能二：接口测试（不打开网页，直接发请求）
// ==========================================
test('接口测试：不打开浏览器直接请求数据', async ({ request }) => {
  // 注意：这里的参数是 request，而不是 page。这是专门用来发网络请求的
  
  // 1. 发送 GET 请求获取一篇文章信息
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  
  // 2. 断言：检查 HTTP 状态码是不是 200（代表成功）
  expect(response.status()).toBe(200);
  
  // 3. 把返回的 JSON 数据解析出来
  const body = await response.json();
  console.log('接口返回的数据是：', body);
  
  // 4. 断言：检查返回的数据里，userId 是不是 1
  expect(body.userId).toBe(1);
  expect(body.title).toContain('sunt');
});
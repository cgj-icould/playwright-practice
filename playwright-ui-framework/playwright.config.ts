import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL:'https://opensource-demo.orangehrmlive.com',
    actionTimeout: 15000,
    // 关键1：打开 trace 全程录制，失败后能看到完整网络瀑布图
    trace: 'retain-on-failure',
    // 关键2：先关无头，肉眼观察浏览器到底卡在哪一步
    headless: process.env.CI ? true : false,
    
    // 关键3：如果配了代理就取消注释，端口换成你自己的
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: [
        '--ignore-certificate-errors',
        // '--proxy-server=http://127.0.0.1:26561'
      ]
    },
    //  
    },
    
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // channel: 'chrome', // ✨ 关键：指定使用本地的 Chrome
      },
    },
  ],
});
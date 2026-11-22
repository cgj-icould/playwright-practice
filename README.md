项目架构：orangehrm-test/
│
├── pages/                  <-- 页面对象
│   ├── BasePage.ts         <-- 基础页 (封装通用等待、菜单导航)
│   ├── LoginPage.ts        <-- 登录页
│   └── PimPage.ts          <-- 员工信息管理页 (核心业务)
│
├── components/             <-- 可复用组件
│   └── SideMenu.ts         <-- 左侧导航栏 (每个页面都有，单独抽离)
│
├── tests/                  <-- 测试用例
│   ├── login.spec.ts
│   └── pim.spec.ts
│
├── playwright.config.ts
└── package.json

如何运行（npm install,npm playwright test）
使用的技术栈（TypeScript,Playwright,POM设计模式）
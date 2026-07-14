# Emma's Growth Portfolio

一个用于记录Emma在AI时代成长历程的个人成长Portfolio网站，展示真实世界经历、思考和反思。

## 项目简介

本项目是Emma的个人成长Portfolio网站，用于记录成长历程。网站遵循"第一阶段（现在｜9岁）建立成长观察"的设计理念，通过三个核心板块记录真实成长历程。

### 主要功能

#### 三大核心板块
- **Real World Experiences（真实世界经历）**：公益活动、科学馆、城市探索、AI体验、社会观察
- **Questions I'm Thinking About（正在思考的问题）**：genuine curiosity - 真实好奇心
- **Reflection Journal（成长反思）**：简短的成长感悟记录

#### 完整CRUD功能
- **创建**：为每个板块添加新记录
- **编辑**：修改现有记录内容
- **删除**：删除记录（带确认提示）
- **查看**：详情页面展示完整内容

#### 数据管理
- **云端同步**：Supabase云端数据库，跨设备同步
- **图片存储**：Supabase Storage图片托管，CDN加速
- **照片展示**：支持活动照片上传和展示

#### 精美设计
- **差异化配色**：每个板块独特的视觉风格
- **动画效果**：流畅的交互和过渡动画
- **响应式布局**：适配各种屏幕尺寸
- **双语支持**：中文/英文切换

## 使用模式

### 👀 只查看模式（默认）

直接访问网站即可浏览所有内容，无需特殊操作：

**访问地址**：https://russiamsun.github.io/personal-growth-timeline/

- 查看所有活动、问题和反思
- 浏览时光轴和统计信息
- 查看活动详情

在此模式下，所有编辑按钮（创建、编辑、删除）都会被隐藏，防止误操作。

### ✏️ 编辑模式

需要进行数据编辑时，使用特殊的编辑URL：

**编辑地址**：https://russiamsun.github.io/personal-growth-timeline/?edit=emma2024

进入编辑模式后：
- 显示所有创建/编辑/删除按钮
- 可以添加新的活动、问题、反思
- 可以编辑和删除现有记录
- 可以上传和裁剪照片

**注意**：
- 编辑模式在当前浏览器会话内有效
- 关闭浏览器后需要重新输入编辑URL
- 请妥善保管编辑链接，不要泄露给他人

## 技术栈

### 前端框架
- **React 18** - 现代化的前端框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 快速的构建工具

### UI 与样式
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Framer Motion** - React 动画库
- **Lucide React** - 精美的图标库

### 数据管理
- **React Context** - DataContext统一数据管理
- **Supabase** - 云端数据库和图片存储
- **React Router DOM** - 前端路由管理

### 监控与安全
- **Sentry** - 错误监控和追踪
- **DOMPurify** - XSS安全防护

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/personal-growth-timeline/

### 构建生产版本

```bash
npm run build
```

### 类型检查

```bash
npx tsc --noEmit
```

## 项目结构

```
├── public/              # 静态资源
├── src/                # 源代码目录
│   ├── components/     # 可复用组件
│   │   ├── common/     # 通用组件（Toast、ConfirmDialog等）
│   │   ├── forms/      # 表单组件
│   │   ├── editor/     # 编辑器组件
│   │   └── layout/     # 布局组件
│   ├── pages/          # 页面组件
│   ├── contexts/       # Context数据管理
│   ├── hooks/          # 自定义Hooks
│   ├── services/       # 服务层（Storage、导出等）
│   ├── utils/          # 工具函数
│   └── types/          # TypeScript类型定义
├── CHANGELOG.md        # 更新日志
├── package.json        # 项目配置
├── tailwind.config.js  # Tailwind配置
├── tsconfig.json       # TypeScript配置
└── vite.config.ts      # Vite配置
```

## 核心设计理念

遵循"第一阶段（现在｜9岁）建立成长观察"的设计理念：

- **不复杂**：只保留三个核心栏目
- **真实**：每个栏目都承载真实的好奇心、真实的成长、真实的反思
- **专业**：简洁专业的设计风格，去除内部指导性文字
- **差异化**：每个板块独特的设计风格

## 开发环境要求

- Node.js 18+
- npm 或 yarn

## 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)

### 最新版本 (v1.8.1)
- 图片上传优化：快速压缩上传
- 移除水印和进度显示，简化流程
- 保持裁剪功能
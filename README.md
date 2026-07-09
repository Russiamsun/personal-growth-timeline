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
- **自动同步**：新增活动自动出现在时光轴
- **数据持久化**：localStorage存储，刷新不丢失
- **照片展示**：支持活动照片展示（当前使用占位图片）

#### 精美设计
- **差异化配色**：每个板块独特的视觉风格
- **动画效果**：流畅的交互和过渡动画
- **响应式布局**：适配各种屏幕尺寸

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
- **localStorage** - 本地数据持久化
- **React Router DOM** - 前端路由管理

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
│   ├── components/     # 可复用组件（Header等）
│   ├── pages/          # 页面组件
│   │   ├── Home.tsx              # 首页
│   │   ├── ExperiencesPage.tsx   # 真实世界经历
│   │   ├── QuestionsPage.tsx     # 正在思考的问题
│   │   ├── ReflectionPage.tsx    # 成长反思
│   │   ├── TimelinePage.tsx      # 时光轴
│   │   ├── ActivityDetailPage.tsx # 活动详情
│   │   ├── CreateActivityPage.tsx # 创建活动
│   │   ├── EditActivityPage.tsx   # 编辑活动
│   │   ├── CreateQuestionPage.tsx # 创建问题
│   │   ├── EditQuestionPage.tsx   # 编辑问题
│   │   ├── CreateReflectionPage.tsx # 创建反思
│   │   └── EditReflectionPage.tsx   # 编辑反思
│   ├── contexts/       # DataContext数据管理
│   ├── data/           # 初始数据
│   ├── lib/            # 工具函数
│   └── types/          # TypeScript类型定义
├── 灵's Future Human Portfolio 网站设计理念.md  # 设计理念文档
├── 公益活动 - 科学中心.md   # 活动内容文档
├── 公益活动 - 6.1珠江游轮.md # 活动内容文档
├── 需求文档.md          # 项目需求
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

## 后续改进计划

- 添加真实照片上传功能
- 支持更多活动类型
- 完善移动端体验
- 添加数据导出功能
# Supabase 云端数据库配置指南

> 更新时间：2026-07-10
> 版本：v2.0（三表结构）

---

## 📋 快速配置清单

配置Supabase云端数据库只需以下5步：

- [ ] 1. 创建Supabase项目
- [ ] 2. 执行数据库SQL脚本（创建三张表）
- [ ] 3. 获取API密钥并配置本地环境变量
- [ ] 4. 配置GitHub Secrets（生产环境必需）
- [ ] 5. 导入初始数据

---

## 一、创建Supabase项目

### 1. 注册账号

访问 [https://supabase.com](https://supabase.com)，点击"Start your project"。

- 推荐使用GitHub账号直接登录
- 或使用Email注册

### 2. 创建新项目

点击"New Project"创建项目：

- **项目名称**: `personal-growth-timeline`（或任意名称）
- **数据库密码**: 自动生成或自定义8位以上密码
- **区域**: 选择 **Northeast Asia (Tokyo)** 或 **Southeast Asia (Singapore)**（离中国最近）
- **定价计划**: Free（免费版）

点击"Create new project"，等待约2分钟完成创建。

---

## 二、创建数据库表（三张表）

### 1. 进入SQL Editor

在Supabase Dashboard中：
- 左侧菜单点击 **"SQL Editor"**
- 点击右上角 **"New Query"**

### 2. 执行建表SQL脚本

复制并执行以下完整SQL脚本：

```sql
-- ============================================
-- 个人成长网站数据库初始化脚本
-- ============================================

-- 1. 真实世界经历表（activities）
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  content_zh TEXT,
  content_en TEXT,
  date TEXT NOT NULL,
  location_zh TEXT,
  location_en TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  tags_zh JSONB DEFAULT '[]'::jsonb,
  tags_en JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 正在思考的问题表（questions）
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  question_zh TEXT NOT NULL,
  question_en TEXT NOT NULL,
  thoughts_zh TEXT,
  thoughts_en TEXT,
  date TEXT NOT NULL,
  tags_zh JSONB DEFAULT '[]'::jsonb,
  tags_en JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 成长反思表（reflections）
CREATE TABLE reflections (
  id TEXT PRIMARY KEY,
  content_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  date TEXT NOT NULL,
  tags_zh JSONB DEFAULT '[]'::jsonb,
  tags_en JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引加速查询
CREATE INDEX idx_activities_date ON activities(date DESC);
CREATE INDEX idx_questions_date ON questions(date DESC);
CREATE INDEX idx_reflections_date ON reflections(date DESC);

-- 启用RLS (Row Level Security)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取（Portfolio公开访问）
CREATE POLICY "Allow public read access" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON reflections FOR SELECT USING (true);

-- 允许匿名写入（单用户模式）
CREATE POLICY "Allow public write access" ON activities FOR ALL USING (true);
CREATE POLICY "Allow public write access" ON questions FOR ALL USING (true);
CREATE POLICY "Allow public write access" ON reflections FOR ALL USING (true);
```

### 3. 验证表创建成功

执行完成后，左侧菜单点击 **"Table Editor"**，应该看到：
- `activities` ✅
- `questions` ✅
- `reflections` ✅

---

## 三、获取API密钥

### 1. 查找配置信息

在Supabase Dashboard中：
- 左侧菜单点击 **"Settings"**（齿轮图标）
- 点击 **"API"** 标签

### 2. 复制关键信息

你需要复制两个值：

1. **Project URL**: 格式为 `https://你的项目ID.supabase.co`
2. **anon public key**: 以 `eyJ` 开头的长字符串（约100字符）

**⚠️ 注意**：
- 不要使用 `sb_publishable_` 开头的key，那是publishable key
- 必须使用 **anon public key**（JWT格式，以eyJ开头）

---

## 四、配置环境变量

### 本地开发环境

编辑项目根目录下的 `.env.local` 文件：

```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_DATA_SOURCE=supabase
```

**⚠️ 重要**：
- `.env.local` 文件不会被提交到GitHub（已在.gitignore中）
- 本地开发时，配置完重启开发服务器即可生效

### GitHub生产环境（必须配置）

由于 `.env.local` 不提交，生产环境需要配置GitHub Secrets。

#### 配置步骤：

1. 访问：https://github.com/Russiamsun/personal-growth-timeline/settings/secrets/actions
2. 点击 **"New repository secret"**
3. 添加以下三个Secrets：

| Secret名称 | Secret值 |
|-----------|---------|
| `VITE_SUPABASE_URL` | `https://你的项目ID.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_DATA_SOURCE` | `supabase` |

#### 配置完成后：

1. 访问：https://github.com/Russiamsun/personal-growth-timeline/actions
2. 找到最新的workflow
3. 点击右上角 **"Re-run all jobs"** 重新构建

---

## 五、导入初始数据

### 1. 执行数据导入脚本

在Supabase SQL Editor中执行：

文件位置：`supabase-import-data.sql`

或复制以下SQL：

```sql
-- 插入活动数据（2条）
-- 插入问题数据（5条）
-- 插入反思数据（7条）
```

### 2. 验证数据导入成功

在Supabase Dashboard的Table Editor中查看：
- `activities` 表应有 **2条记录**
- `questions` 表应有 **5条记录**
- `reflections` 表应有 **7条记录**

---

## 六、验证部署成功

### 1. 本地测试

启动开发服务器：
```bash
npm run dev
```

打开浏览器访问本地地址，按 `F12` 打开Console：

**成功标志**：
```
✅ [Supabase] 数据加载成功: 2个活动, 5个问题, 7个反思
```

**失败标志**：
```
❌ [LocalStorage] 数据加载成功...
```

### 2. 生产环境测试

访问：https://russiamsun.github.io/personal-growth-timeline/

**成功标志**：
- Console显示 `[Supabase] 数据加载成功`
- 用户A创建数据，用户B刷新页面能看到 ✅
- 跨设备访问能看到相同数据 ✅

---

## 七、技术实现说明

### 数据流程

```
用户操作 → DataContext（async）
           ↓
    判断isSupabaseConfigured()
           ↓
    ✅ YES → Supabase API → 云端数据库
           ↓
    ❌ NO  → localStorage → 本地存储（自动降级）
```

### 关键特性

1. **双模式切换**：支持localStorage + Supabase
2. **自动降级**：Supabase失败时自动回退localStorage
3. **乐观更新**：UI立即响应，失败时回滚
4. **版本管理**：v4数据格式，自动迁移旧数据
5. **字段映射**：JSON → SQL字段名（titleZh → title_zh）

### 安全性说明

**anon key安全性**：
- anon key是公开密钥，设计为可在前端使用
- 安全性依赖于RLS策略
- service_role key绝不在前端使用

**当前RLS策略**：
- 公开读取（适合Portfolio展示）
- 公开写入（单用户模式）
- 如需多用户支持，需启用Supabase Auth

---

## 八、常见问题

### Q1: 生产环境显示localStorage？

**原因**：GitHub Secrets未配置或配置错误

**解决**：
1. 确认三个Secrets名称完全一致（大小写）
2. 确认使用的是anon key（eyJ开头），不是publishable key
3. 重新触发GitHub Actions构建

### Q2: 数据无法创建？

**原因**：Supabase表未创建或RLS策略未设置

**解决**：
1. 在Table Editor确认三张表存在
2. 重新执行建表SQL脚本（包含RLS策略）

### Q3: 如何切换回localStorage？

**方法1**：修改 `.env.local`
```env
VITE_DATA_SOURCE=localStorage
```

**方法2**：删除Supabase配置
```env
# 删除或清空以下配置
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 九、Supabase免费额度

| 项目 | 免费额度 | 个人使用评估 |
|------|---------|-------------|
| 数据库存储 | 500MB | 足够存储数千条记录 |
| 文件存储 | 1GB | 可存储图片等资源 |
| 月带宽 | 5GB | 足够个人Portfolio访问 |
| API请求 | 无限制 | 免费版无限制 |

**监控使用情况**：
- Dashboard → Settings → Usage
- 可设置使用限制提醒

---

## 十、相关文件

| 文件 | 说明 |
|------|------|
| `src/lib/supabase.ts` | Supabase客户端初始化 |
| `src/contexts/DataContext.tsx` | 数据上下文（双模式） |
| `.github/workflows/deploy.yml` | GitHub Actions配置（注入环境变量） |
| `supabase-import-data.sql` | 数据导入脚本 |
| `.env.local` | 本地环境变量（不提交） |

---

## ✅ 配置完成检查清单

- [ ] Supabase项目已创建
- [ ] 三张表已创建（activities、questions、reflections）
- [ ] RLS策略已正确设置
- [ ] `.env.local`已配置本地开发
- [ ] GitHub Secrets已配置（三个）
- [ ] GitHub Actions已重新构建
- [ ] 本地测试Console显示 `[Supabase]`
- [ ] 生产环境Console显示 `[Supabase]`
- [ ] 数据跨用户同步成功

恭喜！您已成功将应用迁移到Supabase云端数据库。🎉
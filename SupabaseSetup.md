# Supabase 数据库设置指南

本指南将帮助您将个人成长网站应用从localStorage迁移到Supabase云端数据库，支持多用户数据管理。

## 📋 目录

1. [准备工作](#准备工作)
2. [创建Supabase项目](#创建supabase项目)
3. [配置数据库表](#配置数据库表)
4. [获取API密钥](#获取api密钥)
5. [配置应用](#配置应用)
6. [迁移现有数据](#迁移现有数据)
7. [测试验证](#测试验证)
8. [常见问题](#常见问题)

---

## 准备工作

### 1. 注册Supabase账号

访问 [https://supabase.com](https://supabase.com)，点击"Start your project"注册账号。

- 可以使用GitHub账号直接登录
- 或使用Email注册

### 2. 创建新项目

登录后，点击"New Project"创建新项目：

- **项目名称**: 个人成长网站（或您喜欢的名称）
- **数据库密码**: 设置一个强密码（请记住，后续无法查看）
- **区域**: 选择离您最近的区域（如Singapore - Southeast Asia）
- **定价计划**: Free（免费版足够个人使用）

点击"Create new project"，等待约2分钟完成创建。

---

## 配置数据库表

### 1. 进入SQL编辑器

在Supabase Dashboard中：
- 点击左侧菜单的"SQL Editor"
- 点击"New query"创建新查询

### 2. 执行建表SQL

复制以下SQL代码并粘贴到编辑器中，然后点击"Run"执行：

```sql
-- 创建records表
CREATE TABLE records (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  recordDate TEXT NOT NULL,
  mood TEXT,
  theme TEXT,
  location TEXT,
  tags TEXT[] DEFAULT '{}',
  photos JSONB DEFAULT '[]',
  year INTEGER,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX idx_records_date ON records(recordDate DESC);
CREATE INDEX idx_records_year ON records(year);
CREATE INDEX idx_records_theme ON records(theme);

-- 设置Row Level Security (RLS)
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有用户读取所有记录（公开阅读）
CREATE POLICY "Public read access" ON records
  FOR SELECT
  USING (true);

-- 创建策略：允许所有用户插入记录
CREATE POLICY "Public insert access" ON records
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：允许所有用户更新记录
CREATE POLICY "Public update access" ON records
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 创建策略：允许所有用户删除记录
CREATE POLICY "Public delete access" ON records
  FOR DELETE
  USING (true);
```

**说明**：
- 表结构完全匹配应用的`TimeRecord`接口
- 创建了索引以提高查询性能
- RLS策略设置为公开访问（适合个人博客类应用）

---

## 获取API密钥

### 1. 查找项目URL和API密钥

在Supabase Dashboard中：
- 点击左侧菜单的"Settings"（齿轮图标）
- 点击"API"

您会看到两个重要信息：

1. **Project URL**: 格式为 `https://xxxxxx.supabase.co`
2. **anon public key**: 一个很长的字符串

### 2. 复制这两个值

请复制这两个值，下一步需要用到。

---

## 配置应用

### 1. 编辑环境变量文件

打开项目根目录下的 `.env.local` 文件：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

替换为您的实际值：

```env
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 保存文件

保存 `.env.local` 文件。

### 3. 重启开发服务器

如果开发服务器正在运行，请重启：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

---

## 迁移现有数据

如果您在localStorage中有现有数据，可以使用以下方法迁移到Supabase：

### 方法1：使用浏览器开发者工具

1. 打开浏览器开发者工具（F12）
2. 切换到"Console"标签
3. 执行以下代码：

```javascript
// 获取localStorage中的数据
const records = JSON.parse(localStorage.getItem('time-records') || '[]');
console.log('找到记录数:', records.length);

// 转换格式
const supabaseRecords = records.map(r => ({
  id: r.id,
  title: r.title,
  content: r.content,
  recordDate: r.recordDate,
  mood: r.mood,
  theme: r.theme,
  location: r.location,
  tags: r.tags,
  photos: JSON.stringify(r.photos),
  year: r.year,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
}));

console.log('转换后的数据:', supabaseRecords);
console.log('请复制以上数据，然后使用Supabase Dashboard的Table Editor手动导入');
```

### 方法2：手动导入

在Supabase Dashboard中：
1. 点击左侧菜单的"Table Editor"
2. 选择"records"表
3. 点击右上角的"Insert"按钮
4. 手动添加您的记录

---

## 测试验证

### 1. 检查数据加载

打开应用，检查：
- 首页是否能正常显示记录
- Timeline页面是否正常显示
- 是否能创建新记录
- 是否能编辑和删除记录

### 2. 检查Supabase Dashboard

在Supabase Dashboard中：
- 点击左侧菜单的"Table Editor"
- 选择"records"表
- 查看是否有数据记录

### 3. 检查控制台

打开浏览器开发者工具，检查Console是否有错误信息：
- 如果看到Supabase相关的错误，请检查`.env.local`配置
- 如果看到网络错误，请检查网络连接

---

## 常见问题

### Q1: 为什么看不到数据？

**可能原因**：
1. Supabase配置未正确设置
2. 数据库表未创建或表名不匹配
3. RLS策略限制访问

**解决方法**：
1. 检查`.env.local`文件中的URL和Key是否正确
2. 在Supabase Dashboard中确认`records`表已创建
3. 确认RLS策略已正确设置

### Q2: 如何启用多用户支持？

当前配置是公开访问模式（适合个人博客）。要支持多用户，需要：

1. 启用Supabase Auth认证
2. 修改RLS策略，限制用户只能访问自己的数据

修改RLS策略示例：

```sql
-- 禁用公开访问
DROP POLICY "Public read access" ON records;
DROP POLICY "Public insert access" ON records;
DROP POLICY "Public update access" ON records;
DROP POLICY "Public delete access" ON records;

-- 添加user_id字段
ALTER TABLE records ADD COLUMN user_id UUID REFERENCES auth.users;

-- 创建用户专属策略
CREATE POLICY "Users can read own records" ON records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON records
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON records
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Q3: 如何备份数据？

在Supabase Dashboard中：
1. 点击左侧菜单的"Database"
2. 点击"Backups"
3. 设置自动备份计划

### Q4: 如何切换回localStorage？

如果您想切换回使用localStorage：

1. 删除或清空`.env.local`文件中的Supabase配置
2. 或者在浏览器Console中执行：

```javascript
localStorage.setItem('use-supabase', 'false');
location.reload();
```

### Q5: 如何从Supabase导出数据？

在Supabase Dashboard中：
1. 点击左侧菜单的"Table Editor"
2. 选择"records"表
3. 点击右上角的"Download"按钮
4. 选择CSV或JSON格式下载

---

## 📊 性能优化建议

1. **索引优化**: 已创建日期和年份索引，提高查询性能
2. **数据分页**: 对于大量数据，建议实现分页功能
3. **缓存策略**: 可以使用React Query等库优化数据缓存

---

## 🔐 安全性说明

当前配置使用anon key，这是公开密钥，安全性依赖于RLS策略：

- **anon key**: 可以公开分享，前端使用
- **service_role key**: 秘密密钥，仅后端使用（请勿泄露）

如果您需要更高的安全性，请启用Supabase Auth并修改RLS策略。

---

## 💡 提示

1. Supabase免费版限制：
   - 500MB数据库存储
   - 1GB文件存储
   - 每月5GB带宽
   - 对于个人博客完全足够

2. 监控使用情况：
   - 在Dashboard中查看Usage统计
   - 设置使用限制提醒

3. 获取帮助：
   - Supabase文档: https://supabase.com/docs
   - Supabase Discord社区: https://discord.supabase.com

---

## ✅ 完成检查清单

设置完成后，请检查：

- [ ] Supabase项目已创建
- [ ] `records`表已创建并包含正确字段
- [ ] RLS策略已正确设置
- [ ] `.env.local`文件已正确配置
- [ ] 开发服务器已重启
- [ ] 应用能正常加载数据
- [ ] 能创建、编辑、删除记录
- [ ] 数据在Supabase Dashboard中可见

恭喜！您已成功将应用迁移到Supabase云端数据库。🎉
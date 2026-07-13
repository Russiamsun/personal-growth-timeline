# 项目更新日志 (CHANGELOG)

## v1.2.0 - Supabase云端数据库实现 (2026-07-10)

### 🎯 核心更新

**重大突破：解决数据无法跨用户/跨设备同步的根本问题**

从localStorage本地存储迁移到Supabase云端数据库，实现真正的数据持久化和跨用户同步。

---

### 📊 更新统计

- **新增文件**：2个
- **修改文件**：10个
- **新增数据库表**：3个（activities、questions、reflections）
- **数据迁移**：14条记录（2活动、5问题、7反思）

---

### 一、新增文件清单

| 文件名 | 功能说明 |
|--------|----------|
| `supabase-import-data.sql` | 数据导入SQL脚本，包含完整的初始数据（14条记录） |
| `.env.local` | 本地环境变量配置文件（Supabase URL和Key） |

---

### 二、修改文件清单

#### 1. 核心数据层

| 文件 | 改动内容 |
|------|----------|
| `src/contexts/DataContext.tsx` | 全面重构：支持localStorage + Supabase双模式，所有CRUD改为async，添加数据迁移和版本管理（v3→v4） |
| `src/lib/supabase.ts` | 新增Supabase客户端初始化，环境变量验证，配置有效性检查 |

#### 2. 创建/编辑页面（6个）

| 文件 | 改动内容 |
|------|----------|
| `src/pages/CreateActivityPage.tsx` | handleSubmit改为async，修正await调用 |
| `src/pages/EditActivityPage.tsx` | handleSubmit改为async，修正await调用 |
| `src/pages/CreateQuestionPage.tsx` | handleSubmit改为async，修正await调用 |
| `src/pages/EditQuestionPage.tsx` | handleSubmit改为async，修正await调用 |
| `src/pages/CreateReflectionPage.tsx` | handleSubmit改为async，修正await调用 |
| `src/pages/EditReflectionPage.tsx` | handleSubmit改为async，修正await调用 |

#### 3. 列表页面删除操作（3个）

| 文件 | 改动内容 |
|------|----------|
| `src/pages/ExperiencesPage.tsx` | handleDelete添加错误处理，修正async调用 |
| `src/pages/QuestionsPage.tsx` | handleDelete添加错误处理，修正async调用 |
| `src/pages/ReflectionPage.tsx` | handleDelete添加错误处理，修正async调用 |

#### 4. GitHub Actions配置

| 文件 | 改动内容 |
|------|----------|
| `.github/workflows/deploy.yml` | Build步骤添加环境变量注入，解决生产环境无法连接Supabase的问题 |

---

### 三、数据库结构设计

#### activities表（真实世界经历）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 |
| type | TEXT | 活动类型 |
| title_zh, title_en | TEXT | 双语标题 |
| description_zh, description_en | TEXT | 双语描述 |
| content_zh, content_en | TEXT | 双语内容 |
| date | TEXT | 日期 |
| location_zh, location_en | TEXT | 双语地点 |
| photos | JSONB | 图片数组 |
| tags_zh, tags_en | JSONB | 双语标签数组 |
| created_at, updated_at | TIMESTAMPTZ | 时间戳 |

#### questions表（正在思考的问题）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 |
| question_zh, question_en | TEXT | 双语问题内容 |
| thoughts_zh, thoughts_en | TEXT | 双语思考 |
| date | TEXT | 日期 |
| tags_zh, tags_en | JSONB | 双语标签数组 |
| created_at, updated_at | TIMESTAMPTZ | 时间戳 |

#### reflections表（成长反思）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 |
| content_zh, content_en | TEXT | 双语反思内容 |
| date | TEXT | 日期 |
| tags_zh, tags_en | JSONB | 双语标签数组 |
| created_at, updated_at | TIMESTAMPTZ | 时间戳 |

---

### 四、技术实现亮点

#### 1. 双模式切换机制

```typescript
// DataContext自动判断使用哪种数据源
if (isSupabaseConfigured()) {
  // Supabase云端数据库
  await supabase.from('activities').select('*');
} else {
  // localStorage本地存储（自动降级）
  localStorage.getItem(STORAGE_KEY);
}
```

#### 2. 自动降级策略

- Supabase连接失败时自动回退localStorage
- 用户体验无缝衔接，不会因云端故障影响使用
- Console日志清晰显示当前模式：`[Supabase]` 或 `[LocalStorage]`

#### 3. 乐观更新（Optimistic Update）

```typescript
// UI立即响应，用户无感知延迟
setActivities(prev => [...prev, newActivity]);

// 异步同步到云端，失败时回滚
try {
  await supabase.from('activities').insert(activityData);
} catch (error) {
  // 回滚UI状态
  setActivities(prev => prev.filter(a => a.id !== id));
}
```

#### 4. 字段名映射

- JSON格式（前端）：`titleZh`、`titleEn`、`tagsZh`
- SQL格式（数据库）：`title_zh`、`title_en`、`tags_zh`

自动转换，无需手动处理。

#### 5. 版本管理与数据迁移

```typescript
// 自动检测旧版本数据并迁移
const currentVersion = data.version || 'v1';
if (currentVersion !== CURRENT_VERSION) {
  migrateData(data);
}
```

---

### 五、环境变量配置

#### 本地开发（`.env.local`）

```env
VITE_SUPABASE_URL=https://kjzsixyrkywkmuborwam.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_DATA_SOURCE=supabase
```

#### GitHub生产环境（Secrets）

| Secret名称 | 说明 |
|-----------|------|
| VITE_SUPABASE_URL | Supabase项目URL |
| VITE_SUPABASE_ANON_KEY | anon公钥（eyJ开头） |
| VITE_DATA_SOURCE | 数据源模式 |

---

### 六、部署验证

#### 成功标志

1. **本地测试**：
   ```
   ✅ [Supabase] 数据加载成功: 2个活动, 5个问题, 7个反思
   ```

2. **生产环境测试**：
   - Console显示 `[Supabase] 数据加载成功`
   - 用户A创建数据，用户B刷新页面能看到 ✅
   - 跨设备访问能看到相同数据 ✅

3. **Supabase Dashboard**：
   - activities表：2条记录 ✅
   - questions表：5条记录 ✅
   - reflections表：7条记录 ✅

---

### 七、解决的问题

#### 核心问题：数据无法跨用户同步

**问题现象**：
- 用户A新建内容，只有用户A的浏览器能看到
- 用户B访问同一网站地址，完全看不到用户A创建的内容
- 刷新页面后内容还在，确认数据写入localStorage成功

**根本原因**：
- localStorage是浏览器本地存储，每个浏览器实例/设备有独立存储空间
- GitHub Pages是纯静态部署，没有后端服务器进行数据同步
- 项目已安装Supabase依赖但未启用云端存储

**解决方案**：
- 启用Supabase云端数据库
- DataContext支持双模式切换
- 自动降级机制保证可用性
- GitHub Secrets注入环境变量

---

### 八、安全性说明

#### anon key安全性

- anon key是公开密钥，设计为可在前端使用
- 安全性依赖于RLS（Row Level Security）策略
- service_role key绝不在前端使用（仅后端）

#### 当前RLS策略

- 公开读取：适合Portfolio展示
- 公开写入：单用户模式（无需认证）
- 如需多用户支持，需启用Supabase Auth并修改RLS策略

---

### 九、Supabase免费额度评估

| 项目 | 免费额度 | 个人使用评估 |
|------|---------|-------------|
| 数据库存储 | 500MB | 足够存储数千条记录 ✅ |
| 文件存储 | 1GB | 可存储图片等资源 ✅ |
| 月带宽 | 5GB | 足够个人Portfolio访问 ✅ |
| API请求 | 无限制 | 免费版无限制 ✅ |

**结论**：免费版完全满足个人Portfolio需求。

---

### 十、后续优化建议（可选）

| 功能 | 状态 | 说明 |
|------|------|------|
| Supabase Auth认证 | 未实施 | 如需多用户支持，需启用认证系统 |
| 图片上传到Supabase Storage | 未实施 | 可替代外部图片链接 |
| 数据备份导出 | 已有功能 | export.ts服务支持JSON/HTML导出 |

---

### 十一、文档更新

| 文件 | 更新内容 |
|------|----------|
| `SupabaseSetup.md` | 全面更新为三表结构配置指南，包含GitHub Secrets配置说明 |
| `部署指南.md` | 添加Supabase环境变量配置章节 |
| `CHANGELOG.md` | 添加v1.2.0版本详细记录 |

---

## v1.1.0 - 全面改进优化 (2026-07-09)

> 更新时间：2026-07-09
> 版本：v1.1.0

---

## 本次更新概览

基于《项目评估与改进建议》文档，对项目进行了以下全面改进：

- **新增文件**：10个
- **修改文件**：7个
- **新增依赖**：2个（dompurify、@types/dompurify）

---

## 一、新增文件清单

### 1. 通用组件层 (`src/components/common/`)

| 文件名 | 功能说明 |
|--------|----------|
| `Toast.tsx` | Toast通知组件，支持success/error/warning/info四种类型，带动画效果和自动消失功能 |
| `ConfirmDialog.tsx` | 确认对话框组件，替代原生window.confirm，支持danger/warning/info三种样式，带Promise异步确认 |
| `ActivityFilter.tsx` | 活动搜索筛选组件，支持关键词搜索、活动类型筛选、日期范围筛选 |
| `index.ts` | 组件导出索引文件 |

### 2. 表单组件层 (`src/components/forms/`)

| 文件名 | 功能说明 |
|--------|----------|
| `InputModeSelector.tsx` | 双语输入模式选择器组件，支持both/zh/en三种模式切换 |
| `BilingualInput.tsx` | 双语输入字段组件，统一处理中英文输入，支持text和textarea类型 |
| `index.ts` | 组件导出索引文件 |

### 3. 上下文层 (`src/contexts/`)

| 文件名 | 功能说明 |
|--------|----------|
| `ToastContext.tsx` | Toast全局上下文，提供useToast Hook，统一管理全局通知 |

### 4. Hooks层 (`src/hooks/`)

| 文件名 | 功能说明 |
|--------|----------|
| `useAutoSave.ts` | 自动保存草稿Hook，支持定时保存、页面关闭前保存、草稿恢复 |

### 5. 服务层 (`src/services/`)

| 文件名 | 功能说明 |
|--------|----------|
| `export.ts` | 数据导出服务，支持JSON导出、HTML报告导出、JSON导入 |

### 6. 工具层 (`src/utils/`)

| 文件名 | 功能说明 |
|--------|----------|
| `sanitize.ts` | HTML安全渲染工具，使用DOMPurify防止XSS攻击，包含sanitizeHtml、sanitizeUrl、sanitizeImageUrl函数 |

---

## 二、修改文件清单

### 1. 入口文件

| 文件 | 改动内容 |
|------|----------|
| `src/App.tsx` | 新增ToastProvider包裹，集成全局Toast通知系统 |

### 2. 页面文件

| 文件 | 改动内容 |
|------|----------|
| `src/pages/ActivityDetailPage.tsx` | 导入createSafeHtml，将dangerouslySetInnerHTML改为安全渲染 |
| `src/pages/ExperiencesPage.tsx` | 导入ConfirmDialog，handleDelete改为异步确认，新增确认对话框渲染 |
| `src/pages/QuestionsPage.tsx` | 导入ConfirmDialog，handleDelete改为异步确认，新增确认对话框渲染 |
| `src/pages/ReflectionPage.tsx` | 导入ConfirmDialog，handleDelete改为异步确认，新增确认对话框渲染 |
| `src/pages/TimelinePage.tsx` | 使用useMemo优化sortedActivities、groupedActivities、sortedGroups的计算，使用useCallback优化formatDate函数 |

### 3. 组件文件

| 文件 | 改动内容 |
|------|----------|
| `src/components/PhotoUploader.tsx` | 导入useToast，将alert调用改为toast.warning/error |

---

## 三、新增依赖

```json
{
  "dependencies": {
    "dompurify": "^3.x.x"  // HTML安全清理库，防止XSS攻击
  },
  "devDependencies": {
    "@types/dompurify": "^3.x.x"  // DOMPurify TypeScript类型定义
  }
}
```

---

## 四、功能改进详情

### 4.1 XSS安全修复（高优先级）

**问题**：ActivityDetailPage使用`dangerouslySetInnerHTML`直接渲染HTML内容，存在XSS风险。

**解决方案**：
- 安装DOMPurify依赖
- 创建`sanitize.ts`工具文件，提供`sanitizeHtml()`、`createSafeHtml()`、`sanitizeUrl()`、`sanitizeImageUrl()`函数
- 修改ActivityDetailPage，使用`createSafeHtml()`进行安全渲染

**代码示例**：
```typescript
// 之前
<div dangerouslySetInnerHTML={{ __html: getContent(activity, language) }} />

// 之后
<div dangerouslySetInnerHTML={createSafeHtml(getContent(activity, language))} />
```

---

### 4.2 Toast通知系统（高优先级）

**问题**：PhotoUploader等组件使用原生`alert()`，用户体验不佳。

**解决方案**：
- 创建Toast组件，支持四种通知类型
- 创建ToastContext，提供全局`useToast` Hook
- 在App.tsx中集成ToastProvider
- 替换PhotoUploader中的所有alert调用

**使用方式**：
```typescript
const toast = useToast();

// 成功提示
toast.success('保存成功');

// 错误提示
toast.error('上传失败，请重试');

// 警告提示
toast.warning('请输入图片URL');

// 信息提示
toast.info('正在处理...');
```

---

### 4.3 确认对话框组件（中优先级）

**问题**：ExperiencesPage、QuestionsPage、ReflectionPage使用原生`window.confirm()`，样式不统一。

**解决方案**：
- 创建ConfirmDialog组件，支持danger/warning/info三种类型
- 创建useConfirmDialog Hook，返回Promise实现异步确认
- 修改三个页面的handleDelete函数，使用异步确认

**使用方式**：
```typescript
const { confirm, dialogProps } = useConfirmDialog();

const handleDelete = async (id: string) => {
  const confirmed = await confirm({
    title: '确认删除',
    message: '确定要删除吗？此操作无法撤销。',
    type: 'danger',
    confirmText: '删除',
    cancelText: '取消',
  });
  
  if (confirmed) {
    deleteItem(id);
  }
};

// 在渲染中添加
<ConfirmDialog {...dialogProps} />
```

---

### 4.4 表单组件重构（中优先级）

**问题**：六个表单页面（Create/Edit Activity/Question/Reflection）存在大量重复的双语输入代码。

**解决方案**：
- 创建InputModeSelector组件，统一输入模式切换
- 创建BilingualInput组件，统一双语字段输入
- 组件支持三种配色方案

**InputModeSelector使用**：
```typescript
<InputModeSelector
  value={inputMode}
  onChange={setInputMode}
  colorScheme="orange" // 支持 orange/violet/green
/>
```

**BilingualInput使用**：
```typescript
<BilingualInput
  label="活动标题"
  labelZh="中文标题"
  labelEn="英文标题"
  valueZh={titleZh}
  valueEn={titleEn}
  onChangeZh={setTitleZh}
  onChangeEn={setTitleEn}
  inputMode={inputMode}
  type="text"
  required
/>
```

---

### 4.5 搜索筛选功能（中优先级）

**问题**：活动数量增多时，缺少搜索和筛选功能。

**解决方案**：
- 创建ActivityFilter组件
- 支持关键词搜索（标题、描述、标签）
- 支持活动类型筛选
- 支持日期范围筛选
- 实时更新筛选结果

**组件特性**：
- 展开式筛选面板
- 筛选状态计数显示
- 一键清除所有筛选

---

### 4.6 数据导出功能（中优先级）

**问题**：用户无法备份或迁移数据。

**解决方案**：
- 创建export.ts服务文件
- 支持JSON格式导出（完整数据备份）
- 支持HTML报告导出（可打印展示）
- 支持JSON数据导入（数据恢复）

**导出功能**：
```typescript
import { exportToJson, exportToHtml, importFromJson } from '@/services/export';

// JSON导出
exportToJson(activities, questions, reflections);

// HTML报告导出
exportToHtml(activities, questions, reflections, 'zh');

// JSON导入
const data = await importFromJson(file);
```

---

### 4.7 自动保存草稿功能（低优先级）

**问题**：用户填写长表单时，意外刷新会丢失所有输入。

**解决方案**：
- 创建useAutoSave Hook
- 定时自动保存（默认30秒）
- 页面关闭前自动保存
- 支持草稿恢复和清除

**使用方式**：
```typescript
const { save, clear, hasDraft, loadDraft } = useAutoSave({
  data: formData,
  key: 'activity-form',
  interval: 30000,
  onSave: (data) => console.log('已保存'),
});

// 恢复草稿
if (hasDraft) {
  const draft = loadDraft();
  if (draft) {
    setFormData(draft);
  }
}

// 提交后清除草稿
clear();
```

---

### 4.8 性能优化（低优先级）

**问题**：TimelinePage每次渲染都重新计算分组和排序，性能浪费。

**解决方案**：
- 使用`useMemo`缓存`sortedActivities`
- 使用`useMemo`缓存`groupedActivities`
- 使用`useMemo`缓存`sortedGroups`
- 使用`useMemo`缓存`globalIndexMap`
- 使用`useCallback`缓存`formatDate`函数

**优化效果**：
- 减少不必要的重复计算
- 活动列表渲染性能提升

---

## 五、新增架构目录

```
src/
├── components/
│   ├── common/          ← 新增目录
│   │   ├── Toast.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ActivityFilter.tsx
│   │   └── index.ts
│   ├── forms/           ← 新增目录
│   │   ├── InputModeSelector.tsx
│   │   ├── BilingualInput.tsx
│   │   └── index.ts
│   ├── editor/          ← 原有
│   └── layout/          ← 原有
├── contexts/
│   ├── DataContext.tsx  ← 原有
│   ├── LanguageContext.tsx ← 原有
│   └── ToastContext.tsx ← 新增
├── hooks/
│   └── useAutoSave.ts   ← 新增
├── services/
│   └── export.ts        ← 新增
├── utils/
│   ├── dateUtils.ts     ← 原有
│   ├── sanitize.ts      ← 新增
│   └── lib/
│       └── utils.ts     ← 原有
└── pages/               ← 修改多个文件
```

---

## 六、编译验证

```bash
npm run build

✓ 2022 modules transformed.
dist/index.html                   1.93 kB
dist/assets/index-DYrIekJm.css   45.52 kB
dist/assets/index-Br_1lz3d.js   747.03 kB
✓ built in 6.19s
```

**编译状态**：✅ 成功，无错误

---

## 七、后续建议（未实施）

以下改进建议尚未实施，可根据需要后续添加：

| 功能 | 状态 | 说明 |
|------|------|------|
| Supabase云端存储 | 未实施 | 需配置云数据库，工作量较大 |
| 富文本编辑器 | 未实施 | 建议集成TipTap |
| 单元测试 | 未实施 | 建议使用Vitest |
| 数据统计Dashboard | 未实施 | 新增页面展示统计 |

---

## 八、文件变更统计

| 类别 | 数量 |
|------|------|
| 新增文件 | 10 |
| 修改文件 | 7 |
| 新增依赖 | 2 |
| 新增目录 | 4 |

---

*更新完成时间：2026-07-09*
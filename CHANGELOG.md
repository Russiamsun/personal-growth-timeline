# 项目更新日志 (CHANGELOG)

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
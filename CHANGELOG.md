# 项目更新日志 (CHANGELOG)

## v1.13.0 - 视频上传功能 (2026-07-15)

### 🎯 核心功能

**活动页面支持视频上传**

### 功能特点

| 功能 | 说明 |
|------|------|
| 视频上传 | 支持 MP4/MOV 格式，单文件限制 500MB |
| 视频展示 | 活动详情页显示视频列表，支持播放 |
| 语言切换优化 | 切换按钮显示目标语言（中/English） |
| 返回优化 | 活动详情页返回保持原页面滚动位置 |

---

## v1.12.0 - 标签输入优化 (2026-07-14)

### 🎯 核心改进

**支持中英文逗号分隔标签**

### 功能特点

| 功能 | 说明 |
|------|------|
| 中英文逗号支持 | 英文逗号(,)和中文逗号(，)都可以分隔标签 |
| placeholder提示 | 所有标签输入框显示分隔提示 |
| 统一解析函数 | 使用parseTags函数统一处理 |

### 使用方式

输入标签时，可以使用：
- 英文逗号：`公益活动, 志愿者, 科学中心`
- 中文逗号：`公益活动，志愿者，科学中心`
- 混合使用：`公益活动，志愿者, 科学中心`

---

## v1.11.0 - 全面翻译功能完善 (2026-07-14)

### 🎯 核心改进

**标签翻译 + placeholder提示 + 全页面同步**

### 功能特点

| 功能 | 说明 |
|------|------|
| 标签翻译 | 切换语言时自动翻译标签 |
| placeholder提示 | 标签输入框显示"多个标签用逗号分隔" |
| 思考页面翻译 | 问题页面同步自动翻译功能 |
| 感悟页面翻译 | 感悟页面同步自动翻译功能 |

### 输入优化

- 标签用逗号分隔（不是空格）
- 输入框显示提示信息
- 中文："多个标签用逗号分隔"
- 英文："Separate tags with commas"

---

## v1.10.0 - 自动翻译功能增强 (2026-07-14)

### 🎯 核心功能

**切换语言自动翻译 - 无需手动点击翻译按钮**

### 功能特点

| 功能 | 说明 |
|------|------|
| 自动翻译 | 切换语言时自动翻译缺失的内容 |
| 实时显示 | 翻译时显示加载动画 |
| 智能处理 | 只翻译缺失的语言字段 |

### 使用方式

1. 创建活动时只填写中文内容
2. 切换到英文显示时自动翻译显示
3. 无需手动操作

---

## v1.9.0 - 自动翻译功能 (2026-07-14)

### 🎯 核心功能

**双语输入自动翻译 - 只需输入一种语言即可**

### 功能特点

| 功能 | 说明 |
|------|------|
| 自动翻译 | 输入中文/英文后点击翻译按钮 |
| 免费API | 使用MyMemory免费翻译服务 |
| 智能提示 | 只在一方有内容时显示翻译按钮 |

### 使用方式

1. 输入中文内容
2. 点击 **"翻译成英文"** 按钮
3. 自动填入英文翻译

或：

1. 输入英文内容
2. 点击 **"翻译成中文"** 按钮
3. 自动填入中文翻译

---

## v1.8.3 - 内容编辑优化 (2026-07-14)

### 🎯 核心改进

**活动内容编辑更简单 - 支持纯文本自动换行**

### 改进内容

| 功能 | 说明 |
|------|------|
| 自动换行 | 纯文本自动转换为段落 |
| 兼容HTML | 已有HTML内容保持原样 |
| 小朋友友好 | 无需学习HTML标签 |

### 使用方式

**之前（需要HTML）**：
```
<p>第一段内容</p>
<p>第二段内容</p>
```

**现在（直接换行）**：
```
第一段内容

第二段内容
```

两种方式都支持！

---

## v1.8.2 - 图片上传优化修复 (2026-07-14)

### 🎯 核心修复

**修复图片上传失败问题，大幅优化上传速度**

### 修复内容

| 问题 | 解决方案 |
|------|---------|
| 上传失败 | 添加Supabase配置检查和错误处理 |
| 上传速度慢 | 优化压缩参数，限制800px，质量0.7 |
| 代码复杂 | 简化上传流程，减少代码116行 |

### 优化效果

| 指标 | 改进 |
|------|------|
| 压缩速度 | ↑ 快速压缩，减少等待时间 |
| 文件大小 | ↓ 更小文件，上传更快 |
| 成功率 | ↑ 添加配置检查，避免静默失败 |

---



## v1.8.1 - 图片上传优化 (2026-07-14)

### 🎯 核心更新

**图片上传优化：快速压缩上传，简化流程**

优化上传速度，移除水印和进度显示，保持裁剪功能。

### 优化内容

| 改进 | 说明 |
|------|------|
| 快速压缩上传 | 自动压缩大于100KB的图片，限制最大1200px |
| 移除水印功能 | 简化上传流程 |
| 移除进度显示 | 减少界面复杂度 |
| 保持裁剪功能 | 上传后仍可裁剪图片 |

### 技术改进

- 图片自动压缩至500KB以下
- 限制最大尺寸1200px保持清晰度
- 批量上传更快速

---



## v1.8.0 - 图片上传增强功能 (2026-07-14)

### 🎯 核心更新

**图片上传全面升级：裁剪、水印、进度显示**

为PhotoUploader组件添加图片裁剪、水印保护和批量上传进度显示功能。

### 新增功能

| 功能 | 说明 |
|------|------|
| 图片裁剪 | 上传前裁剪图片，支持固定比例（1:1、4:3、16:9） |
| 图片水印 | 自动添加水印保护，支持自定义文字和位置 |
| 上传进度 | 实时显示每张图片和总体上传进度 |

### 新增文件

| 文件 | 功能 |
|------|------|
| `src/components/ImageCropper.tsx` | 图片裁剪组件（原生Canvas实现） |
| `src/utils/imageWatermark.ts` | 图片水印工具函数 |

### 裁剪功能特性

- 拖拽选择裁剪区域
- 8个调整手柄改变大小
- 固定比例：自由、1:1、4:3、16:9
- 90度旋转和水平/垂直翻转
- 三分法网格线辅助
- 实时预览裁剪结果

### 水印功能特性

- 6种位置：左上、右上、左下、右下、中心、平铺
- 可调节透明度（0-1）
- 自定义字体大小和颜色
- 默认水印：`© Emma's Growth`
- 批量处理支持

### 使用方式

```typescript
// 裁剪
<ImageCropper
  image={file}
  onCrop={(blob) => handleCrop(blob)}
  onCancel={() => setShowCropper(false)}
/>

// 水印
import { addWatermark } from '@/utils/imageWatermark';
const blob = await addWatermark(image, {
  text: '© My Photo',
  position: 'bottom-right',
  opacity: 0.6
});
```

---



## v1.7.0 - 表单代码重构优化 (2026-07-14)

### 🎯 核心更新

**表单代码重构：创建通用组件消除重复代码**

通过抽取通用表单组件和Hook，大幅减少6个表单页面的重复代码，提高代码可维护性。

### 新增文件

| 文件 | 功能 |
|------|------|
| `src/hooks/useFormValidation.ts` | 通用表单验证Hook |
| `src/hooks/useBilingualForm.ts` | 双语输入模式管理Hook |
| `src/components/forms/FormFields.tsx` | 通用表单组件（FormField、TextInput、TextArea、BilingualInputField、InputModeSelector） |

### 重构文件

| 文件 | 代码量减少 |
|------|-----------|
| CreateActivityPage.tsx | 555行 → 352行 (37%) |
| EditActivityPage.tsx | 618行 → 419行 (32%) |
| CreateQuestionPage.tsx | 约380行 → 260行 (31%) |
| EditQuestionPage.tsx | 约400行 → 280行 (30%) |
| CreateReflectionPage.tsx | 约400行 → 360行 (10%) |
| EditReflectionPage.tsx | 约420行 → 360行 (14%) |

### 技术改进

- **BilingualInputField**: 统一处理双语输入，支持text和textarea类型
- **InputModeSelector**: 统一的输入模式切换组件
- **useFormValidation**: 集中管理表单验证逻辑
- **useBilingualForm**: 管理双语输入模式状态

### 配色支持

- Activity页面: `colorScheme="orange"`
- Question页面: `colorScheme="violet"`
- Reflection页面: `colorScheme="green"`

---



## v1.6.0 - 移动端响应式优化 (2026-07-14)

### 🎯 核心更新

**全面提升移动端用户体验**

优化项目的移动端响应式体验,确保在小屏设备上有良好的使用体验。



## v1.5.0 - Sentry错误监控系统 (2026-07-14)

### 🎯 核心更新

**新增错误监控：集成 Sentry 实现应用错误自动上报**

在生产环境中自动捕获和上报应用错误，帮助快速定位和修复问题。



## v1.4.0 - 编辑模式保护功能 (2026-07-13)

### 🎯 核心更新

**新增编辑模式保护：通过URL隐藏参数实现只读模式**

解决老师误删数据的问题，Emma通过特殊URL进入编辑模式，普通访问只能查看。



## v1.3.0 - Supabase Storage图片上传优化 (2026-07-10)

### 🎯 核心优化

**重大性能提升：图片存储从Base64迁移到Supabase Storage**

彻底解决Base64图片存储导致的数据库膨胀和性能问题，实现图片云端CDN加速访问。

---


## v1.2.0 - Supabase云端数据库实现 (2026-07-10)

### 🎯 核心更新

**重大突破：解决数据无法跨用户/跨设备同步的根本问题**

从localStorage本地存储迁移到Supabase云端数据库，实现真正的数据持久化和跨用户同步。

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
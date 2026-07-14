/**
 * 设计Token系统
 * 参考Linear、Notion等高端产品的设计语言
 */

export const tokens = {
  // 间距系统（基于4px基础单位）
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    base: '1rem',    // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // 圆角系统
  borderRadius: {
    sm: '0.25rem',   // 4px - 小元素（标签、小按钮）
    md: '0.5rem',    // 8px - 中等元素（输入框、按钮）
    lg: '0.75rem',   // 12px - 大元素（卡片）
    xl: '1rem',      // 16px - 特大元素（模态框）
    '2xl': '1.5rem', // 24px - 超大圆角
    full: '9999px',  // 完全圆形
  },

  // 阴影系统（细腻平滑）
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    md: '0 2px 4px -1px rgb(0 0 0 / 0.05), 0 1px 2px -2px rgb(0 0 0 / 0.05)',
    lg: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    xl: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    hover: '0 8px 16px -4px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  },

  // 字号系统
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  // 行高
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  },

  // 字间距
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  // 过渡动画
  transition: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // 缓动函数
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// 配色系统 - 柔和、低饱和度
export const colors = {
  // 主色调：中性灰色系
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Experiences板块 - 柔和的琥珀色
  amber: {
    light: '#FEF3C7',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },

  // Questions板块 - 柔和的紫色
  violet: {
    light: '#EDE9FE',
    DEFAULT: '#8B5CF6',
    dark: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },

  // Reflection板块 - 柔和的绿色
  green: {
    light: '#D1FAE5',
    DEFAULT: '#10B981',
    dark: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },

  // 功能色
  primary: {
    light: '#EEF2FF',
    DEFAULT: '#6366F1',
    dark: '#4F46E5',
  },

  error: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
  },

  success: {
    light: '#D1FAE5',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
} as const;

// 卡片样式预设
export const cardStyles = {
  base: 'bg-white rounded-lg shadow-sm border border-gray-100',
  hover: 'hover:shadow-md hover:border-gray-200 transition-all duration-200',
  amber: 'bg-white rounded-lg shadow-sm border border-amber-100',
  violet: 'bg-white rounded-lg shadow-sm border border-violet-100',
  green: 'bg-white rounded-lg shadow-sm border border-green-100',
} as const;

// 按钮样式预设
export const buttonStyles = {
  primary: 'px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200',
  secondary: 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200',
  ghost: 'px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200',
  amber: 'px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors duration-200 border border-amber-200',
  violet: 'px-4 py-2 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors duration-200 border border-violet-200',
  green: 'px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200',
} as const;

// 微交互配置
export const microInteractions = {
  // 细腻的hover scale
  scaleOnHover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  // 点击反馈
  scaleOnTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  // 平滑的y轴移动
  liftOnHover: {
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  // 柔和的阴影变化
  shadowOnHover: {
    boxShadow: tokens.shadows.hover,
  }
} as const;
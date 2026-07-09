import { TimeRecord, Language } from '@/types';

/**
 * 格式化日期显示
 * @param dateStr - YYYY-MM-DD 格式的日期字符串
 * @returns 格式化后的日期字符串，如 "8月7日"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

/**
 * 格式化完整日期
 * @param dateStr - YYYY-MM-DD 格式的日期字符串
 * @returns 格式化后的日期字符串，如 "2024年8月7日"
 */
export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 从日期字符串中提取年份
 * @param dateStr - YYYY-MM-DD 格式的日期字符串
 * @returns 年份
 */
export function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

/**
 * 按日期排序记录
 * @param records - 记录数组
 * @param order - 排序顺序：'desc' 降序（最新在前），'asc' 升序（最旧在前）
 * @returns 排序后的记录数组
 */
export function sortByDate(records: TimeRecord[], order: 'desc' | 'asc' = 'desc'): TimeRecord[] {
  return [...records].sort((a, b) => {
    const dateA = new Date(a.recordDate).getTime();
    const dateB = new Date(b.recordDate).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * 获取两个日期之间的天数差
 * @param dateStr1 - 第一个日期字符串
 * @param dateStr2 - 第二个日期字符串
 * @returns 天数差
 */
export function getDaysDiff(dateStr1: string, dateStr2: string): number {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 检查日期是否为今天
 * @param dateStr - 日期字符串
 * @returns 是否为今天
 */
export function isToday(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 根据语言格式化日期显示（双语言支持）
 * @param dateStr - YYYY-MM-DD 格式的日期字符串
 * @param lang - 语言类型 ('zh' | 'en')
 * @returns 格式化后的日期字符串
 */
export function formatDateByLang(dateStr: string, lang: Language): string {
  const date = new Date(dateStr);
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
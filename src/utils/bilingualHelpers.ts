import { Activity, ActivityType, ActivityTypeConfig, Reflection, Question, Language } from '@/types';
import { TranslationStrings } from '@/contexts/LanguageContext';
import { translateText } from '@/utils/translate';

/**
 * 解析标签字符串，支持中英文逗号
 * @param tagsString - 标签字符串
 * @returns 标签数组
 */
export function parseTags(tagsString: string): string[] {
  if (!tagsString || !tagsString.trim()) return [];
  // 支持英文逗号(,)和中文逗号(，)
  return tagsString
    .split(/[,，]/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

/**
 * 根据语言获取活动的标题
 * @param activity - 活动对象
 * @param lang - 语言类型
 * @returns 标题文本
 */
export function getTitle(activity: Activity, lang: Language): string {
  const zhTitle = activity.titleZh || '';
  const enTitle = activity.titleEn || '';
  if (lang === 'zh') {
    return zhTitle || enTitle || '无标题';
  }
  return enTitle || zhTitle || 'No Title';
}

/**
 * 根据语言获取活动的描述
 * @param activity - 活动对象
 * @param lang - 语言类型
 * @returns 描述文本
 */
export function getDescription(activity: Activity, lang: Language): string {
  const zhDesc = activity.descriptionZh || '';
  const enDesc = activity.descriptionEn || '';
  if (lang === 'zh') {
    return zhDesc || enDesc || '';
  }
  return enDesc || zhDesc || '';
}

/**
 * 根据语言获取活动的地点
 * @param activity - 活动对象
 * @param lang - 语言类型
 * @returns 地点文本
 */
export function getLocation(activity: Activity, lang: Language): string {
  const zhLoc = activity.locationZh || '';
  const enLoc = activity.locationEn || '';
  if (lang === 'zh') {
    return zhLoc || enLoc || '';
  }
  return enLoc || zhLoc || '';
}

/**
 * 根据语言获取活动的富文本内容
 * @param activity - 活动对象
 * @param lang - 语言类型
 * @returns 富文本内容
 */
export function getContent(activity: Activity, lang: Language): string {
  const zhContent = activity.contentZh || '';
  const enContent = activity.contentEn || '';
  if (lang === 'zh') {
    return zhContent || enContent || '';
  }
  return enContent || zhContent || '';
}

/**
 * 异步获取标题（支持自动翻译）
 */
export async function getTitleAsync(activity: Activity, lang: Language): Promise<string> {
  const zhTitle = activity.titleZh || '';
  const enTitle = activity.titleEn || '';
  
  if (lang === 'zh') {
    if (zhTitle) return zhTitle;
    if (enTitle) {
      return await translateText(enTitle, 'en', 'zh');
    }
    return '无标题';
  } else {
    if (enTitle) return enTitle;
    if (zhTitle) {
      return await translateText(zhTitle, 'zh', 'en');
    }
    return 'No Title';
  }
}

/**
 * 异步获取描述（支持自动翻译）
 */
export async function getDescriptionAsync(activity: Activity, lang: Language): Promise<string> {
  const zhDesc = activity.descriptionZh || '';
  const enDesc = activity.descriptionEn || '';
  
  if (lang === 'zh') {
    if (zhDesc) return zhDesc;
    if (enDesc) {
      return await translateText(enDesc, 'en', 'zh');
    }
    return '';
  } else {
    if (enDesc) return enDesc;
    if (zhDesc) {
      return await translateText(zhDesc, 'zh', 'en');
    }
    return '';
  }
}

/**
 * 异步获取内容（支持自动翻译）
 */
export async function getContentAsync(activity: Activity, lang: Language): Promise<string> {
  const zhContent = activity.contentZh || '';
  const enContent = activity.contentEn || '';
  
  if (lang === 'zh') {
    if (zhContent) return zhContent;
    if (enContent) {
      return await translateText(enContent, 'en', 'zh');
    }
    return '';
  } else {
    if (enContent) return enContent;
    if (zhContent) {
      return await translateText(zhContent, 'zh', 'en');
    }
    return '';
  }
}

/**
 * 异步获取地点（支持自动翻译）
 */
export async function getLocationAsync(activity: Activity, lang: Language): Promise<string> {
  const zhLoc = activity.locationZh || '';
  const enLoc = activity.locationEn || '';
  
  if (lang === 'zh') {
    if (zhLoc) return zhLoc;
    if (enLoc) {
      return await translateText(enLoc, 'en', 'zh');
    }
    return '';
  } else {
    if (enLoc) return enLoc;
    if (zhLoc) {
      return await translateText(zhLoc, 'zh', 'en');
    }
    return '';
  }
}

/**
 * 根据语言获取标签数组
 * 这是一个通用函数，可用于Activity、Question、Reflection等实体
 * @param entity - 包含tagsZh和tagsEn的实体对象
 * @param lang - 语言类型
 * @returns 标签数组
 */
export function getTags(entity: { tagsZh?: string[]; tagsEn?: string[] }, lang: Language): string[] {
  if (lang === 'zh') {
    return entity.tagsZh?.length ? entity.tagsZh : entity.tagsEn || [];
  }
  return entity.tagsEn?.length ? entity.tagsEn : entity.tagsZh || [];
}

/**
 * 异步获取标签数组（支持自动翻译）
 * @param entity - 包含tagsZh和tagsEn的实体对象
 * @param lang - 语言类型
 * @returns 标签数组
 */
export async function getTagsAsync(entity: { tagsZh?: string[]; tagsEn?: string[] }, lang: Language): Promise<string[]> {
  const zhTags = entity.tagsZh || [];
  const enTags = entity.tagsEn || [];

  if (lang === 'zh') {
    if (zhTags.length > 0) return zhTags;
    if (enTags.length > 0) {
      // 将英文标签用逗号连接成字符串，翻译后再拆分
      const tagsString = enTags.join(',');
      const translated = await translateText(tagsString, 'en', 'zh');
      return translated.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return [];
  } else {
    if (enTags.length > 0) return enTags;
    if (zhTags.length > 0) {
      // 将中文标签用逗号连接成字符串，翻译后再拆分
      const tagsString = zhTags.join(',');
      const translated = await translateText(tagsString, 'zh', 'en');
      return translated.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return [];
  }
}

/**
 * 根据语言获取活动类型的显示标签
 * @param type - 活动类型
 * @param t - 翻译对象
 * @returns 活动类型标签
 */
export function getActivityTypeLabel(type: ActivityType, t: TranslationStrings): string {
  const typeLabels: Record<ActivityType, string> = {
    'charity': t.activityTypes.charity,
    'science-museum': t.activityTypes['science-museum'],
    'city-explore': t.activityTypes['city-explore'],
    'ai-experience': t.activityTypes['ai-experience'],
    'social-observation': t.activityTypes['social-observation'],
  };
  return typeLabels[type] || ActivityTypeConfig[type].label;
}

/**
 * 异步获取反思内容（支持自动翻译）
 */
export async function getReflectionContentAsync(reflection: Reflection, lang: Language): Promise<string> {
  const zhContent = reflection.contentZh || '';
  const enContent = reflection.contentEn || '';

  if (lang === 'zh') {
    if (zhContent) return zhContent;
    if (enContent) {
      return await translateText(enContent, 'en', 'zh');
    }
    return '';
  } else {
    if (enContent) return enContent;
    if (zhContent) {
      return await translateText(zhContent, 'zh', 'en');
    }
    return '';
  }
}

/**
 * ==================== Question 相关函数 ====================
 */

/**
 * 异步获取问题文本（支持自动翻译）
 */
export async function getQuestionTextAsync(question: Question, lang: Language): Promise<string> {
  const zhText = question.questionZh || '';
  const enText = question.questionEn || '';

  if (lang === 'zh') {
    if (zhText) return zhText;
    if (enText) {
      return await translateText(enText, 'en', 'zh');
    }
    return '无问题';
  } else {
    if (enText) return enText;
    if (zhText) {
      return await translateText(zhText, 'zh', 'en');
    }
    return 'No Question';
  }
}

/**
 * 异步获取思考内容（支持自动翻译）
 */
export async function getThoughtsAsync(question: Question, lang: Language): Promise<string> {
  const zhThoughts = question.thoughtsZh || '';
  const enThoughts = question.thoughtsEn || '';

  if (lang === 'zh') {
    if (zhThoughts) return zhThoughts;
    if (enThoughts) {
      return await translateText(enThoughts, 'en', 'zh');
    }
    return '';
  } else {
    if (enThoughts) return enThoughts;
    if (zhThoughts) {
      return await translateText(zhThoughts, 'zh', 'en');
    }
    return '';
  }
}
import { Activity, ActivityType, ActivityTypeConfig, Language } from '@/types';
import { TranslationStrings } from '@/contexts/LanguageContext';

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
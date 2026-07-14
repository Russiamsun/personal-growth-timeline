import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity, ActivityTypeConfig, ActivityType, Language } from '@/types';
import { getTitle, getDescription, getLocation, getTags, getActivityTypeLabel } from '@/utils/bilingualHelpers';
import { sanitizeImageUrl } from '@/utils/sanitize';

export default function TimelinePage() {
  const navigate = useNavigate();
  const { activities } = useData();
  const { language, t } = useLanguage();
  const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);

  // 使用useMemo缓存排序后的活动列表
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [activities]);

  // 格式化日期
  const formatDate = useCallback((dateStr: string, lang: Language) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 根据语言返回不同的格式
    const formatted = lang === 'zh'
      ? `${year}年${String(month).padStart(2, '0')}月${String(day).padStart(2, '0')}日`
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return {
      year,
      month,
      day,
      formatted,
    };
  }, []);

  // 使用useMemo缓存分组后的活动
  const groupedActivities = useMemo(() => {
    return sortedActivities.reduce((acc, activity) => {
      const { year, month } = formatDate(activity.date, language);
      const key = `${year}-${String(month).padStart(2, '0')}`;

      if (!acc[key]) {
        acc[key] = {
          year,
          month,
          activities: [],
        };
      }

      acc[key].activities.push(activity);
      return acc;
    }, {} as Record<string, { year: number; month: number; activities: Activity[] }>);
  }, [sortedActivities, language, formatDate]);

  // 使用useMemo缓存排序后的分组
  const sortedGroups = useMemo(() => {
    return Object.values(groupedActivities).sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1);
      const dateB = new Date(b.year, b.month - 1);
      return dateB.getTime() - dateA.getTime();
    });
  }, [groupedActivities]);

  // 计算全局索引映射 - 确保整个时间线上严格左右交替
  const globalIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    let globalIndex = 0;
    sortedGroups.forEach(group => {
      group.activities.forEach(activity => {
        map.set(activity.id, globalIndex++);
      });
    });
    return map;
  }, [sortedGroups]);

  // 逐个显示活动的动画效果
  useEffect(() => {
    if (sortedActivities.length > 0) {
      const timer = setInterval(() => {
        setVisibleActivities(prev => {
          if (prev.length < sortedActivities.length) {
            return [...prev, sortedActivities[prev.length]];
          }
          clearInterval(timer);
          return prev;
        });
      }, 150);

      return () => clearInterval(timer);
    }
  }, [sortedActivities.length, sortedActivities]);

  if (activities.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 pt-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-600 text-lg mb-2">{t.common.noData}</p>
          <p className="text-gray-500 text-sm mb-6">
            {language === 'zh' ? '开始记录你的实践经历吧' : 'Start recording your real world experiences'}
          </p>
          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.form.back}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3">{t.timeline.title}</h1>
          <p className="text-sm md:text-base text-gray-600">{t.timeline.subtitle}</p>
        </motion.div>

        {/* 时间轴主体 */}
        <div className="relative">
          {/* 中央时间线 - 桌面端 */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-400 via-pink-400 to-purple-400 rounded-full opacity-50"></div>
          {/* 左侧时间线 - 移动端 */}
          <div className="md:hidden absolute left-6 w-1 h-full bg-gradient-to-b from-orange-400 via-pink-400 to-purple-400 rounded-full opacity-50"></div>

          <AnimatePresence>
            {sortedGroups.map((group, groupIndex) => (
              <div key={`${group.year}-${group.month}`} className="relative mb-16">
                {/* 年月节点 */}
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: groupIndex * 0.1, duration: 0.3 }}
                >
                  <div className="relative z-10 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-lg">
                    {language === 'zh' ? (
                      <>
                        <span className="text-xl font-bold">{group.year}年</span>
                        <span className="text-lg ml-2">{group.month}月</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        {new Date(group.year, group.month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* 该月份的活动 - 左右交叉排布 */}
                {group.activities.map((activity) => {
                  const date = formatDate(activity.date, language);
                  const config = ActivityTypeConfig[activity.type];
                  const isVisible = visibleActivities.some(a => a.id === activity.id);

                  // 使用全局索引判断左右，确保整个时间线严格交替
                  const globalIdx = globalIndexMap.get(activity.id) || 0;
                  const isLeft = globalIdx % 2 === 0; // 偶数全局索引在左侧，奇数全局索引在右侧

                  return (
                    <motion.div
                      key={activity.id}
                      className="relative flex items-center justify-between mb-12 md:mb-12"
                      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
                      exit={{ opacity: 0, x: isLeft ? -50 : 50 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {/* 移动端单列布局 */}
                      <div className="md:hidden w-full flex items-start gap-4">
                        {/* 左侧时间轴节点 */}
                        <div className="relative z-10 flex flex-col items-center flex-shrink-0">
                          <motion.div
                            className="w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg cursor-pointer bg-white"
                            style={{ borderColor: config.color }}
                            whileHover={{ scale: 1.3, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/activity/${activity.id}`)}
                          >
                            <span className="text-xl">{config.icon}</span>
                          </motion.div>
                          {/* 时间轴线 */}
                          <div className="w-1 flex-1 bg-gradient-to-b from-orange-400 to-purple-400 opacity-50 mt-2"></div>
                        </div>

                        {/* 右侧卡片 */}
                        <div className="flex-1 pb-8">
                          <ActivityCard
                            activity={activity}
                            config={config}
                            date={date}
                            language={language}
                            t={t}
                          />
                        </div>
                      </div>

                      {/* 桌面端双列布局 */}
                      <>
                        {/* 左侧内容 */}
                        <div className="hidden md:block w-5/12">
                          {isLeft ? (
                            <ActivityCard
                              activity={activity}
                              config={config}
                              date={date}
                              language={language}
                              t={t}
                            />
                          ) : (
                            <TimeInfo date={date} location={getLocation(activity, language)} />
                          )}
                        </div>

                        {/* 中间：圆形节点 */}
                        <div className="hidden md:flex relative z-10 flex-col items-center">
                          <motion.div
                            className="w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-lg cursor-pointer bg-white"
                            style={{
                              borderColor: config.color,
                            }}
                            whileHover={{ scale: 1.3, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/activity/${activity.id}`)}
                          >
                            <span className="text-2xl">{config.icon}</span>
                          </motion.div>
                        </div>

                        {/* 右侧内容 */}
                        <div className="hidden md:block w-5/12">
                          {!isLeft ? (
                            <ActivityCard
                              activity={activity}
                              config={config}
                              date={date}
                              language={language}
                              t={t}
                            />
                          ) : (
                            <TimeInfo date={date} location={getLocation(activity, language)} />
                          )}
                        </div>
                      </>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// 活动卡片组件
function ActivityCard({ activity, config, date, language, t }: {
  activity: Activity;
  config: { label: string; icon: string; color: string; gradient: string };
  date: { year: number; month: number; day: number; formatted: string };
  language: Language;
  t: any;
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-3 md:p-5 hover:shadow-xl transition-all cursor-pointer border-l-4"
      style={{ borderLeftColor: config.color }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => navigate(`/activity/${activity.id}`)}
    >
      {/* 类型标签 */}
      <div className="mb-2 md:mb-3">
        <span
          className="px-2 md:px-3 py-1 text-xs font-medium rounded-full"
          style={{ backgroundColor: `${config.color}20`, color: config.color }}
        >
          {config.icon} {getActivityTypeLabel(activity.type, t)}
        </span>
      </div>

      {/* 标题 */}
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2">
        {getTitle(activity, language)}
      </h3>

      {/* 描述 */}
      <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">
        {getDescription(activity, language)}
      </p>

      {/* 照片缩略图 */}
      {activity.photos.length > 0 && (
        <div className="flex gap-1.5 md:gap-2 mb-2 md:mb-3">
          {activity.photos.slice(0, 3).map((photo, index) => (
            <div
              key={photo.id}
              className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gray-100 shadow-sm"
            >
              <img
                src={sanitizeImageUrl(photo.url)}
                alt={language === 'zh' ? `照片${index + 1}` : `Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {activity.photos.length > 3 && (
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm">
              <span className="text-xs md:text-sm text-gray-500">+{activity.photos.length - 3}</span>
            </div>
          )}
        </div>
      )}

      {/* 标签 */}
      {getTags(activity, language).length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {getTags(activity, language).slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {getTags(activity, language).length > 3 && (
            <span className="text-xs text-gray-400">
              +{getTags(activity, language).length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// 时间信息组件
function TimeInfo({ date, location }: {
  date: { year: number; month: number; day: number; formatted: string };
  location?: string;
}) {
  return (
    <div className="text-gray-600">
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="w-4 h-4 text-orange-400" />
        <span className="text-lg font-medium">{date.day}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{date.formatted}</span>
      </div>
      {location && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, Heart, Plus, Edit, Trash2 } from 'lucide-react';
import { Activity, ActivityTypeConfig, ActivityType, Language } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { ConfirmDialog, useConfirmDialog } from '@/components/common/ConfirmDialog';
import { ActivityFilter } from '@/components/common/ActivityFilter';
import { getTitle, getDescription, getLocation, getTags, getActivityTypeLabel } from '@/utils/bilingualHelpers';
import { formatDateByLang } from '@/utils/dateUtils';
import { sanitizeImageUrl } from '@/utils/sanitize';

export default function ExperiencesPage() {
  const navigate = useNavigate();
  const { activities, deleteActivity } = useData();
  const { language, t } = useLanguage();
  const { isEditMode } = useEditMode();
  const { confirm, dialogProps } = useConfirmDialog();

  // 筛选后的活动列表
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);

  // 分组并按日期降序排序（最新的在前）
  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    if (!acc[activity.type]) {
      acc[activity.type] = [];
    }
    acc[activity.type].push(activity);
    return acc;
  }, {} as Record<ActivityType, Activity[]>);

  // 对每个分组内的活动按日期排序
  Object.keys(groupedActivities).forEach(type => {
    groupedActivities[type as ActivityType].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const handleDelete = async (id: string, activity: Activity) => {
    const title = getTitle(activity, language);
    const confirmed = await confirm({
      title: language === 'zh' ? '确认删除' : 'Confirm Delete',
      message: language === 'zh'
        ? `确定要删除活动"${title}"吗？\n\n此操作无法撤销。`
        : `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`,
      type: 'danger',
      confirmText: language === 'zh' ? '删除' : 'Delete',
      cancelText: language === 'zh' ? '取消' : 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteActivity(id);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
      {/* 确认对话框 */}
      <ConfirmDialog {...dialogProps} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                {t.nav.experiences}
              </h1>
            </div>
            {isEditMode && (
              <motion.button
                onClick={() => navigate('/activity/create')}
                className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all text-sm md:text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span>{t.experiences.createNew}</span>
              </motion.button>
            )}
          </div>
          <p className="text-gray-600 text-sm md:text-lg">
            {t.experiences.subtitle}
          </p>
        </motion.div>

        {/* 活动筛选 */}
        <ActivityFilter
          activities={activities}
          onFilterChange={setFilteredActivities}
        />

        {/* 活动分组展示 */}
        {Object.entries(groupedActivities).map(([type, activities], groupIndex) => {
          const config = ActivityTypeConfig[type as ActivityType];
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
              className="mb-12"
            >
              {/* 类型标题 */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <motion.div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <span className="text-lg md:text-xl">{config.icon}</span>
                  </motion.div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-700">
                    {getActivityTypeLabel(type as ActivityType, t)}
                  </h2>
                  <span className="text-xs md:text-sm text-gray-500 bg-orange-100 px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                    {activities.length}
                  </span>
                </div>
              </div>

              {/* 活动卡片 - 照片网格布局 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: groupIndex * 0.1 + index * 0.05, duration: 0.4 }}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/activity/${activity.id}`)}
                  >
                    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
                      {/* 顶部渐变装饰 */}
                      <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

                      {/* 照片展示区域 */}
                      {activity.photos && activity.photos.length > 0 && (
                        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50">
                          {/* 显示第一张照片 */}
                          <img
                            src={sanitizeImageUrl(activity.photos[0].url)}
                            alt={activity.photos[0].caption || getTitle(activity, language)}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // 如果图片加载失败，显示占位图
                              e.currentTarget.src = `https://picsum.photos/seed/${activity.id}/400/300`;
                            }}
                          />
                          {/* 照片数量指示器 */}
                          {activity.photos.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                              +{activity.photos.length - 1} {t.experiences.photos}
                            </div>
                          )}
                          {/* 渐变遮罩 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}

                      {/* 卡片内容 */}
                      <div className="p-6 md:p-8">
                        {/* 标题 */}
                        <div className="mb-4">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-tight">
                            {getTitle(activity, language)}
                          </h3>
                          <p className="text-gray-500 text-sm italic">
                            {getDescription(activity, language)}
                          </p>
                        </div>

                        {/* 元数据 */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <motion.div
                            className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span>{formatDateByLang(activity.date, language)}</span>
                          </motion.div>
                          {(activity.locationZh || activity.locationEn) && (
                            <motion.div
                              className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg"
                              whileHover={{ scale: 1.05 }}
                            >
                              <MapPin className="w-4 h-4 text-amber-500" />
                              <span>{getLocation(activity, language)}</span>
                            </motion.div>
                          )}
                        </div>

                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {getTags(activity, language).slice(0, 6).map((tag, tagIndex) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: tagIndex * 0.05 }}
                              className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-gray-700 rounded-full text-sm font-medium border border-orange-200"
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>

                        {/* Hover指示 */}
                        <div className="flex items-center justify-between">
                          <motion.div
                            className="flex items-center gap-2 text-orange-600 font-medium"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <Heart className="w-5 h-5" />
                            <span className="text-sm">{t.common.clickToView}</span>
                          </motion.div>

                          {/* 操作按钮 - 仅编辑模式显示 */}
                          {isEditMode && (
                            <div className="flex items-center gap-2 pointer-events-auto">
                              <motion.button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  navigate(`/activity/edit/${activity.id}`);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative z-10 cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit className="w-5 h-5 pointer-events-none" />
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleDelete(activity.id, activity);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors relative z-10 cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-5 h-5 pointer-events-none" />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 底部装饰 */}
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-100 to-transparent opacity-50 rounded-tl-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* 空状态 */}
        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-orange-400 text-6xl mb-4">🌍</div>
            <p className="text-gray-500 text-lg">{t.common.noData}</p>
          </motion.div>
        ) : filteredActivities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-orange-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">
              {language === 'zh' ? '没有找到匹配的活动' : 'No matching activities found'}
            </p>
          </motion.div>
        ) : null}

        {/* 返回顶部 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.form.back}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag, ArrowLeft, Image, Languages } from 'lucide-react';
import { Activity, ActivityTypeConfig, ActivityType, Language } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { createSafeHtml, sanitizeImageUrl } from '@/utils/sanitize';
import { getTitle, getDescription, getLocation, getContent, getTags, getActivityTypeLabel } from '@/utils/bilingualHelpers';
import { formatDateByLang } from '@/utils/dateUtils';
import { translateText } from '@/utils/translate';
import { useState } from 'react';

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activities, updateActivity } = useData();
  const { language, t } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const activity = activities.find(a => a.id === id);

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 pt-20 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-orange-400 text-6xl mb-4">🔍</div>
          <p className="text-gray-600 text-lg mb-4">
            {t.form.activityNotFound}
          </p>
          <motion.button
            onClick={() => navigate('/experiences')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium"
            whileHover={{ scale: 1.05 }}
          >
            {t.form.back}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const config = ActivityTypeConfig[activity.type];

  // 翻译内容
  const handleTranslateContent = async () => {
    if (!activity.contentZh && !activity.contentEn) return;

    setIsTranslating(true);
    try {
      const sourceText = language === 'zh' ? activity.contentEn || activity.contentZh : activity.contentZh || activity.contentEn;
      const targetLang = language === 'zh' ? 'en' : 'zh';
      const sourceLang = language === 'zh' ? 'en' : 'zh';

      const translated = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedContent(translated);
    } catch (error) {
      console.error('翻译失败:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 获取显示的内容
  const getDisplayContent = () => {
    if (translatedContent) return translatedContent;
    return getContent(activity, language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <motion.button
            onClick={() => navigate('/experiences')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-orange-50 transition-colors shadow-sm"
            whileHover={{ scale: 1.05, x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t.form.backToActivities}
            </span>
          </motion.button>
        </motion.div>

        {/* 活动详情卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-200">
            {/* 顶部渐变装饰 */}
            <div className={`h-3 bg-gradient-to-r ${config.gradient}`} />

            {/* 标题区域 */}
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <span className="text-xl">{config.icon}</span>
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {getTitle(activity, language)}
                  </h1>
                </div>
                <p className="text-gray-500 text-sm italic">
                  {getDescription(activity, language)}
                </p>
              </div>

              {/* 元数据 */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <motion.div
                  className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{formatDateByLang(activity.date, language)}</span>
                </motion.div>
                {(activity.locationZh || activity.locationEn) && (
                  <motion.div
                    className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">{getLocation(activity, language)}</span>
                  </motion.div>
                )}
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-8">
                {getTags(activity, language).map((tag, tagIndex) => (
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
            </div>

            {/* 照片区域 */}
            {activity.photos && activity.photos.length > 0 && (
              <div className="px-6 md:px-10 pb-6">
                <div className="mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {t.form.activityPhotos}
                  </h2>
                  <span className="text-sm text-gray-500">({activity.photos.length})</span>
                </div>

                {/* 照片网格 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activity.photos.map((photo, photoIndex) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: photoIndex * 0.1 }}
                      className="group relative aspect-square bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg overflow-hidden border-2 border-orange-200 hover:border-orange-300 transition-all"
                    >
                      {/* 照片占位符 */}
                      {photo.url ? (
                        <img
                          src={sanitizeImageUrl(photo.url)}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Image className="w-12 h-12 text-orange-400 mb-2" />
                          </motion.div>
                          <p className="text-orange-600 text-sm text-center px-2">
                            {photo.caption}
                          </p>
                          <p className="text-orange-400 text-xs mt-1">
                            {t.form.photoToUpload}
                          </p>
                        </div>
                      )}

                      {/* Hover效果 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                        <p className="text-white text-sm font-medium">{photo.caption}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 活动内容 */}
            <div className="px-6 md:px-10 pb-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {t.form.activityDetails}
                  </h2>
                </div>
                {/* 翻译按钮 */}
                {((language === 'zh' && !activity.contentEn) || (language === 'en' && !activity.contentZh)) && (
                  <motion.button
                    onClick={handleTranslateContent}
                    disabled={isTranslating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isTranslating ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <Languages className="w-4 h-4" />
                    )}
                    <span>{language === 'zh' ? '翻译成英文' : '翻译成中文'}</span>
                  </motion.button>
                )}
              </div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 md:p-8 border border-orange-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="text-gray-700 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={createSafeHtml(getDisplayContent())}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 底部返回 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => navigate('/')}
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
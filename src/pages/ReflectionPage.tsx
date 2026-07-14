import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Feather, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Reflection, Language } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { ConfirmDialog, useConfirmDialog } from '@/components/common/ConfirmDialog';
import { getTags, getReflectionContentAsync } from '@/utils/bilingualHelpers';
import { formatDateByLang } from '@/utils/dateUtils';
import { useState, useEffect } from 'react';

// 辅助函数：根据语言获取双语言字段
const getReflectionContent = (reflection: Reflection, lang: Language) => {
  const zhContent = reflection.contentZh || '';
  const enContent = reflection.contentEn || '';
  if (lang === 'zh') {
    return zhContent || enContent || '无内容';
  }
  return enContent || zhContent || 'No Content';
};

export default function ReflectionPage() {
  const navigate = useNavigate();
  const { reflections, deleteReflection } = useData();
  const { language, t } = useLanguage();
  const { isEditMode } = useEditMode();
  const { confirm, dialogProps } = useConfirmDialog();

  // 翻译状态
  const [translatedContents, setTranslatedContents] = useState<Map<string, string>>(new Map());
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());

  // 按日期降序排序（最新的在前）
  const sortedReflections = [...reflections].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 当语言或反思列表变化时，自动翻译缺失的内容
  useEffect(() => {
    const translateContents = async () => {
      // 并行翻译所有反思的内容
      const translations = await Promise.all(
        sortedReflections.map(async (reflection) => {
          // 检查是否需要翻译
          const zhContent = reflection.contentZh || '';
          const enContent = reflection.contentEn || '';
          const needsTranslation = (language === 'zh' && !zhContent && enContent) ||
                                   (language === 'en' && !enContent && zhContent);

          if (needsTranslation) {
            setTranslatingIds(prev => new Set(prev).add(reflection.id));
            const translated = await getReflectionContentAsync(reflection, language);
            setTranslatingIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(reflection.id);
              return newSet;
            });
            return { id: reflection.id, content: translated };
          } else {
            // 不需要翻译，直接返回原内容
            return { id: reflection.id, content: getReflectionContent(reflection, language) };
          }
        })
      );

      // 更新翻译内容映射
      const newMap = new Map<string, string>();
      translations.forEach(({ id, content }) => {
        newMap.set(id, content);
      });
      setTranslatedContents(newMap);
    };

    translateContents();
  }, [language, sortedReflections]);

  const handleDelete = async (id: string, reflection: Reflection) => {
    const content = getReflectionContent(reflection, language);
    const previewContent = content.length > 50 ? content.substring(0, 50) + '...' : content;
    const confirmed = await confirm({
      title: language === 'zh' ? '确认删除' : 'Confirm Delete',
      message: language === 'zh'
        ? `确定要删除这条反思吗？\n\n"${previewContent}"\n\n此操作无法撤销。`
        : `Are you sure you want to delete this reflection?\n\n"${previewContent}"\n\nThis action cannot be undone.`,
      type: 'danger',
      confirmText: language === 'zh' ? '删除' : 'Delete',
      cancelText: language === 'zh' ? '取消' : 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteReflection(id);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 relative">
      {/* 确认对话框 */}
      <ConfirmDialog {...dialogProps} />
      {/* 书页纹理背景 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(0,0,0,.03) 100px, rgba(0,0,0,.03) 101px)',
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t.nav.reflection}
              </h1>
            </div>
            {isEditMode && (
              <motion.button
                onClick={() => navigate('/reflection/create')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>{t.reflection.createNew}</span>
              </motion.button>
            )}
          </div>
          <p className="text-gray-600 text-lg">
            {t.reflection.subtitle}
          </p>
        </motion.div>

        {/* 反思卡片列表 */}
        <div className="space-y-6">
          {sortedReflections.map((reflection, index) => (
            <motion.div
              key={reflection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              {/* 书页卡片 */}
              <div className="relative bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                {/* 纸张折叠效果 */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-transparent via-green-50 to-green-100 opacity-50" />
                <div className="absolute top-0 right-0 w-8 h-8 border-l-8 border-l-transparent border-t-8 border-t-green-200" />

                <div className="p-6 md:p-8 pl-10">
                  {/* 左侧书脊装饰 */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-green-100 to-transparent" />

                  {/* 反思内容 */}
                  <div className="relative mb-4">
                    {/* 手写装饰 */}
                    <motion.div
                      className="absolute -top-1 left-0"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Feather className="w-5 h-5 text-green-400" />
                    </motion.div>

                    <div className="relative ml-8">
                      {/* 引号装饰 */}
                      <div className="absolute -top-3 -left-3 text-5xl text-green-200 font-serif">
                        "
                      </div>
                      <div className="flex items-center gap-2 pl-6 pt-2">
                        <p className="text-gray-800 text-lg md:text-xl leading-relaxed relative z-10 font-serif italic">
                          {translatedContents.get(reflection.id) || getReflectionContent(reflection, language)}
                        </p>
                        {translatingIds.has(reflection.id) && (
                          <Loader2 className="w-5 h-5 text-green-500 animate-spin flex-shrink-0" />
                        )}
                      </div>
                      <div className="absolute -bottom-3 -right-3 text-5xl text-green-200 font-serif text-right">
                        "
                      </div>
                    </div>
                  </div>

                  {/* 元数据 */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6 ml-8">
                    <motion.div
                      className="flex items-center gap-2 text-sm text-gray-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{formatDateByLang(reflection.date, language)}</span>
                    </motion.div>

                    {/* 标签 */}
                    {getTags(reflection, language).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {getTags(reflection, language).map((tag) => (
                          <motion.span
                            key={tag}
                            className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium border border-green-200"
                            whileHover={{ scale: 1.1 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 - 仅编辑模式显示 */}
                  {isEditMode && (
                    <div className="flex items-center justify-end gap-2 mt-6 ml-8">
                      <motion.button
                        onClick={() => navigate(`/reflection/edit/${reflection.id}`)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="w-4 h-4" />
                        <span>{t.reflection.edit}</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(reflection.id, reflection);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
                        <span className="pointer-events-none">{t.reflection.delete}</span>
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* 底部书页边缘 */}
                <div className="h-1 bg-gradient-to-r from-green-100 via-emerald-50 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {reflections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t.common.noData}</p>
          </motion.div>
        )}

        {/* 返回首页 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
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
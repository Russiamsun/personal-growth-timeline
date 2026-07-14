import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Question, Language } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { ConfirmDialog, useConfirmDialog } from '@/components/common/ConfirmDialog';
import { getTags, getQuestionTextAsync, getThoughtsAsync } from '@/utils/bilingualHelpers';
import { formatDateByLang } from '@/utils/dateUtils';

// 辅助函数：根据语言获取双语言字段
const getQuestionText = (question: Question, lang: Language) => {
  const zhText = question.questionZh || '';
  const enText = question.questionEn || '';
  if (lang === 'zh') {
    return zhText || enText || '无问题';
  }
  return enText || zhText || 'No Question';
};

const getThoughts = (question: Question, lang: Language) => {
  const zhThoughts = question.thoughtsZh || '';
  const enThoughts = question.thoughtsEn || '';
  if (lang === 'zh') {
    return zhThoughts || enThoughts || '';
  }
  return enThoughts || zhThoughts || '';
};

export default function QuestionsPage() {
  const navigate = useNavigate();
  const { questions, deleteQuestion } = useData();
  const { language, t } = useLanguage();
  const { isEditMode } = useEditMode();
  const { confirm, dialogProps } = useConfirmDialog();

  // 翻译状态管理
  const [translatedQuestions, setTranslatedQuestions] = useState<Record<string, { question: string; thoughts: string }>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());

  // 按日期降序排序（最新的在前）
  const sortedQuestions = [...questions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 当语言变化时，自动翻译所有问题
  useEffect(() => {
    const translateAllQuestions = async () => {
      const newTranslatedQuestions: Record<string, { question: string; thoughts: string }> = {};
      const idsToTranslate = new Set<string>();

      // 标记正在翻译的问题
      sortedQuestions.forEach(q => {
        idsToTranslate.add(q.id);
      });
      setTranslatingIds(idsToTranslate);

      // 并行翻译所有问题
      await Promise.all(
        sortedQuestions.map(async (question) => {
          try {
            const [translatedQuestion, translatedThoughts] = await Promise.all([
              getQuestionTextAsync(question, language),
              getThoughtsAsync(question, language),
            ]);
            newTranslatedQuestions[question.id] = {
              question: translatedQuestion,
              thoughts: translatedThoughts,
            };
          } catch (error) {
            console.error('翻译失败:', error);
            // 翻译失败时使用原始值
            newTranslatedQuestions[question.id] = {
              question: getQuestionText(question, language),
              thoughts: getThoughts(question, language),
            };
          } finally {
            setTranslatingIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(question.id);
              return newSet;
            });
          }
        })
      );

      setTranslatedQuestions(newTranslatedQuestions);
    };

    if (sortedQuestions.length > 0) {
      translateAllQuestions();
    }
  }, [language, sortedQuestions.length]);

  const handleDelete = async (id: string, question: Question) => {
    const questionText = getQuestionText(question, language);
    const confirmed = await confirm({
      title: language === 'zh' ? '确认删除' : 'Confirm Delete',
      message: language === 'zh'
        ? `确定要删除这个问题吗？\n\n"${questionText}"\n\n此操作无法撤销。`
        : `Are you sure you want to delete this question?\n\n"${questionText}"\n\nThis action cannot be undone.`,
      type: 'danger',
      confirmText: language === 'zh' ? '删除' : 'Delete',
      cancelText: language === 'zh' ? '取消' : 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteQuestion(id);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-8">
      {/* 确认对话框 */}
      <ConfirmDialog {...dialogProps} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-violet-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t.nav.questions}
              </h1>
            </div>
            {isEditMode && (
              <motion.button
                onClick={() => navigate('/question/create')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>{t.questions.createNew}</span>
              </motion.button>
            )}
          </div>
          <p className="text-gray-600 text-lg">
            {t.questions.subtitle}
          </p>
        </motion.div>

        {/* 问题列表 */}
        <div className="space-y-8">
          {sortedQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="relative bg-white rounded-xl shadow-sm border-2 border-violet-100 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-300">
                {/* 装饰性顶部渐变 */}
                <div className="h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400" />

                {/* 顶部星星装饰 */}
                <motion.div
                  className="absolute top-3 right-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </motion.div>

                <div className="p-6 md:p-8">
                  {/* 问题标题 */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 leading-tight">
                          {translatedQuestions[question.id]?.question || getQuestionText(question, language)}
                        </h2>
                        {translatingIds.has(question.id) && (
                          <Loader2 className="w-5 h-5 text-violet-500 animate-spin mb-2" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1 bg-violet-50 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-4 h-4 text-violet-500" />
                          <span>{formatDateByLang(question.date, language)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 思考内容 */}
                  {(question.thoughtsZh || question.thoughtsEn) && (
                    <motion.div
                      className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-5 md:p-6 border-l-4 border-violet-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                        <p className="text-sm font-medium text-violet-600">
                          {language === 'zh' ? '我的思考' : 'My Thoughts'}
                        </p>
                      </div>
                      {translatingIds.has(question.id) ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                          <span className="ml-2 text-gray-500">
                            {language === 'zh' ? '正在翻译...' : 'Translating...'}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {translatedQuestions[question.id]?.thoughts || getThoughts(question, language)}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* 标签 */}
                  {getTags(question, language).length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {getTags(question, language).map((tag) => (
                        <motion.span
                          key={tag}
                          className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-medium border border-violet-200"
                          whileHover={{ scale: 1.1 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* 操作按钮 - 仅编辑模式显示 */}
                  {isEditMode && (
                    <div className="mt-6 flex items-center justify-end gap-2">
                      <motion.button
                        onClick={() => navigate(`/question/edit/${question.id}`)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="w-4 h-4" />
                        <span>{t.questions.edit}</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(question.id, question);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
                        <span className="pointer-events-none">{t.questions.delete}</span>
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* 底部装饰 */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-violet-100 to-transparent opacity-30 rounded-tl-full pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {questions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <Sparkles className="w-16 h-16 text-violet-400 mx-auto mb-4" />
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
            className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
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
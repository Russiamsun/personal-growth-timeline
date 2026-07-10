import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle, Calendar, Tag, HelpCircle, Sparkles } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';

type InputMode = 'both' | 'zh' | 'en';

export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { questions, updateQuestion } = useData();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputMode, setInputMode] = useState<InputMode>('both');

  const question = questions.find(q => q.id === id);

  const [formData, setFormData] = useState({
    questionZh: '',
    questionEn: '',
    thoughtsZh: '',
    thoughtsEn: '',
    date: new Date().toISOString().split('T')[0],
    tagsZh: '',
    tagsEn: '',
  });

  useEffect(() => {
    if (question) {
      setFormData({
        questionZh: question.questionZh || '',
        questionEn: question.questionEn || '',
        thoughtsZh: question.thoughtsZh || '',
        thoughtsEn: question.thoughtsEn || '',
        date: question.date,
        tagsZh: (question.tagsZh || []).join(','),
        tagsEn: (question.tagsEn || []).join(','),
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [question]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.questionZh.trim() && !formData.questionEn.trim()) {
      newErrors.question = t.form.errorQuestion;
    }

    if (!formData.date) {
      newErrors.date = t.form.errorDate;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsZh = formData.tagsZh
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const tagsEn = formData.tagsEn
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await updateQuestion(id, {
        questionZh: formData.questionZh.trim(),
        questionEn: formData.questionEn.trim(),
        thoughtsZh: formData.thoughtsZh.trim() || undefined,
        thoughtsEn: formData.thoughtsEn.trim() || undefined,
        date: formData.date,
        tagsZh: tagsZh.length > 0 ? tagsZh : undefined,
        tagsEn: tagsEn.length > 0 ? tagsEn : undefined,
      });

      navigate('/questions');
    } catch (error: any) {
      console.error('更新失败:', error);
      alert(`${t.form.errorSave}: ${error.message || t.common.loading}`);
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common.loading}</p>
        </motion.div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{t.common.noData}</p>
          <button
            onClick={() => navigate('/questions')}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            {t.form.back}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* 顶部导航 */}
      <motion.div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-violet-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.form.back}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 主内容区 */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-violet-500" />
            <h1 className="text-3xl font-bold text-gray-900">{t.form.editQuestion}</h1>
          </div>
          <p className="text-gray-600">{t.questions.subtitle}</p>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-violet-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400" />

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* 输入模式切换 */}
            <div className="flex gap-2 border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => setInputMode('both')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputMode === 'both'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.form.inputBoth}
              </button>
              <button
                type="button"
                onClick={() => setInputMode('zh')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputMode === 'zh'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.form.inputZh}
              </button>
              <button
                type="button"
                onClick={() => setInputMode('en')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputMode === 'en'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.form.inputEn}
              </button>
            </div>

            {/* 问题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HelpCircle className="w-4 h-4 inline mr-2 text-violet-500" />
                {t.form.question} <span className="text-red-500">*</span>
              </label>
              {inputMode === 'both' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.questionZh}</label>
                    <input
                      type="text"
                      value={formData.questionZh}
                      onChange={(e) => handleChange('questionZh', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        errors.question ? 'border-red-500' : 'border-gray-200 hover:border-violet-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.questionEn}</label>
                    <input
                      type="text"
                      value={formData.questionEn}
                      onChange={(e) => handleChange('questionEn', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        errors.question ? 'border-red-500' : 'border-gray-200 hover:border-violet-300'
                      }`}
                    />
                  </div>
                </div>
              ) : inputMode === 'zh' ? (
                <input
                  type="text"
                  value={formData.questionZh}
                  onChange={(e) => handleChange('questionZh', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.question ? 'border-red-500' : 'border-gray-200 hover:border-violet-300'
                  }`}
                />
              ) : (
                <input
                  type="text"
                  value={formData.questionEn}
                  onChange={(e) => handleChange('questionEn', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.question ? 'border-red-500' : 'border-gray-200 hover:border-violet-300'
                  }`}
                />
              )}
              {errors.question && (
                <p className="text-red-500 text-sm mt-1">{errors.question}</p>
              )}
            </div>

            {/* 思考内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.thoughts}
              </label>
              {inputMode === 'both' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.thoughtsZh}</label>
                    <textarea
                      value={formData.thoughtsZh}
                      onChange={(e) => handleChange('thoughtsZh', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.thoughtsEn}</label>
                    <textarea
                      value={formData.thoughtsEn}
                      onChange={(e) => handleChange('thoughtsEn', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  </div>
                </div>
              ) : inputMode === 'zh' ? (
                <textarea
                  value={formData.thoughtsZh}
                  onChange={(e) => handleChange('thoughtsZh', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              ) : (
                <textarea
                  value={formData.thoughtsEn}
                  onChange={(e) => handleChange('thoughtsEn', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              )}
            </div>

            {/* 日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2 text-violet-500" />
                {t.form.date} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-200 hover:border-violet-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2 text-violet-500" />
                {t.form.tags}
              </label>
              {inputMode === 'both' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.tagsZh}</label>
                    <input
                      type="text"
                      value={formData.tagsZh}
                      onChange={(e) => handleChange('tagsZh', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.tagsEn}</label>
                    <input
                      type="text"
                      value={formData.tagsEn}
                      onChange={(e) => handleChange('tagsEn', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              ) : inputMode === 'zh' ? (
                <input
                  type="text"
                  value={formData.tagsZh}
                  onChange={(e) => handleChange('tagsZh', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              ) : (
                <input
                  type="text"
                  value={formData.tagsEn}
                  onChange={(e) => handleChange('tagsEn', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              )}
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.form.cancel}
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? t.common.loading : t.form.update}
              </motion.button>
            </div>
          </form>
        </div>

        {/* 成功提示 */}
        {isSubmitting && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.form.success}</h3>
              <p className="text-gray-600">{t.common.loading}</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
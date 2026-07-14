import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, Tag, BookOpen, Feather } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBilingualForm, InputMode } from '@/hooks/useBilingualForm';
import { useFormValidation } from '@/hooks/useFormValidation';
import { InputModeSelector, BilingualInputField, TextInput } from '@/components/forms/FormFields';

export default function CreateReflectionPage() {
  const navigate = useNavigate();
  const { addReflection } = useData();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { inputMode, setInputMode } = useBilingualForm('both');
  const { errors, validate, clearError } = useFormValidation();

  const [formData, setFormData] = useState({
    contentZh: '',
    contentEn: '',
    date: new Date().toISOString().split('T')[0],
    tagsZh: '',
    tagsEn: '',
  });

  const validationRules = {
    content: {
      required: true,
      message: t.form.errorReflection,
      custom: () => !!(formData.contentZh.trim() || formData.contentEn.trim()),
    },
    date: {
      required: true,
      message: t.form.errorDate,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(
      {
        content: formData.contentZh || formData.contentEn,
        date: formData.date,
      },
      validationRules
    );

    if (!isValid) {
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

      await addReflection({
        contentZh: formData.contentZh.trim(),
        contentEn: formData.contentEn.trim(),
        date: formData.date,
        tagsZh: tagsZh.length > 0 ? tagsZh : undefined,
        tagsEn: tagsEn.length > 0 ? tagsEn : undefined,
      });

      navigate('/reflection');
    } catch (error: any) {
      console.error('创建失败:', error);
      alert(`${t.form.errorSave}: ${error.message || t.common.loading}`);
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearError(field);
    }
  };

  const showBoth = inputMode === 'both';
  const showZh = inputMode === 'zh' || showBoth;
  const showEn = inputMode === 'en' || showBoth;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* 顶部导航 */}
      <motion.div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-green-200"
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
            <BookOpen className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">{t.form.createReflection}</h1>
          </div>
          <p className="text-gray-600">{t.reflection.subtitle}</p>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-green-200 overflow-hidden relative">
          {/* 纸张折叠效果 */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-transparent via-green-50 to-green-100 opacity-50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-l-8 border-l-transparent border-t-8 border-t-green-200" />

          {/* 左侧书脊装饰 */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-green-100 to-transparent" />

          <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

          <form onSubmit={handleSubmit} className="p-6 md:p-8 pl-10 space-y-6 relative">
            {/* 输入模式切换 */}
            <InputModeSelector
              value={inputMode}
              onChange={setInputMode}
              labels={{
                both: t.form.inputBoth,
                zh: t.form.inputZh,
                en: t.form.inputEn,
              }}
              colorScheme="green"
            />

            {/* 反思内容 - 使用特殊样式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Feather className="w-4 h-4 inline mr-2 text-green-500 animate-pulse" />
                {t.form.reflectionContent} <span className="text-red-500">*</span>
              </label>
              {showBoth ? (
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute -top-3 -left-3 text-5xl text-green-200 font-serif">
                      "
                    </div>
                    <label className="block text-xs text-gray-500 mb-1 ml-6">{t.form.reflectionContentZh}</label>
                    <textarea
                      value={formData.contentZh}
                      onChange={(e) => handleChange('contentZh', e.target.value)}
                      rows={8}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 resize-none relative pl-6 pt-2 font-serif italic ${
                        errors.content ? 'border-red-500' : 'border-gray-200 hover:border-green-300'
                      }`}
                    />
                    <div className="absolute -bottom-3 -right-3 text-5xl text-green-200 font-serif text-right">
                      "
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-gray-500 mb-1">{t.form.reflectionContentEn}</label>
                    <textarea
                      value={formData.contentEn}
                      onChange={(e) => handleChange('contentEn', e.target.value)}
                      rows={8}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                        errors.content ? 'border-red-500' : 'border-gray-200 hover:border-green-300'
                      }`}
                    />
                  </div>
                </div>
              ) : showZh ? (
                <div className="relative">
                  <div className="absolute -top-3 -left-3 text-5xl text-green-200 font-serif">
                    "
                  </div>
                  <textarea
                    value={formData.contentZh}
                    onChange={(e) => handleChange('contentZh', e.target.value)}
                    rows={8}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 resize-none relative pl-6 pt-2 font-serif italic ${
                      errors.content ? 'border-red-500' : 'border-gray-200 hover:border-green-300'
                    }`}
                  />
                  <div className="absolute -bottom-3 -right-3 text-5xl text-green-200 font-serif text-right">
                    "
                  </div>
                </div>
              ) : (
                <textarea
                  value={formData.contentEn}
                  onChange={(e) => handleChange('contentEn', e.target.value)}
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-200 hover:border-green-300'
                  }`}
                />
              )}
              {errors.content && (
                <p className="text-red-500 text-sm mt-1 ml-6">{errors.content}</p>
              )}
            </div>

            {/* 日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2 text-green-500" />
                {t.form.date} <span className="text-red-500">*</span>
              </label>
              <TextInput
                type="date"
                value={formData.date}
                onChange={(value) => handleChange('date', value)}
                error={errors.date}
                colorScheme="green"
              />
            </div>

            {/* 标签 */}
            <BilingualInputField
              label={t.form.tags}
              labelZh={t.form.tagsZh}
              labelEn={t.form.tagsEn}
              valueZh={formData.tagsZh}
              valueEn={formData.tagsEn}
              onChangeZh={(value) => handleChange('tagsZh', value)}
              onChangeEn={(value) => handleChange('tagsEn', value)}
              inputMode={inputMode}
              type="text"
              colorScheme="green"
            />

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
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? t.common.loading : t.form.submit}
              </motion.button>
            </div>
          </form>

          {/* 底部书页边缘 */}
          <div className="h-1 bg-gradient-to-r from-green-100 via-emerald-50 to-transparent" />
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
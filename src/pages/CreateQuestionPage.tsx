import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, Tag, HelpCircle, Sparkles } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBilingualForm } from '@/hooks/useBilingualForm';
import { useFormValidation } from '@/hooks/useFormValidation';
import { InputModeSelector, BilingualInputField, TextInput, TextArea } from '@/components/forms/FormFields';

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const { addQuestion } = useData();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { inputMode, setInputMode } = useBilingualForm('both');
  const { errors, validate, clearError } = useFormValidation();

  const [formData, setFormData] = useState({
    questionZh: '',
    questionEn: '',
    thoughtsZh: '',
    thoughtsEn: '',
    date: new Date().toISOString().split('T')[0],
    tagsZh: '',
    tagsEn: '',
  });

  const validationRules = {
    question: {
      required: true,
      message: t.form.errorQuestion,
      custom: () => !!(formData.questionZh.trim() || formData.questionEn.trim()),
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
        question: formData.questionZh || formData.questionEn,
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

      await addQuestion({
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
            <h1 className="text-3xl font-bold text-gray-900">{t.form.createQuestion}</h1>
          </div>
          <p className="text-gray-600">{t.questions.subtitle}</p>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-violet-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400" />

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* 输入模式切换 */}
            <InputModeSelector
              value={inputMode}
              onChange={setInputMode}
              labels={{
                both: t.form.inputBoth,
                zh: t.form.inputZh,
                en: t.form.inputEn,
              }}
              colorScheme="violet"
            />

            {/* 问题 */}
            <BilingualInputField
              label={`${t.form.question}`}
              labelZh={t.form.questionZh}
              labelEn={t.form.questionEn}
              valueZh={formData.questionZh}
              valueEn={formData.questionEn}
              onChangeZh={(value) => handleChange('questionZh', value)}
              onChangeEn={(value) => handleChange('questionEn', value)}
              inputMode={inputMode}
              type="text"
              error={errors.question}
              required
              colorScheme="violet"
              showTranslate
            />

            {/* 思考内容 */}
            <BilingualInputField
              label={t.form.thoughts}
              labelZh={t.form.thoughtsZh}
              labelEn={t.form.thoughtsEn}
              valueZh={formData.thoughtsZh}
              valueEn={formData.thoughtsEn}
              onChangeZh={(value) => handleChange('thoughtsZh', value)}
              onChangeEn={(value) => handleChange('thoughtsEn', value)}
              inputMode={inputMode}
              type="textarea"
              rows={6}
              colorScheme="violet"
              showTranslate
            />

            {/* 日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2 text-violet-500" />
                {t.form.date} <span className="text-red-500">*</span>
              </label>
              <TextInput
                type="date"
                value={formData.date}
                onChange={(value) => handleChange('date', value)}
                error={errors.date}
                colorScheme="violet"
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
              colorScheme="violet"
              showTranslate
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
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? t.common.loading : t.form.submit}
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
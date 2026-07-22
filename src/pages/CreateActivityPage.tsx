import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, MapPin, Tag, FileText, Sparkles, Image } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActivityType, ActivityTypeConfig, Photo } from '@/types';
import PhotoUploader from '@/components/PhotoUploader';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useBilingualForm } from '@/hooks/useBilingualForm';
import { BilingualInputField, InputModeSelector, TextInput } from '@/components/forms/FormFields';
import { parseTags } from '@/utils/bilingualHelpers';

export default function CreateActivityPage() {
  const navigate = useNavigate();
  const { addActivity } = useData();
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validate, clearError } = useFormValidation();
  const { inputMode, setInputMode } = useBilingualForm();

  const [formData, setFormData] = useState({
    type: 'charity' as ActivityType,
    titleZh: '',
    titleEn: '',
    descriptionZh: '',
    descriptionEn: '',
    contentZh: '',
    contentEn: '',
    date: new Date().toISOString().split('T')[0],
    locationZh: '',
    locationEn: '',
    tagsZh: '',
    tagsEn: '',
    photos: [] as Photo[],
  });

  const validationRules = {
    title: {
      required: true,
      message: t.form.errorTitle,
      custom: () => !!(formData.titleZh.trim() || formData.titleEn.trim()),
    },
    description: {
      required: true,
      message: t.form.errorDescription,
      custom: () => !!(formData.descriptionZh.trim() || formData.descriptionEn.trim()),
    },
    content: {
      required: true,
      message: t.form.errorContent,
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
        title: formData.titleZh || formData.titleEn,
        description: formData.descriptionZh || formData.descriptionEn,
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
      const tagsZh = parseTags(formData.tagsZh);
      const tagsEn = parseTags(formData.tagsEn);

      await addActivity({
        type: formData.type,
        titleZh: formData.titleZh.trim(),
        titleEn: formData.titleEn.trim(),
        descriptionZh: formData.descriptionZh.trim(),
        descriptionEn: formData.descriptionEn.trim(),
        contentZh: formData.contentZh.trim(),
        contentEn: formData.contentEn.trim(),
        date: formData.date,
        locationZh: formData.locationZh.trim() || undefined,
        locationEn: formData.locationEn.trim() || undefined,
        photos: formData.photos,
        tagsZh,
        tagsEn,
      });

      navigate('/experiences');
    } catch (error: any) {
      console.error('创建失败:', error);
      alert(`${t.form.errorSave}: ${error.message || t.common.loading}`);
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(field);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* 顶部导航 */}
      <motion.div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-orange-200"
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
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">{t.form.createActivity}</h1>
          </div>
          <p className="text-gray-600">{t.experiences.subtitle}</p>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-orange-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-500" />

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* 活动类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.type} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(ActivityTypeConfig).map(([key, config]) => (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => handleChange('type', key)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      formData.type === key
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">{config.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{t.activityTypes[key as ActivityType]}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 输入模式切换 */}
            <InputModeSelector
              value={inputMode}
              onChange={setInputMode}
              labels={{
                both: t.form.inputBoth,
                zh: t.form.inputZh,
                en: t.form.inputEn,
              }}
              colorScheme="orange"
            />

            {/* 标题 */}
            <BilingualInputField
              label={t.form.title}
              labelZh={t.form.titleZh}
              labelEn={t.form.titleEn}
              valueZh={formData.titleZh}
              valueEn={formData.titleEn}
              onChangeZh={(value) => handleChange('titleZh', value)}
              onChangeEn={(value) => handleChange('titleEn', value)}
              inputMode={inputMode}
              error={errors.title}
              required
              colorScheme="orange"
              showTranslate
            />

            {/* 描述 */}
            <BilingualInputField
              label={t.form.description}
              labelZh={t.form.descriptionZh}
              labelEn={t.form.descriptionEn}
              valueZh={formData.descriptionZh}
              valueEn={formData.descriptionEn}
              onChangeZh={(value) => handleChange('descriptionZh', value)}
              onChangeEn={(value) => handleChange('descriptionEn', value)}
              inputMode={inputMode}
              error={errors.description}
              required
              colorScheme="orange"
              showTranslate
            />

            {/* 内容 */}
            <BilingualInputField
              label={t.form.content}
              labelZh={t.form.contentZh}
              labelEn={t.form.contentEn}
              valueZh={formData.contentZh}
              valueEn={formData.contentEn}
              onChangeZh={(value) => handleChange('contentZh', value)}
              onChangeEn={(value) => handleChange('contentEn', value)}
              inputMode={inputMode}
              type="textarea"
              rows={6}
              error={errors.content}
              required
              colorScheme="orange"
              showTranslate
            />

            {/* 日期和地点 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2 text-orange-500" />
                  {t.form.date} <span className="text-red-500">*</span>
                </label>
                <TextInput
                  type="date"
                  value={formData.date}
                  onChange={(value) => handleChange('date', value)}
                  error={errors.date}
                  colorScheme="orange"
                />
              </div>

              <BilingualInputField
                label={t.form.location}
                labelZh={t.form.locationZh}
                labelEn={t.form.locationEn}
                valueZh={formData.locationZh}
                valueEn={formData.locationEn}
                onChangeZh={(value) => handleChange('locationZh', value)}
                onChangeEn={(value) => handleChange('locationEn', value)}
                inputMode={inputMode}
                colorScheme="orange"
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
              colorScheme="orange"
              placeholder={language === 'zh' ? '多个标签用逗号分隔' : 'Separate tags with commas'}
            />

            {/* 照片管理 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-2 text-orange-500" />
                {t.form.photos}
              </label>
              <PhotoUploader
                photos={formData.photos}
                onChange={(photos) => setFormData({ ...formData, photos })}
              />
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
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
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
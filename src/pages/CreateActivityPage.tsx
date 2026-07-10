import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, MapPin, Tag, FileText, Sparkles, Image } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActivityType, ActivityTypeConfig, Photo } from '@/types';
import PhotoUploader from '@/components/PhotoUploader';

type InputMode = 'both' | 'zh' | 'en';

export default function CreateActivityPage() {
  const navigate = useNavigate();
  const { addActivity } = useData();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputMode, setInputMode] = useState<InputMode>('both');

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titleZh.trim() && !formData.titleEn.trim()) {
      newErrors.title = t.form.errorTitle;
    }

    if (!formData.descriptionZh.trim() && !formData.descriptionEn.trim()) {
      newErrors.description = t.form.errorDescription;
    }

    if (!formData.contentZh.trim() && !formData.contentEn.trim()) {
      newErrors.content = t.form.errorContent;
    }

    if (!formData.date) {
      newErrors.date = t.form.errorDate;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
            <div className="flex gap-2 border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => setInputMode('both')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputMode === 'both'
                    ? 'bg-orange-500 text-white shadow-md'
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
                    ? 'bg-orange-500 text-white shadow-md'
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
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.form.inputEn}
              </button>
            </div>

            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2 text-orange-500" />
                {t.form.title} <span className="text-red-500">*</span>
              </label>
              {inputMode === 'both' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.titleZh}</label>
                    <input
                      type="text"
                      value={formData.titleZh}
                      onChange={(e) => handleChange('titleZh', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.titleEn}</label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => handleChange('titleEn', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    />
                  </div>
                </div>
              ) : inputMode === 'zh' ? (
                <input
                  type="text"
                  value={formData.titleZh}
                  onChange={(e) => handleChange('titleZh', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
              ) : (
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => handleChange('titleEn', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
              )}
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.description} <span className="text-red-500">*</span>
              </label>
              {inputMode === 'both' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.descriptionZh}</label>
                    <input
                      type="text"
                      value={formData.descriptionZh}
                      onChange={(e) => handleChange('descriptionZh', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.descriptionEn}</label>
                    <input
                      type="text"
                      value={formData.descriptionEn}
                      onChange={(e) => handleChange('descriptionEn', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    />
                  </div>
                </div>
              ) : inputMode === 'zh' ? (
                <input
                  type="text"
                  value={formData.descriptionZh}
                  onChange={(e) => handleChange('descriptionZh', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
              ) : (
                <input
                  type="text"
                  value={formData.descriptionEn}
                  onChange={(e) => handleChange('descriptionEn', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
              )}
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* 内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.content} <span className="text-red-500">*</span>
              </label>
              {inputMode === 'both' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.contentZh}</label>
                    <textarea
                      value={formData.contentZh}
                      onChange={(e) => handleChange('contentZh', e.target.value)}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                        errors.content ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.contentEn}</label>
                    <textarea
                      value={formData.contentEn}
                      onChange={(e) => handleChange('contentEn', e.target.value)}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                        errors.content ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    />
                  </div>
                </div>
              ) : inputMode === 'zh' ? (
                <textarea
                  value={formData.contentZh}
                  onChange={(e) => handleChange('contentZh', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
              ) : (
                <textarea
                  value={formData.contentEn}
                  onChange={(e) => handleChange('contentEn', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
              )}
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            {/* 日期和地点 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2 text-orange-500" />
                  {t.form.date} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2 text-orange-500" />
                  {t.form.location}
                </label>
                {inputMode === 'both' ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{t.form.locationZh}</label>
                      <input
                        type="text"
                        value={formData.locationZh}
                        onChange={(e) => handleChange('locationZh', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{t.form.locationEn}</label>
                      <input
                        type="text"
                        value={formData.locationEn}
                        onChange={(e) => handleChange('locationEn', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                ) : inputMode === 'zh' ? (
                  <input
                    type="text"
                    value={formData.locationZh}
                    onChange={(e) => handleChange('locationZh', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.locationEn}
                    onChange={(e) => handleChange('locationEn', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                )}
              </div>
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2 text-orange-500" />
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
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t.form.tagsEn}</label>
                    <input
                      type="text"
                      value={formData.tagsEn}
                      onChange={(e) => handleChange('tagsEn', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              ) : inputMode === 'zh' ? (
                <input
                  type="text"
                  value={formData.tagsZh}
                  onChange={(e) => handleChange('tagsZh', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <input
                  type="text"
                  value={formData.tagsEn}
                  onChange={(e) => handleChange('tagsEn', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              )}
            </div>

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
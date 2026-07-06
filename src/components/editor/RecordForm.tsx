import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Save, AlertCircle } from 'lucide-react';
import { TimeRecord, Mood, Photo } from '@/types';
import { PhotoUploader } from './PhotoUploader';
import { MoodSelector } from './MoodSelector';
import { TagInput } from './TagInput';
import { RichTextEditor } from './RichTextEditor';
import { cn } from '@/lib/utils';

interface RecordFormProps {
  initialData?: TimeRecord;
  onSubmit: (data: Omit<TimeRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isSubmitting?: boolean;
  className?: string;
}

interface FormData {
  title: string;
  content: string;
  recordDate: string;
  mood?: Mood;
  location: string;
  tags: string[];
  photos: Photo[];
  year: number;
}

interface FormErrors {
  title?: string;
  content?: string;
  recordDate?: string;
}

export function RecordForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  className,
}: RecordFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    recordDate: new Date().toISOString().split('T')[0],
    location: '',
    tags: [],
    photos: [],
    year: new Date().getFullYear(),
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        recordDate: initialData.recordDate,
        mood: initialData.mood,
        location: initialData.location || '',
        tags: initialData.tags,
        photos: initialData.photos,
        year: initialData.year,
      });
    }
  }, [initialData]);

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入标题';
    } else if (formData.title.length > 100) {
      newErrors.title = '标题不能超过100个字符';
    }

    if (!formData.content.trim()) {
      newErrors.content = '请输入内容';
    }

    if (!formData.recordDate) {
      newErrors.recordDate = '请选择日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 更新字段
  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  // 处理日期变更，自动提取年份
  const handleDateChange = (date: string) => {
    const year = new Date(date).getFullYear();
    updateField('recordDate', date);
    updateField('year', year);
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      content: formData.content,
      recordDate: formData.recordDate,
      mood: formData.mood,
      location: formData.location.trim() || undefined,
      tags: formData.tags,
      photos: formData.photos,
      year: formData.year,
    });
  };

  // 建议标签
  const suggestedTags = [
    '旅行', '美食', '运动', '读书', '音乐', '电影',
    '工作', '学习', '家庭', '朋友', '纪念日', '生日',
  ];

  return (
    <form onSubmit={handleSubmit} className={cn('record-form', className)}>
      {/* 标题 */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="给这段时光起个名字"
          className={cn(
            'w-full px-4 py-3 border rounded-lg outline-none transition-all',
            errors.title
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          )}
          maxLength={100}
        />
        {errors.title && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.title}
          </motion.p>
        )}
      </div>

      {/* 日期和地点 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 日期选择 */}
        <div>
          <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline-block mr-1.5" />
            日期 <span className="text-red-500">*</span>
          </label>
          <input
            id="recordDate"
            type="date"
            value={formData.recordDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg outline-none transition-all',
              errors.recordDate
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            )}
          />
          {errors.recordDate && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.recordDate}
            </motion.p>
          )}
        </div>

        {/* 地点输入 */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline-block mr-1.5" />
            地点
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="记录发生的地点"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            maxLength={50}
          />
        </div>
      </div>

      {/* 心情选择器 */}
      <div className="mb-6">
        <MoodSelector
          value={formData.mood}
          onChange={(mood) => updateField('mood', mood)}
        />
      </div>

      {/* 标签输入 */}
      <div className="mb-6">
        <TagInput
          tags={formData.tags}
          onChange={(tags) => updateField('tags', tags)}
          suggestions={suggestedTags}
          maxTags={10}
        />
      </div>

      {/* 富文本编辑器 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          内容 <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={(content) => updateField('content', content)}
          placeholder="记录这段时光的故事..."
        />
        {errors.content && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.content}
          </motion.p>
        )}
      </div>

      {/* 照片上传 */}
      <div className="mb-8">
        <PhotoUploader
          photos={formData.photos}
          onChange={(photos) => updateField('photos', photos)}
          maxPhotos={9}
        />
      </div>

      {/* 提交按钮 */}
      <div className="flex items-center justify-end gap-4">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all',
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
          )}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? '保存中...' : (initialData ? '更新记录' : '创建记录')}
        </motion.button>
      </div>
    </form>
  );
}
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Edit2, Trash2, Tag, Clock } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { PhotoGallery } from '@/components/record/PhotoGallery';
import { MoodIcon } from '@/components/record/MoodIcon';
import { ThemeConfig } from '@/types';

export default function RecordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, isLoading, loadRecords, getRecordById, deleteRecord } = useRecords();

  useEffect(() => {
    if (records.length === 0) {
      loadRecords();
    }
  }, [records.length, loadRecords]);

  const record = id ? getRecordById(id) : undefined;

  // 删除处理函数
  const handleDelete = async () => {
    if (!record) return;

    if (window.confirm('确定要删除这条记录吗？此操作无法撤销。')) {
      try {
        const success = await deleteRecord(record.id);
        if (success) {
          navigate('/');
        } else {
          alert('删除失败，请重试');
        }
      } catch (error: any) {
        console.error('删除失败:', error);
        alert(`删除失败: ${error.message || '请重试'}`);
      }
    }
  };

  // 格式化日期为中文格式
  const formatDateChinese = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
  };

  // 计算字数和阅读时间
  const contentText = record?.content.replace(/<[^>]*>/g, '') || '';
  const wordCount = contentText.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 400));

  // 主题配置
  const themeConfig = record?.theme ? ThemeConfig[record.theme] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-14">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-14">
        <p className="text-gray-500 mb-4">未找到该记录</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      {/* Hero 区域 */}
      <motion.div
        className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white py-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <motion.button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </motion.button>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 line-clamp-2">
            {record.title}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDateChinese(record.recordDate)}</span>
            </div>
            {themeConfig && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                <span>{themeConfig.icon}</span>
                <span>{themeConfig.label}</span>
              </div>
            )}
            {record.mood && (
              <MoodIcon mood={record.mood} size="sm" />
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate(`/edit/${record.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit2 className="w-4 h-4" />
              编辑
            </motion.button>
            <motion.button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-red-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              删除
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 主内容区 */}
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 - 左侧2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 照片画廊 */}
            {record.photos.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📷 照片 ({record.photos.length})
                </h2>
                <PhotoGallery photos={record.photos} />
              </motion.div>
            )}

            {/* 内容区 */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div
                className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: record.content }}
              />
            </motion.div>

            {/* 标签 */}
            {record.tags.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  标签
                </h2>
                <div className="flex flex-wrap gap-3">
                  {record.tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* 元信息侧边栏 - 右侧1/3 */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* 基本信息 */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">日期</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateChinese(record.recordDate)}
                      </div>
                    </div>
                  </div>

                  {record.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">地点</div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.location}
                        </div>
                      </div>
                    </div>
                  )}

                  {themeConfig && (
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{themeConfig.icon}</div>
                      <div>
                        <div className="text-xs text-gray-500">主题</div>
                        <div className="text-sm font-medium text-gray-900">
                          {themeConfig.label}
                        </div>
                      </div>
                    </div>
                  )}

                  {record.mood && (
                    <div className="flex items-center gap-3">
                      <MoodIcon mood={record.mood} size="md" />
                      <div>
                        <div className="text-xs text-gray-500">心情</div>
                        <div className="text-sm font-medium text-gray-900">
                          <MoodIcon mood={record.mood} showLabel />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 统计信息 */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">字数</span>
                    <span className="font-medium text-gray-900">{wordCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">阅读时间</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {readTime} 分钟
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">照片数</span>
                    <span className="font-medium text-gray-900">{record.photos.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">标签数</span>
                    <span className="font-medium text-gray-900">{record.tags.length}</span>
                  </div>
                </div>

                {/* 创建时间 */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-xs text-gray-500 mb-1">创建时间</div>
                  <div className="text-sm text-gray-600">
                    {new Date(record.createdAt).toLocaleString('zh-CN')}
                  </div>
                  {record.updatedAt !== record.createdAt && (
                    <div className="text-xs text-gray-400 mt-2">
                      更新于 {new Date(record.updatedAt).toLocaleString('zh-CN')}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
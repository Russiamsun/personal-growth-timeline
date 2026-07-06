import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Edit2, Trash2, Tag } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { PhotoGallery } from '@/components/record/PhotoGallery';
import { MoodIcon } from '@/components/record/MoodIcon';
import { formatDate } from '@/utils/dateUtils';

export default function RecordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, isLoading, loadRecords, getRecordById } = useRecords();

  useEffect(() => {
    if (records.length === 0) {
      loadRecords();
    }
  }, [records.length, loadRecords]);

  const record = id ? getRecordById(id) : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">未找到该记录</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="record-page min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <motion.div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </motion.button>

          {/* 编辑/删除按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/edit/${record.id}`)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>编辑</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>删除</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 主内容区 */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* 标题区域 */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1">
              {record.title}
            </h1>
            {record.mood && (
              <MoodIcon mood={record.mood} size="lg" showLabel />
            )}
          </div>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(record.recordDate)}</span>
            </div>
            {record.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{record.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* 照片画廊 */}
        {record.photos.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📷</span>
              <span>照片 ({record.photos.length})</span>
            </h2>
            <PhotoGallery photos={record.photos} />
          </motion.div>
        )}

        {/* 内容区 */}
        <motion.div
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">内容</h2>
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: record.content }}
          />
        </motion.div>

        {/* 标签 */}
        {record.tags.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <span>标签</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {record.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm hover:shadow-md transition-shadow cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
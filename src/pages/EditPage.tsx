import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { RecordForm } from '@/components/editor/RecordForm';
import { TimeRecord } from '@/types';

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, loadRecords, getRecordById, updateRecord } = useRecords();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const record = id ? getRecordById(id) : undefined;

  // 加载记录
  useEffect(() => {
    if (records.length === 0) {
      loadRecords().then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [records.length, loadRecords]);

  const handleSubmit = async (data: Omit<TimeRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return;

    setIsSubmitting(true);

    try {
      // 更新记录（异步）
      const updatedRecord = await updateRecord(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      if (!updatedRecord) {
        throw new Error('更新失败');
      }

      // 显示成功提示
      await new Promise(resolve => setTimeout(resolve, 500));

      // 跳转到详情页
      navigate(`/record/${updatedRecord.id}`);
    } catch (error: any) {
      console.error('更新失败:', error);
      alert(`更新失败: ${error.message || '请重试'}`);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </motion.div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">未找到该记录</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回首页
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="edit-page min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <motion.div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200"
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
            <span>返回</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">编辑记录</h1>
          <p className="text-gray-600">修改这段时光的记录</p>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <RecordForm
            initialData={record}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">更新成功</h3>
              <p className="text-gray-600">正在跳转到详情页...</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
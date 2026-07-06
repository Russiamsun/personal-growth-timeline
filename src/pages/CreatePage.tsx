import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { RecordForm } from '@/components/editor/RecordForm';
import { TimeRecord } from '@/types';

export default function CreatePage() {
  const navigate = useNavigate();
  const { saveRecord } = useRecords();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<TimeRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);

    try {
      // 保存记录
      const newRecord = saveRecord(data);

      // 显示成功提示
      await new Promise(resolve => setTimeout(resolve, 500));

      // 跳转到详情页
      navigate(`/record/${newRecord.id}`);
    } catch (error) {
      console.error('保存失败:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-page min-h-screen bg-gray-50">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建新记录</h1>
          <p className="text-gray-600">记录这段时光，留下美好的回忆</p>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <RecordForm
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">保存成功</h3>
              <p className="text-gray-600">正在跳转到详情页...</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
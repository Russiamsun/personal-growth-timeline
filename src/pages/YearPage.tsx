import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { RecordCard } from '@/components/timeline/RecordCard';
import { MoodIcons, Mood, ThemeConfig } from '@/types';
import { cn } from '@/lib/utils';

export default function YearPage() {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const { records, isLoading, loadRecords, getRecordsByYear, getYearStats } = useRecords();

  useEffect(() => {
    if (records.length === 0) {
      loadRecords();
    }
  }, [records.length, loadRecords]);

  const yearNumber = parseInt(year || '0', 10);
  const yearRecords = getRecordsByYear(yearNumber);
  const yearStats = getYearStats(yearNumber);

  // 按月份分组记录（由新到旧）
  const recordsByMonth = useMemo(() => {
    const monthMap = new Map<number, typeof yearRecords>();
    yearRecords.forEach(record => {
      const month = new Date(record.recordDate).getMonth() + 1;
      const monthRecords = monthMap.get(month) || [];
      monthRecords.push(record);
      monthMap.set(month, monthRecords);
    });

    // 转换为数组并按月份排序（从新到旧）
    const sortedMonths = Array.from(monthMap.entries()).sort((a, b) => b[0] - a[0]);
    return sortedMonths;
  }, [yearRecords]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-14">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!yearNumber || yearRecords.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-14">
        <p className="text-gray-500 mb-4">未找到 {year} 年的记录</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  const handleRecordClick = (record: { id: string }) => {
    navigate(`/record/${record.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      {/* Hero 区域 */}
      <motion.div
        className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white py-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <motion.button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </motion.button>

          {/* 年份标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2">{yearNumber} 年</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{yearRecords.length} 条记录</span>
                </div>
                {yearStats && (
                  <span>{yearStats.moodDistribution.length} 种心情</span>
                )}
              </div>
            </div>

            <motion.button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              新建记录
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      {yearStats && yearStats.moodDistribution.length > 0 && (
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              😊 心情分布
            </h2>

            <div className="flex flex-wrap gap-4">
              {yearStats.moodDistribution.map(({ mood, count, percentage }) => (
                <motion.div
                  key={mood}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl">{MoodIcons[mood].emoji}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {MoodIcons[mood].label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {count} 次 ({percentage}%)
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 记录列表 - 垂直布局 */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {recordsByMonth.map(([month, monthRecords], monthIndex) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: monthIndex * 0.1, duration: 0.4 }}
            className="mb-10"
          >
            {/* 月份标题 */}
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
                {month}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {month} 月
              </h3>
              <span className="text-gray-500 text-sm">
                {monthRecords.length} 条记录
              </span>
            </div>

            {/* 记录卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monthRecords.map((record, recordIndex) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * recordIndex, duration: 0.3 }}
                >
                  <RecordCard
                    record={record}
                    onClick={handleRecordClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Hash, Calendar, Plus, Tag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useRecords } from '@/hooks/useRecords';
import { RecordCard } from '@/components/timeline/RecordCard';
import { MoodIcon } from '@/components/record/MoodIcon';
import { MoodIcons, Mood, ThemeConfig, Theme } from '@/types';
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

  // 按月份分组记录（由旧到新）
  const recordsByMonth = useMemo(() => {
    const monthMap = new Map<number, typeof yearRecords>();
    yearRecords.forEach(record => {
      const month = new Date(record.recordDate).getMonth() + 1;
      const monthRecords = monthMap.get(month) || [];
      monthRecords.push(record);
      monthMap.set(month, monthRecords);
    });

    // 转换为数组并按月份排序（从旧到新）
    const sortedMonths = Array.from(monthMap.entries()).sort((a, b) => a[0] - b[0]);
    return sortedMonths;
  }, [yearRecords]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!yearNumber || yearRecords.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <p className="text-gray-500 mb-4">未找到 {year} 年的记录</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  const handleRecordClick = (record: typeof yearRecords[0]) => {
    navigate(`/record/${record.id}`);
  };

  // 准备图表数据
  const chartData = yearStats?.moodDistribution.map(({ mood, count, percentage }) => ({
    name: MoodIcons[mood].label,
    value: count,
    percentage,
    color: MoodIcons[mood].color,
    mood,
  })) || [];

  return (
    <div className="year-page min-h-screen bg-gray-50 pt-16">
      {/* 顶部标题区域 */}
      <motion.div
        className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold">{yearNumber}</h1>
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-5 h-5" />
                <span>{yearRecords.length} 条记录</span>
              </div>
            </div>
            <motion.button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              新建记录
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 统计图表区域 */}
      {yearStats && yearStats.moodDistribution.length > 0 && (
        <motion.div
          className="max-w-6xl mx-auto px-4 py-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📊</span>
              <span>心情统计</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 饼图 */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value} 次`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 心情列表 */}
              <div className="space-y-3">
                {yearStats.moodDistribution.map(({ mood, count, percentage }) => (
                  <div
                    key={mood}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MoodIcon mood={mood} size="sm" showLabel />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: MoodIcons[mood].color,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {count} 次 ({percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 高频标签云 */}
      {yearStats && yearStats.topTags.length > 0 && (
        <motion.div
          className="max-w-6xl mx-auto px-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              <span>高频标签</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {yearStats.topTags.map((tag, index) => {
                const sizes = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
                const sizeClass = sizes[Math.min(index, sizes.length - 1)];

                return (
                  <motion.span
                    key={tag}
                    className={cn(
                      'inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50',
                      'text-gray-700 rounded-full hover:shadow-md transition-shadow cursor-pointer',
                      sizeClass
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    #{tag}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* 时间线视图 - 按月份分组 */}
      <motion.div
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">时间线</h2>

        {recordsByMonth.map(([month, monthRecords], monthIndex) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: monthIndex * 0.2, duration: 0.5 }}
            className="mb-12"
          >
            {/* 月份标题 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                {month}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {month}月
              </h3>
              <span className="text-gray-500 text-sm">
                ({monthRecords.length} 条记录)
              </span>
            </div>

            {/* 记录卡片 */}
            <div className="relative">
              {/* 左侧垂直时间线 */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300 transform md:-translate-x-1/2 opacity-40" />

              <div className="space-y-6">
                {monthRecords.map((record, recordIndex) => (
                  <motion.div
                    key={record.id}
                    className={cn(
                      'relative grid grid-cols-1 md:grid-cols-2 gap-8',
                      recordIndex % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    )}
                    initial={{ opacity: 0, x: recordIndex % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * recordIndex, duration: 0.4 }}
                  >
                    {/* 时间线节点 */}
                    <div className="absolute left-0 md:left-1/2 top-8 w-4 h-4 bg-white border-4 border-purple-400 rounded-full transform md:-translate-x-1/2 z-10" />

                    {/* 卡片内容 */}
                    <div className={cn(
                      'md:w-[calc(50%-2rem)]',
                      recordIndex % 2 === 0 ? 'md:ml-auto md:mr-8' : 'md:mr-auto md:ml-8'
                    )}>
                      {/* 主题标签 */}
                      {record.theme && (
                        <motion.div
                          className={cn(
                            'mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                            `bg-gradient-to-r ${ThemeConfig[record.theme].gradient} text-white`
                          )}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * recordIndex + 0.1 }}
                        >
                          <span>{ThemeConfig[record.theme].icon}</span>
                          <span>{ThemeConfig[record.theme].label}</span>
                        </motion.div>
                      )}

                      <RecordCard record={record} onClick={handleRecordClick} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
import { motion } from 'framer-motion';
import { Calendar, Tag, Image, Clock } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { MoodIcons, Mood } from '@/types';
import { generateAvatarPlaceholder } from '@/utils/placeholder';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { records, getThemeStats, getAvailableYears } = useRecords();

  // 计算统计数据
  const totalRecords = records.length;
  const themes = getThemeStats();
  const years = getAvailableYears();
  const totalPhotos = records.reduce((acc, record) => acc + record.photos.length, 0);

  // 计算心情分布
  const moodCounts: Record<Mood, number> = {} as Record<Mood, number>;
  records.forEach(record => {
    if (record.mood) {
      moodCounts[record.mood] = (moodCounts[record.mood] || 0) + 1;
    }
  });

  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // 计算时间跨度
  const latestRecord = records[0];
  const earliestRecord = records[records.length - 1];
  const timeSpan = latestRecord && earliestRecord
    ? `${earliestRecord.recordDate.substring(0, 7)} - ${latestRecord.recordDate.substring(0, 7)}`
    : '';

  return (
    <motion.div
      className="sticky top-20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 个人信息卡片 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* 头像区域 */}
        <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 h-24 relative">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <motion.img
              src={generateAvatarPlaceholder('user', 200)}
              alt="头像"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white"
              whileHover={{ scale: 1.05 }}
            />
          </div>
        </div>

        {/* 个人信息 */}
        <div className="pt-14 pb-6 px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            我的成长时光轴
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            记录人生成长轨迹<br />见证时光流逝
          </p>

          {/* 时间跨度 */}
          {timeSpan && (
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>{timeSpan}</span>
            </div>
          )}
        </div>
      </div>

      {/* 统计数据卡片 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
          📊 数据统计
        </h4>

        <div className="grid grid-cols-2 gap-4">
          {/* 总记录数 */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">总记录</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {totalRecords}
            </div>
          </motion.div>

          {/* 主题数 */}
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600">主题</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {themes.length}
            </div>
          </motion.div>

          {/* 年份数 */}
          <motion.div
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600">年份</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {years.length}
            </div>
          </motion.div>

          {/* 照片总数 */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Image className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-600">照片</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {totalPhotos}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 心情分布卡片 */}
      {topMoods.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            😊 心情分布
          </h4>

          <div className="space-y-3">
            {topMoods.map(([mood, count]) => {
              const moodInfo = MoodIcons[mood as Mood];
              const percentage = Math.round((count / totalRecords) * 100);

              return (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-2xl">{moodInfo.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{moodInfo.label}</span>
                      <span className="text-xs text-gray-500">{count}次</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: moodInfo.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
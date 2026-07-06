import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { ThemeConfig, MoodIcons, TimeRecord } from '@/types';
import { generatePlaceholder } from '@/utils/placeholder';

export default function TimelinePage() {
  const navigate = useNavigate();
  const { records, isLoading, loadRecords } = useRecords();
  const [visibleRecords, setVisibleRecords] = useState<TimeRecord[]>([]);
  const [failedPhotos, setFailedPhotos] = useState<Set<string>>(new Set());

  // 处理图片加载失败
  const handlePhotoError = (photoId: string) => {
    setFailedPhotos(prev => new Set([...prev, photoId]));
  };

  useEffect(() => {
    if (records.length === 0) {
      loadRecords();
    }
  }, [records.length, loadRecords]);

  // 逐个显示记录的动画效果
  useEffect(() => {
    if (records.length > 0) {
      const timer = setInterval(() => {
        setVisibleRecords(prev => {
          if (prev.length < records.length) {
            return [...prev, records[prev.length]];
          }
          clearInterval(timer);
          return prev;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [records]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      formatted: `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`,
    };
  };

  // 按年月分组记录
  const groupedRecords = records.reduce((acc, record) => {
    const { year, month } = formatDate(record.recordDate);
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!acc[key]) {
      acc[key] = {
        year,
        month,
        records: [],
      };
    }

    acc[key].records.push(record);
    return acc;
  }, {} as Record<string, { year: number; month: number; records: TimeRecord[] }>);

  const sortedGroups = Object.values(groupedRecords).sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return dateB.getTime() - dateA.getTime();
  });

  // 计算全局索引映射 - 确保整个时间线上严格左右交替
  const globalIndexMap = new Map<string, number>();
  let globalIndex = 0;
  sortedGroups.forEach(group => {
    group.records.forEach(record => {
      globalIndexMap.set(record.id, globalIndex++);
    });
  });

  // 卡片内容组件
  const RecordCard = ({ record, date, themeConfig, moodConfig }: {
    record: TimeRecord;
    date: { year: number; month: number; day: number; formatted: string };
    themeConfig: any;
    moodConfig: any;
  }) => (
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all cursor-pointer border-l-4"
      style={{ borderLeftColor: themeConfig?.color || '#9CA3AF' }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/record/${record.id}`)}
    >
      {/* 标题 */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
        {record.title}
      </h3>

      {/* 日期和主题 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-gray-500">{date.formatted}</span>
        {themeConfig && (
          <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${themeConfig.color}20`, color: themeConfig.color }}>
            {themeConfig.icon} {themeConfig.label}
          </span>
        )}
        {moodConfig && (
          <span className="text-lg" title={moodConfig.label}>
            {moodConfig.emoji}
          </span>
        )}
      </div>

      {/* 照片缩略图 */}
      {record.photos.length > 0 && (
        <div className="flex gap-2 mb-3">
          {record.photos.slice(0, 3).map((photo, index) => (
            <div
              key={photo.id}
              className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={failedPhotos.has(photo.id) ? generatePlaceholder(photo.id, 200, 200) : photo.url}
                alt={`照片${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handlePhotoError(photo.id)}
              />
            </div>
          ))}
          {record.photos.length > 3 && (
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-sm text-gray-500">+{record.photos.length - 3}</span>
            </div>
          )}
        </div>
      )}

      {/* 标签 */}
      {record.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {record.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {record.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{record.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  // 时间信息组件
  const TimeInfo = ({ date, location }: {
    date: { year: number; month: number; day: number; formatted: string };
    location?: string;
  }) => (
    <div className="text-gray-600">
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-lg font-medium">{date.day}日</span>
      </div>
      {location && (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-14">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-14">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">还没有任何记录</p>
        <button
          onClick={() => navigate('/create')}
          className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          创建第一条记录
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">成长时光轴</h1>
          <p className="text-gray-600">记录每一个精彩瞬间</p>
        </motion.div>

        {/* 时间轴主体 */}
        <div className="relative">
          {/* 中央时间线 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400 rounded-full"></div>

          {sortedGroups.map((group, groupIndex) => (
            <div key={`${group.year}-${group.month}`} className="relative mb-16">
              {/* 年月节点 */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: groupIndex * 0.1, duration: 0.3 }}
              >
                <div className="relative z-10 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg">
                  <span className="text-xl font-bold">{group.year}年</span>
                  <span className="text-lg ml-2">{group.month}月</span>
                </div>
              </motion.div>

              {/* 该月份的记录 - 左右交叉排布 */}
              {group.records.map((record) => {
                const date = formatDate(record.recordDate);
                const themeConfig = record.theme ? ThemeConfig[record.theme] : null;
                const moodConfig = record.mood ? MoodIcons[record.mood] : null;
                const isVisible = visibleRecords.includes(record);
                
                // 使用全局索引判断左右，确保整个时间线严格交替
                const globalIdx = globalIndexMap.get(record.id) || 0;
                const isLeft = globalIdx % 2 === 0; // 奇数全局索引在左侧，偶数全局索引在右侧

                return (
                  <motion.div
                    key={record.id}
                    className="relative flex items-center justify-between mb-12"
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {/* 左侧内容 */}
                    <div className="w-5/12">
                      {isLeft ? (
                        <RecordCard
                          record={record}
                          date={date}
                          themeConfig={themeConfig}
                          moodConfig={moodConfig}
                        />
                      ) : (
                        <div className="flex justify-end">
                          <TimeInfo date={date} location={record.location} />
                        </div>
                      )}
                    </div>

                    {/* 中间：圆形节点 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div
                        className="w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-lg cursor-pointer bg-white"
                        style={{
                          borderColor: themeConfig?.color || '#9CA3AF',
                        }}
                        whileHover={{ scale: 1.3, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/record/${record.id}`)}
                      >
                        <span className="text-2xl">{themeConfig?.icon || '📝'}</span>
                      </motion.div>
                      {/* 下方心情图标 */}
                      {moodConfig && (
                        <div className="mt-1 text-sm">
                          {moodConfig.emoji}
                        </div>
                      )}
                    </div>

                    {/* 右侧内容 */}
                    <div className="w-5/12">
                      {!isLeft ? (
                        <RecordCard
                          record={record}
                          date={date}
                          themeConfig={themeConfig}
                          moodConfig={moodConfig}
                        />
                      ) : (
                        <TimeInfo date={date} location={record.location} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
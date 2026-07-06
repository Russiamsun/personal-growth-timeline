import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Camera, ArrowRight } from 'lucide-react';
import { TimeRecord, ThemeConfig } from '@/types';
import { MoodIcon } from '@/components/record/MoodIcon';
import { cn } from '@/lib/utils';
import { generatePlaceholder } from '@/utils/placeholder';

interface RecordCardProps {
  record: TimeRecord;
  onClick?: (record: TimeRecord) => void;
  className?: string;
}

export function RecordCard({ record, onClick, className }: RecordCardProps) {
  const [thumbnailError, setThumbnailError] = useState(false);

  // 格式化日期为中文格式
  const formatDateChinese = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
  };

  // 计算字数和阅读时间
  const contentText = record.content.replace(/<[^>]*>/g, '');
  const wordCount = contentText.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 400));

  // 提取摘要（前100字）
  const summary = contentText.substring(0, 100) + (wordCount > 100 ? '...' : '');

  // 主题配置
  const themeConfig = record.theme ? ThemeConfig[record.theme] : null;

  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
        'hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer',
        className
      )}
      onClick={() => onClick?.(record)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 照片缩略图 */}
      {record.photos.length > 0 && (
        <div className="relative h-48 overflow-hidden bg-gray-50">
          <img
            src={thumbnailError ? generatePlaceholder(record.id, 800, 600) : record.photos[0].url}
            alt={record.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setThumbnailError(true)}
          />
          {/* 照片数量指示 */}
          {record.photos.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{record.photos.length}</span>
            </div>
          )}
        </div>
      )}

      {/* 卡片内容 */}
      <div className="p-5">
        {/* 标题行 */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 pr-4">
            {record.title}
          </h3>
          <div className="text-sm text-gray-500 flex-shrink-0">
            {formatDateChinese(record.recordDate)}
          </div>
        </div>

        {/* 主题标签 + 心情图标 */}
        <div className="flex items-center gap-2 mb-3">
          {themeConfig && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${themeConfig.color}15`,
                color: themeConfig.color,
              }}
            >
              <span>{themeConfig.icon}</span>
              <span>{themeConfig.label}</span>
            </span>
          )}
          {record.mood && (
            <MoodIcon mood={record.mood} size="sm" />
          )}
        </div>

        {/* 地点 */}
        {record.location && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{record.location}</span>
          </div>
        )}

        {/* 内容摘要 */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {summary}
        </p>

        {/* 标签列表 */}
        {record.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {record.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md hover:bg-gray-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {record.tags.length > 4 && (
              <span className="inline-block px-2 py-1 text-gray-400 text-xs">
                +{record.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 底部信息栏 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-600">{wordCount}</span> 字
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readTime} 分钟</span>
            </span>
          </div>

          <motion.button
            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
            whileHover={{ x: 4 }}
          >
            阅读更多
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// 紧凑版记录卡片（用于侧边栏或列表）
export function RecordCardCompact({ record, onClick }: RecordCardProps) {
  const themeConfig = record.theme ? ThemeConfig[record.theme] : null;

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onClick?.(record)}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-start gap-3">
        {/* 左侧心情图标 */}
        {record.mood && (
          <MoodIcon mood={record.mood} size="sm" />
        )}

        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
            {record.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{record.recordDate}</span>
            {themeConfig && (
              <>
                <span>·</span>
                <span>{themeConfig.icon} {themeConfig.label}</span>
              </>
            )}
          </div>
        </div>

        {/* 照片数量 */}
        {record.photos.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Camera className="w-3 h-3" />
            <span>{record.photos.length}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
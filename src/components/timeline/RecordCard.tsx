import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { TimeRecord } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { MoodIcon } from '@/components/record/MoodIcon';
import { cn } from '@/lib/utils';
import { generatePlaceholder } from '@/utils/placeholder';

interface RecordCardProps {
  record: TimeRecord;
  onClick?: (record: TimeRecord) => void;
  className?: string;
}

export function RecordCard({ record, onClick, className }: RecordCardProps) {
  const thumbnail = record.photos.length > 0 ? record.photos[0] : null;
  const [thumbnailError, setThumbnailError] = useState(false);

  return (
    <motion.div
      className={cn(
        'record-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer',
        'hover:shadow-md transition-shadow duration-300',
        className
      )}
      onClick={() => onClick?.(record)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 照片缩略图 */}
      {thumbnail && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={thumbnailError ? generatePlaceholder(thumbnail.id, 400, 300) : thumbnail.url}
            alt={record.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setThumbnailError(true)}
          />
          {/* 日期标签 */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
            {formatDate(record.recordDate)}
          </div>
        </div>
      )}

      {/* 卡片内容 */}
      <div className="p-4">
        {/* 标题和心情 */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
            {record.title}
          </h3>
          {record.mood && (
            <MoodIcon mood={record.mood} size="sm" />
          )}
        </div>

        {/* 内容摘要 */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {record.content.replace(/<[^>]*>/g, '').substring(0, 100)}
        </p>

        {/* 地点 */}
        {record.location && (
          <div className="flex items-center text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">{record.location}</span>
          </div>
        )}

        {/* 标签 */}
        {record.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {record.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {record.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-gray-400 text-xs">
                +{record.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 照片数量指示 */}
        {record.photos.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-gray-400 text-xs">
            <span>共 {record.photos.length} 张照片</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// 紧凑版记录卡片
interface RecordCardCompactProps {
  record: TimeRecord;
  onClick?: (record: TimeRecord) => void;
  className?: string;
}

export function RecordCardCompact({ record, onClick, className }: RecordCardCompactProps) {
  return (
    <motion.div
      className={cn(
        'record-card-compact flex items-center gap-3 p-3 bg-white rounded-lg',
        'hover:bg-gray-50 cursor-pointer transition-colors',
        className
      )}
      onClick={() => onClick?.(record)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* 心情图标 */}
      {record.mood && (
        <MoodIcon mood={record.mood} size="sm" />
      )}

      {/* 标题和日期 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
          {record.title}
        </h4>
        <p className="text-xs text-gray-500">
          {formatDate(record.recordDate)}
        </p>
      </div>

      {/* 照片数量 */}
      {record.photos.length > 0 && (
        <span className="text-xs text-gray-400">
          📷 {record.photos.length}
        </span>
      )}
    </motion.div>
  );
}
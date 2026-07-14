import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Image, TrendingUp } from 'lucide-react';
import { YearStats } from '@/types';
import { MoodBar } from '@/components/record/MoodIcon';
import { cn } from '@/lib/utils';
import { generatePlaceholder } from '@/utils/placeholder';

interface YearCardProps {
  yearStats: YearStats;
  onClick?: (year: number) => void;
  className?: string;
}

export function YearCard({ yearStats, onClick, className }: YearCardProps) {
  const { year, recordCount, moodDistribution, topTags, featuredPhotos } = yearStats;
  const [failedPhotos, setFailedPhotos] = useState<Set<string>>(new Set());

  const handlePhotoError = (photoId: string) => {
    setFailedPhotos(prev => new Set([...prev, photoId]));
  };

  return (
    <motion.div
      className={cn(
        'year-card bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer',
        'hover:shadow-xl transition-all duration-300',
        className
      )}
      onClick={() => onClick?.(year)}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 年份标题区 */}
      <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <h2 className="text-5xl font-bold text-white mb-2">{year}</h2>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{recordCount} 条记录</span>
            </div>
            <div className="flex items-center gap-1">
              <Image className="w-4 h-4" />
              <span>{featuredPhotos.length} 张照片</span>
            </div>
          </div>
        </div>
      </div>

      {/* 心情分布 */}
      {moodDistribution.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">心情概览</span>
          </div>
          <MoodBar moodDistribution={moodDistribution} />
          <div className="flex flex-wrap gap-2 mt-2">
            {moodDistribution.slice(0, 3).map(({ mood, percentage }) => (
              <span
                key={mood}
                className="text-xs text-gray-500"
              >
                {mood} {percentage}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 精选照片 */}
      {featuredPhotos.length > 0 && (
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {featuredPhotos.slice(0, 4).map((photo, index) => (
              <motion.div
                key={photo.id}
                className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={failedPhotos.has(photo.id) ? generatePlaceholder(photo.id, 200, 200) : photo.url}
                  alt={`精选照片 ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => handlePhotoError(photo.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 高频标签 */}
      {topTags.length > 0 && (
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-400 mb-2">高频标签</p>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// 简洁版年份卡片
interface YearCardSimpleProps {
  year: number;
  recordCount: number;
  photoCount: number;
  onClick?: (year: number) => void;
  className?: string;
}

export function YearCardSimple({ 
  year, 
  recordCount, 
  photoCount, 
  onClick,
  className 
}: YearCardSimpleProps) {
  return (
    <motion.div
      className={cn(
        'year-card-simple flex items-center justify-between p-4 bg-white rounded-lg',
        'hover:bg-gray-50 cursor-pointer transition-colors',
        className
      )}
      onClick={() => onClick?.(year)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-gray-900">{year}</span>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{recordCount} 条记录</span>
          <span>·</span>
          <span>{photoCount} 张照片</span>
        </div>
      </div>
      <div className="text-gray-400">
        →
      </div>
    </motion.div>
  );
}
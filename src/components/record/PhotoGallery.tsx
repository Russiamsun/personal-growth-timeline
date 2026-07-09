import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';
import { generatePlaceholder } from '@/utils/placeholder';
import { sanitizeImageUrl } from '@/utils/sanitize';

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
}

export function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<Set<string>>(new Set());

  const handlePhotoError = (photoId: string) => {
    setFailedPhotos(prev => new Set([...prev, photoId]));
  };

  const openPreview = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePreview = () => {
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape') {
      closePreview();
    }
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  // 判断是否为HEIC格式
  const isHeic = (url: string) => {
    return url.toLowerCase().endsWith('.heic') || url.toLowerCase().endsWith('.heif');
  };

  return (
    <>
      {/* 照片网格 */}
      <div className={cn(
        'photo-gallery grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
        className
      )}>
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            onClick={() => openPreview(index)}
          >
            <img
              src={failedPhotos.has(photo.id) ? generatePlaceholder(photo.id, 400, 400) : sanitizeImageUrl(photo.url)}
              alt={`照片 ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => handlePhotoError(photo.id)}
            />
            {/* HEIC格式提示 */}
            {isHeic(photo.url) && !failedPhotos.has(photo.id) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 text-center">
                HEIC格式
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 大图预览 Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* 关闭按钮 */}
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={closePreview}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* 上一张按钮 */}
            <button
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* 下一张按钮 */}
            <button
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* 图片 */}
            <motion.div
              key={selectedPhotoIndex}
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={failedPhotos.has(photos[selectedPhotoIndex].id) ? generatePlaceholder(photos[selectedPhotoIndex].id, 1200, 900) : photos[selectedPhotoIndex].url}
                alt={`照片 ${selectedPhotoIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </motion.div>

            {/* 图片计数 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
              {selectedPhotoIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
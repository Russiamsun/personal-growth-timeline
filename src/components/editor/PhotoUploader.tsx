import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, GripVertical } from 'lucide-react';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';

interface PhotoUploaderProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  maxPhotos?: number;
  className?: string;
}

export function PhotoUploader({
  photos,
  onChange,
  maxPhotos = 9,
  className,
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 支持的文件类型
  const acceptTypes = '.heic,.heif,.jpg,.jpeg,.png,.webp';
  const validTypes = ['image/heic', 'image/heif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // 生成唯一ID
  const generateId = () => `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 处理文件上传
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (photos.length >= maxPhotos) break;
      if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(heic|heif|jpg|jpeg|png|webp)$/)) {
        continue;
      }

      const photoId = generateId();

      // 模拟上传进度
      setUploadProgress(prev => ({ ...prev, [photoId]: 0 }));

      // 读取文件为DataURL（实际项目中应该上传到服务器）
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newPhoto: Photo = {
          id: photoId,
          url,
          order: photos.length,
          uploadedAt: new Date().toISOString(),
        };

        onChange([...photos, newPhoto]);

        // 模拟上传完成
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[photoId];
            return newProgress;
          });
        }, 500);
      };

      // 模拟进度更新
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(prev => {
          if (progress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [photoId]: progress };
        });
      }, 100);

      reader.readAsDataURL(file);
    }
  }, [photos, maxPhotos, onChange]);

  // 拖拽处理
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  // 删除照片
  const handleDelete = (photoId: string) => {
    const newPhotos = photos.filter(p => p.id !== photoId);
    // 重新排序
    const reorderedPhotos = newPhotos.map((p, index) => ({ ...p, order: index }));
    onChange(reorderedPhotos);
  };

  // 拖拽排序
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOverPhoto = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(targetIndex, 0, draggedPhoto);

    // 更新顺序
    const reorderedPhotos = newPhotos.map((p, index) => ({ ...p, order: index }));
    onChange(reorderedPhotos);
    setDraggedIndex(targetIndex);
  };

  return (
    <div className={cn('photo-uploader', className)}>
      {/* 上传区域 */}
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 transition-all duration-300',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center text-gray-500">
          <ImagePlus className="w-12 h-12 mb-3 text-gray-400" />
          <p className="text-sm font-medium mb-1">拖拽照片到这里上传</p>
          <p className="text-xs text-gray-400 mb-3">或点击选择文件</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            选择照片
          </button>
          <p className="text-xs text-gray-400 mt-2">
            支持 HEIC, JPG, PNG, WEBP 格式，最多 {maxPhotos} 张
          </p>
        </div>
      </motion.div>

      {/* 照片预览网格 */}
      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <AnimatePresence>
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden bg-gray-100 group',
                  draggedIndex === index && 'opacity-50'
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOverPhoto(e, index)}
              >
                {uploadProgress[photo.id] !== undefined ? (
                  // 上传进度
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin mb-2 mx-auto" />
                      <p className="text-xs text-gray-600">{uploadProgress[photo.id]}%</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 照片 */}
                    <img
                      src={photo.url}
                      alt={`照片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* 拖拽手柄 */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-1 bg-black/50 rounded cursor-move">
                        <GripVertical className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <motion.button
                      type="button"
                      onClick={() => handleDelete(photo.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3 h-3" />
                    </motion.button>

                    {/* 序号 */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                      {index + 1}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
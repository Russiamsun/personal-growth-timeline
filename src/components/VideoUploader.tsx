import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Video, Play, Trash2 } from 'lucide-react';
import { Video as VideoType } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { uploadVideoToStorage, deleteVideoFromStorage, extractVideoPathFromUrl } from '@/services/storage';

interface VideoUploaderProps {
  videos: VideoType[];
  onChange: (videos: VideoType[]) => void;
}

export default function VideoUploader({ videos, onChange }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // 生成唯一ID
  const generateId = () => {
    return `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const validFiles: File[] = [];

    // 验证文件类型
    for (const file of files) {
      const isValidType = file.type === 'video/mp4' || 
                          file.type === 'video/quicktime' ||
                          file.name.match(/\.(mp4|mov)$/i);
      
      if (!isValidType) {
        toast.warning(`文件 "${file.name}" 格式不支持，仅支持 MP4/MOV 格式`);
        continue;
      }

      // 检查文件大小（500MB限制）
      if (file.size > 500 * 1024 * 1024) {
        toast.warning(`文件 "${file.name}" 超过500MB限制`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    const newVideos: VideoType[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        setUploadProgress(Math.round((i / validFiles.length) * 80));
        const result = await uploadVideoToStorage(file);

        // 获取视频时长
        const duration = await getVideoDuration(file);

        newVideos.push({
          id: generateId(),
          url: result.url,
          order: videos.length + newVideos.length + 1,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          uploadedAt: new Date().toISOString(),
          storagePath: result.path,
          duration,
        });
      } catch (error: any) {
        console.error('视频上传失败:', error);
        toast.error(`视频 "${file.name}" 上传失败: ${error.message}`);
      }
    }

    if (newVideos.length > 0) {
      onChange([...videos, ...newVideos]);
      toast.success(`成功上传 ${newVideos.length} 个视频`);
    }

    setIsUploading(false);
    setUploadProgress(0);
    
    // 清空input，允许重复上传相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 获取视频时长
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration));
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => {
        resolve(0);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  // 删除视频
  const handleDelete = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    try {
      // 如果是Storage视频，尝试从Storage删除
      const storagePath = extractVideoPathFromUrl(video.url);
      if (storagePath) {
        await deleteVideoFromStorage(storagePath);
      }

      // 从列表中移除
      const updatedVideos = videos
        .filter(v => v.id !== videoId)
        .map((v, index) => ({ ...v, order: index + 1 }));
      onChange(updatedVideos);
      toast.success('视频已删除');
    } catch (error) {
      console.error('[VideoUploader] 删除视频失败:', error);
      toast.error('删除视频失败，请重试');
    }
  };

  // 格式化时长显示
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* 上传按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl p-8 transition-all bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={isUploading ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Video className="w-12 h-12 text-purple-500" />
            </motion.div>
            <span className="text-lg font-medium text-purple-700">
              {isUploading ? `上传中 ${uploadProgress}%` : '点击上传视频'}
            </span>
            <span className="text-sm text-gray-500">
              支持 MP4/MOV 格式，单个文件不超过500MB
            </span>
          </div>
        </motion.button>

        {/* 上传进度条 */}
        {isUploading && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </motion.div>

      {/* 视频列表 */}
      {videos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-500" />
            已添加视频 ({videos.length}个)
          </h3>

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all bg-white"
                >
                  {/* 视频预览 */}
                  <div className="relative aspect-video bg-gray-100">
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    
                    {/* 播放按钮覆盖层 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                        <Play className="w-8 h-8 text-purple-600 ml-1" />
                      </div>
                    </div>

                    {/* 时长标签 */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    )}

                    {/* 序号标识 */}
                    <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>

                    {/* 删除按钮 */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(video.id)}
                      className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* 视频信息 */}
                  {video.caption && (
                    <div className="p-3 bg-gray-50">
                      <p className="text-sm text-gray-700 truncate">
                        {video.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
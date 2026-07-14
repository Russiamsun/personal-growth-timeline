import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Plus, Link, ArrowUp, ArrowDown, Crop } from 'lucide-react';
import { Photo } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { sanitizeImageUrl } from '@/utils/sanitize';
import { uploadMultipleImages, deleteImageFromStorage, extractPathFromUrl } from '@/services/storage';
import { ImageCropper } from './ImageCropper';

interface PhotoUploaderProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
}

export default function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');

  // 裁剪功能相关状态
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState<File | string | null>(null);
  const [cropPhotoId, setCropPhotoId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // 生成唯一ID
  const generateId = () => {
    return `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 处理文件上传（快速上传到Supabase Storage）
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const validFiles: File[] = [];

    // 验证文件类型
    for (const file of files) {
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        toast.warning(`文件 "${file.name}" 格式不支持，仅支持 JPG/PNG/WEBP 格式`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      // 快速批量上传图片（自动压缩）
      const uploadResults = await uploadMultipleImages(validFiles);

      // 添加到photos数组
      const newPhotos: Photo[] = uploadResults.map((result, index) => ({
        id: generateId(),
        url: result.url,
        order: photos.length + index + 1,
        caption: result.fileName.replace(/\.[^/.]+$/, ''),
        uploadedAt: new Date().toISOString(),
        storagePath: result.path,
      }));

      onChange([...photos, ...newPhotos]);
      toast.success(`成功上传 ${newPhotos.length} 张照片`);
    } catch (error) {
      console.error('图片上传失败:', error);
      toast.error('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
      // 清空input，允许重复上传相同文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 处理URL添加
  const handleUrlAdd = () => {
    if (!urlInput.trim()) {
      toast.warning('请输入图片URL');
      return;
    }

    const newPhoto: Photo = {
      id: generateId(),
      url: urlInput.trim(),
      order: photos.length + 1,
      caption: captionInput.trim() || '网络图片',
      uploadedAt: new Date().toISOString(),
    };

    onChange([...photos, newPhoto]);
    setUrlInput('');
    setCaptionInput('');
  };

  // 删除照片
  const handleDelete = async (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    try {
      // 如果是Storage图片，尝试从Storage删除
      const storagePath = extractPathFromUrl(photo.url);
      if (storagePath) {
        await deleteImageFromStorage(storagePath);
      }

      // 从列表中移除
      const updatedPhotos = photos
        .filter(p => p.id !== photoId)
        .map((p, index) => ({ ...p, order: index + 1 }));
      onChange(updatedPhotos);
    } catch (error) {
      console.error('[PhotoUploader] 删除照片失败:', error);
      toast.error('删除照片失败，请重试');
    }
  };

  // 上移照片
  const handleMoveUp = (photoId: string) => {
    const index = photos.findIndex(p => p.id === photoId);
    if (index <= 0) return;

    const newPhotos = [...photos];
    [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
    newPhotos.forEach((p, i) => { p.order = i + 1; });
    onChange(newPhotos);
  };

  // 下移照片
  const handleMoveDown = (photoId: string) => {
    const index = photos.findIndex(p => p.id === photoId);
    if (index >= photos.length - 1) return;

    const newPhotos = [...photos];
    [newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
    newPhotos.forEach((p, i) => { p.order = i + 1; });
    onChange(newPhotos);
  };

  // 打开裁剪对话框
  const handleCropStart = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    setCropImage(photo.url);
    setCropPhotoId(photoId);
    setShowCropper(true);
  };

  // 确认裁剪
  const handleCropConfirm = async (croppedBlob: Blob) => {
    if (!cropPhotoId) return;

    try {
      const croppedUrl = URL.createObjectURL(croppedBlob);
      const updatedPhotos = photos.map(p =>
        p.id === cropPhotoId ? { ...p, url: croppedUrl } : p
      );
      onChange(updatedPhotos);
      toast.success('裁剪成功');

      setShowCropper(false);
      setCropImage(null);
      setCropPhotoId(null);
    } catch (error) {
      console.error('裁剪失败:', error);
      toast.error('裁剪失败，请重试');
    }
  };

  // 取消裁剪
  const handleCropCancel = () => {
    setShowCropper(false);
    setCropImage(null);
    setCropPhotoId(null);
  };

  return (
    <div className="space-y-6">
      {/* 上传模式切换 */}
      <div className="flex gap-4 mb-6">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUploadMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
            uploadMode === 'file'
              ? 'border-orange-500 bg-orange-50 text-orange-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>上传本地文件</span>
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUploadMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
            uploadMode === 'url'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
          }`}
        >
          <Link className="w-4 h-4" />
          <span>添加网络图片URL</span>
        </motion.button>
      </div>

      {/* 文件上传模式 */}
      {uploadMode === 'file' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
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
            className="w-full border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-xl p-8 transition-all bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={isUploading ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Upload className="w-12 h-12 text-orange-500" />
              </motion.div>
              <span className="text-lg font-medium text-orange-700">
                {isUploading ? '正在上传...' : '点击上传照片'}
              </span>
              <span className="text-sm text-gray-500">
                支持 JPG/PNG/WEBP 格式，可一次上传多张照片
              </span>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* URL添加模式 */}
      {uploadMode === 'url' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 rounded-xl p-6 border-2 border-purple-100"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                图片URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                图片说明（可选）
              </label>
              <input
                type="text"
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                placeholder="例如：活动现场"
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUrlAdd}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                <span>添加网络图片</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 照片列表 */}
      {photos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-orange-500" />
            已添加照片 ({photos.length}张)
          </h3>
          
          <AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all bg-white"
                >
                  {/* 照片预览 */}
                  <img
                    src={sanitizeImageUrl(photo.url)}
                    alt={photo.caption || '照片'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                          <rect width="200" height="200" fill="#f3f4f6"/>
                          <text x="100" y="100" text-anchor="middle" fill="#9ca3af" font-size="14">图片加载失败</text>
                        </svg>
                      `);
                    }}
                  />

                  {/* 序号标识 */}
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>

                  {/* 操作按钮 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
                  >
                    {/* 裁剪 */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCropStart(photo.id)}
                      className="bg-blue-500/90 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-blue-600 transition-colors"
                      title="裁剪图片"
                    >
                      <Crop className="w-4 h-4" />
                    </motion.button>

                    {/* 上移 */}
                    {index > 0 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleMoveUp(photo.id)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg text-gray-700 hover:bg-white transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </motion.button>
                    )}

                    {/* 下移 */}
                    {index < photos.length - 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleMoveDown(photo.id)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg text-gray-700 hover:bg-white transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </motion.button>
                    )}

                    {/* 删除 */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(photo.id)}
                      className="bg-red-500/90 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>

                  {/* Caption信息 */}
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-xs truncate">
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}

      {/* 图片裁剪对话框 */}
      <AnimatePresence>
        {showCropper && cropImage && (
          <ImageCropper
            image={cropImage}
            onCrop={handleCropConfirm}
            onCancel={handleCropCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
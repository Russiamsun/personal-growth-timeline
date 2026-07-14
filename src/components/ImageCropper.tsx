import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Check,
  Crop,
  Square,
  RectangleHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 裁剪区域接口
interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 图片变换接口
interface ImageTransform {
  rotate: number; // 旋转角度 (0, 90, 180, 270)
  flipH: boolean; // 水平翻转
  flipV: boolean; // 垂直翻转
}

// 预设比例选项
const ASPECT_RATIOS = [
  { label: '自由', value: null, icon: Crop },
  { label: '1:1', value: 1, icon: Square },
  { label: '4:3', value: 4 / 3, icon: RectangleHorizontal },
  { label: '16:9', value: 16 / 9, icon: RectangleHorizontal },
];

interface ImageCropperProps {
  image: File | string;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({
  image,
  onCrop,
  onCancel,
  aspectRatio,
}: ImageCropperProps) {
  // 状态
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [transform, setTransform] = useState<ImageTransform>({ rotate: 0, flipH: false, flipV: false });
  const [selectedRatio, setSelectedRatio] = useState<number | null>(aspectRatio ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'move' | 'resize' | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // 加载图片
  useEffect(() => {
    const loadImage = async () => {
      let url: string;
      if (typeof image === 'string') {
        url = image;
      } else {
        url = URL.createObjectURL(image);
      }
      setImageUrl(url);

      const img = new window.Image();
      img.onload = () => {
        imageRef.current = img;
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = url;
    };

    loadImage();

    return () => {
      if (typeof image !== 'string' && imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image]);

  // 计算Canvas尺寸和初始裁剪区域
  useEffect(() => {
    if (!containerRef.current || imageSize.width === 0) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 48;
    const containerHeight = container.clientHeight - 48;

    // 计算缩放后的尺寸
    const scale = Math.min(
      containerWidth / imageSize.width,
      containerHeight / imageSize.height,
      1
    );

    const newCanvasSize = {
      width: imageSize.width * scale,
      height: imageSize.height * scale,
    };

    setCanvasSize(newCanvasSize);

    // 初始化裁剪区域（默认为80%的图片区域）
    const initialCropWidth = newCanvasSize.width * 0.8;
    const initialCropHeight = selectedRatio
      ? initialCropWidth / selectedRatio
      : newCanvasSize.height * 0.8;

    setCropArea({
      x: (newCanvasSize.width - initialCropWidth) / 2,
      y: (newCanvasSize.height - Math.min(initialCropHeight, newCanvasSize.height * 0.8)) / 2,
      width: initialCropWidth,
      height: Math.min(initialCropHeight, newCanvasSize.height * 0.8),
    });
  }, [imageSize, selectedRatio]);

  // 绘制Canvas
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 保存状态
    ctx.save();

    // 应用变换
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotate * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // 绘制图片
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    ctx.restore();

    // 绘制遮罩层
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 清除裁剪区域的遮罩
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // 重绘裁剪区域的图片
    ctx.save();
    ctx.beginPath();
    ctx.rect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.clip();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotate * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    ctx.restore();

    // 绘制裁剪框边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // 绘制网格线（三分法）
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;

    // 垂直线
    for (let i = 1; i < 3; i++) {
      const x = cropArea.x + (cropArea.width * i) / 3;
      ctx.beginPath();
      ctx.moveTo(x, cropArea.y);
      ctx.lineTo(x, cropArea.y + cropArea.height);
      ctx.stroke();
    }

    // 水平线
    for (let i = 1; i < 3; i++) {
      const y = cropArea.y + (cropArea.height * i) / 3;
      ctx.beginPath();
      ctx.moveTo(cropArea.x, y);
      ctx.lineTo(cropArea.x + cropArea.width, y);
      ctx.stroke();
    }
  }, [canvasSize, cropArea, transform]);

  // 鼠标按下
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 检查是否点击在裁剪区域内
    const isInCropArea =
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height;

    // 检查是否点击调整手柄
    const handleSize = 10;
    const handles = {
      'nw': { x: cropArea.x - handleSize / 2, y: cropArea.y - handleSize / 2 },
      'n': { x: cropArea.x + cropArea.width / 2 - handleSize / 2, y: cropArea.y - handleSize / 2 },
      'ne': { x: cropArea.x + cropArea.width - handleSize / 2, y: cropArea.y - handleSize / 2 },
      'w': { x: cropArea.x - handleSize / 2, y: cropArea.y + cropArea.height / 2 - handleSize / 2 },
      'e': { x: cropArea.x + cropArea.width - handleSize / 2, y: cropArea.y + cropArea.height / 2 - handleSize / 2 },
      'sw': { x: cropArea.x - handleSize / 2, y: cropArea.y + cropArea.height - handleSize / 2 },
      's': { x: cropArea.x + cropArea.width / 2 - handleSize / 2, y: cropArea.y + cropArea.height - handleSize / 2 },
      'se': { x: cropArea.x + cropArea.width - handleSize / 2, y: cropArea.y + cropArea.height - handleSize / 2 },
    };

    for (const [handle, pos] of Object.entries(handles)) {
      if (
        x >= pos.x &&
        x <= pos.x + handleSize &&
        y >= pos.y &&
        y <= pos.y + handleSize
      ) {
        setIsDragging(true);
        setDragStart({ x, y });
        setDragType('resize');
        setResizeHandle(handle);
        return;
      }
    }

    if (isInCropArea) {
      setIsDragging(true);
      setDragStart({ x, y });
      setDragType('move');
    }
  }, [cropArea]);

  // 鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    if (dragType === 'move') {
      // 移动裁剪区域
      let newX = cropArea.x + dx;
      let newY = cropArea.y + dy;

      // 边界检查
      newX = Math.max(0, Math.min(newX, canvasSize.width - cropArea.width));
      newY = Math.max(0, Math.min(newY, canvasSize.height - cropArea.height));

      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (dragType === 'resize') {
      // 调整裁剪区域大小
      let newArea = { ...cropArea };

      const minSize = 50;

      switch (resizeHandle) {
        case 'nw':
          newArea.x = Math.max(0, cropArea.x + dx);
          newArea.y = Math.max(0, cropArea.y + dy);
          newArea.width = Math.max(minSize, cropArea.width - dx);
          newArea.height = Math.max(minSize, cropArea.height - dy);
          break;
        case 'n':
          newArea.y = Math.max(0, cropArea.y + dy);
          newArea.height = Math.max(minSize, cropArea.height - dy);
          break;
        case 'ne':
          newArea.y = Math.max(0, cropArea.y + dy);
          newArea.width = Math.max(minSize, cropArea.width + dx);
          newArea.height = Math.max(minSize, cropArea.height - dy);
          break;
        case 'w':
          newArea.x = Math.max(0, cropArea.x + dx);
          newArea.width = Math.max(minSize, cropArea.width - dx);
          break;
        case 'e':
          newArea.width = Math.min(canvasSize.width - cropArea.x, Math.max(minSize, cropArea.width + dx));
          break;
        case 'sw':
          newArea.x = Math.max(0, cropArea.x + dx);
          newArea.width = Math.max(minSize, cropArea.width - dx);
          newArea.height = Math.min(canvasSize.height - cropArea.y, Math.max(minSize, cropArea.height + dy));
          break;
        case 's':
          newArea.height = Math.min(canvasSize.height - cropArea.y, Math.max(minSize, cropArea.height + dy));
          break;
        case 'se':
          newArea.width = Math.min(canvasSize.width - cropArea.x, Math.max(minSize, cropArea.width + dx));
          newArea.height = Math.min(canvasSize.height - cropArea.y, Math.max(minSize, cropArea.height + dy));
          break;
      }

      // 保持比例
      if (selectedRatio) {
        if (['n', 's', 'nw', 'sw'].includes(resizeHandle)) {
          newArea.width = newArea.height * selectedRatio;
        } else {
          newArea.height = newArea.width / selectedRatio;
        }
      }

      // 边界检查
      newArea.x = Math.max(0, newArea.x);
      newArea.y = Math.max(0, newArea.y);
      newArea.width = Math.min(newArea.width, canvasSize.width - newArea.x);
      newArea.height = Math.min(newArea.height, canvasSize.height - newArea.y);

      setCropArea(newArea);
    }

    setDragStart({ x, y });
  }, [isDragging, dragStart, dragType, resizeHandle, cropArea, canvasSize, selectedRatio]);

  // 鼠标释放
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
    setResizeHandle('');
  }, []);

  // 选择比例
  const handleSelectRatio = useCallback((ratio: number | null) => {
    setSelectedRatio(ratio);

    if (ratio && canvasSize.width > 0) {
      // 根据比例调整裁剪区域
      const newWidth = Math.min(cropArea.width, canvasSize.width * 0.8);
      const newHeight = newWidth / ratio;

      setCropArea(prev => ({
        ...prev,
        x: (canvasSize.width - newWidth) / 2,
        y: (canvasSize.height - newHeight) / 2,
        width: newWidth,
        height: Math.min(newHeight, canvasSize.height * 0.8),
      }));
    }
  }, [canvasSize, cropArea.width]);

  // 旋转
  const handleRotate = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      rotate: (prev.rotate + 90) % 360,
    }));
  }, []);

  // 水平翻转
  const handleFlipH = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      flipH: !prev.flipH,
    }));
  }, []);

  // 垂直翻转
  const handleFlipV = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      flipV: !prev.flipV,
    }));
  }, []);

  // 预览裁剪结果
  const handlePreview = useCallback(() => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 计算实际裁剪尺寸
    const scaleX = imageSize.width / canvasSize.width;
    const scaleY = imageSize.height / canvasSize.height;

    const actualWidth = cropArea.width * scaleX;
    const actualHeight = cropArea.height * scaleY;

    canvas.width = actualWidth;
    canvas.height = actualHeight;

    // 应用变换
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotate * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // 绘制裁剪区域
    const sx = cropArea.x * scaleX;
    const sy = cropArea.y * scaleY;

    ctx.drawImage(
      imageRef.current,
      sx,
      sy,
      actualWidth,
      actualHeight,
      0,
      0,
      actualWidth,
      actualHeight
    );

    ctx.restore();

    const url = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewUrl(url);
    setShowPreview(true);
  }, [cropArea, canvasSize, imageSize, transform]);

  // 确认裁剪
  const handleConfirm = useCallback(() => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 计算实际裁剪尺寸
    const scaleX = imageSize.width / canvasSize.width;
    const scaleY = imageSize.height / canvasSize.height;

    const actualWidth = cropArea.width * scaleX;
    const actualHeight = cropArea.height * scaleY;

    canvas.width = actualWidth;
    canvas.height = actualHeight;

    // 应用变换
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotate * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // 绘制裁剪区域
    const sx = cropArea.x * scaleX;
    const sy = cropArea.y * scaleY;

    ctx.drawImage(
      imageRef.current,
      sx,
      sy,
      actualWidth,
      actualHeight,
      0,
      0,
      actualWidth,
      actualHeight
    );

    ctx.restore();

    // 转换为Blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCrop(blob);
        }
      },
      'image/jpeg',
      0.9
    );
  }, [cropArea, canvasSize, imageSize, transform, onCrop]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-700">
        <h3 className="text-white font-medium">图片裁剪</h3>
        <div className="flex items-center gap-2">
          {/* 比例选择 */}
          <div className="flex items-center gap-1 mr-4">
            {ASPECT_RATIOS.map((ratio) => {
              const Icon = ratio.icon;
              return (
                <motion.button
                  key={ratio.label}
                  onClick={() => handleSelectRatio(ratio.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    selectedRatio === ratio.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4 mr-1 inline" />
                  {ratio.label}
                </motion.button>
              );
            })}
          </div>

          {/* 旋转和翻转 */}
          <motion.button
            onClick={handleRotate}
            className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="旋转90°"
          >
            <RotateCw className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={handleFlipH}
            className={cn(
              'p-2 rounded-lg transition-colors',
              transform.flipH
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="水平翻转"
          >
            <FlipHorizontal className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={handleFlipV}
            className={cn(
              'p-2 rounded-lg transition-colors',
              transform.flipV
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="垂直翻转"
          >
            <FlipVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* 裁剪区域 */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-6 overflow-hidden"
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* 调整手柄 - 相对于canvas定位 */}
          {cropArea.width > 0 && cropArea.height > 0 && (
            <>
              {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map((handle) => {
                const positions: Record<string, { x: number; y: number; cursor: string }> = {
                  nw: { x: cropArea.x, y: cropArea.y, cursor: 'nwse-resize' },
                  n: { x: cropArea.x + cropArea.width / 2, y: cropArea.y, cursor: 'ns-resize' },
                  ne: { x: cropArea.x + cropArea.width, y: cropArea.y, cursor: 'nesw-resize' },
                  w: { x: cropArea.x, y: cropArea.y + cropArea.height / 2, cursor: 'ew-resize' },
                  e: { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height / 2, cursor: 'ew-resize' },
                  sw: { x: cropArea.x, y: cropArea.y + cropArea.height, cursor: 'nesw-resize' },
                  s: { x: cropArea.x + cropArea.width / 2, y: cropArea.y + cropArea.height, cursor: 'ns-resize' },
                  se: { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height, cursor: 'nwse-resize' },
                };

                const pos = positions[handle];

                return (
                  <div
                    key={handle}
                    className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-lg"
                    style={{
                      left: pos.x - 6,
                      top: pos.y - 6,
                      cursor: pos.cursor,
                    }}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-t border-gray-700">
        <div className="text-gray-400 text-sm">
          裁剪尺寸: {Math.round(cropArea.width)} x {Math.round(cropArea.height)}
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handlePreview}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            预览
          </motion.button>
          <motion.button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
            取消
          </motion.button>
          <motion.button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check className="w-4 h-4" />
            确认裁剪
          </motion.button>
        </div>
      </div>

      {/* 预览模态框 */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewUrl}
                alt="裁剪预览"
                className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-4 -right-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-sm">
                点击图片外关闭预览
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
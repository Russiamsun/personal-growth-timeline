/**
 * 图片压缩工具
 * 用于在上传图片前进行压缩，减少localStorage占用
 */

export interface CompressionOptions {
  maxWidth?: number;      // 最大宽度，默认800px
  quality?: number;       // 压缩质量，默认0.8 (80%)
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';  // 输出格式
}

/**
 * 压缩图片
 * @param file - 要压缩的图片文件
 * @param options - 压缩选项
 * @returns Promise<string> - 压缩后的DataURL
 */
export async function compressImage(
  file: File,
  options?: CompressionOptions
): Promise<string> {
  const {
    maxWidth = 800,
    quality = 0.8,
    mimeType = 'image/jpeg'
  } = options || {};

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // 计算压缩后的尺寸，保持宽高比
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          // 创建canvas进行压缩
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建canvas上下文'));
            return;
          }

          // 绘制压缩后的图片
          ctx.drawImage(img, 0, 0, width, height);

          // 转换为DataURL
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);

          // 记录压缩效果
          const originalSize = Math.round(file.size / 1024);
          const compressedSize = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
          const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

          console.log(
            `[图片压缩] ${file.name}\n` +
            `原始大小: ${originalSize}KB\n` +
            `压缩后大小: ${compressedSize}KB\n` +
            `压缩率: ${compressionRatio}%\n` +
            `尺寸: ${img.width}x${img.height} → ${width}x${height}`
          );

          resolve(compressedDataUrl);
        } catch (error) {
          console.error('图片压缩失败:', error);
          // 压缩失败时，回退到原图
          fallbackToOriginal(file, resolve, reject);
        }
      };

      img.onerror = () => {
        console.error('图片加载失败');
        // 加载失败时，回退到原图
        fallbackToOriginal(file, resolve, reject);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      console.error('文件读取失败');
      reject(new Error('文件读取失败'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 回退到原图（不压缩）
 */
function fallbackToOriginal(
  file: File,
  resolve: (value: string) => void,
  reject: (reason: any) => void
): void {
  console.warn(`[图片压缩] 压缩失败，使用原图: ${file.name}`);
  const reader = new FileReader();
  reader.onload = (e) => resolve(e.target?.result as string);
  reader.onerror = () => reject(new Error('文件读取失败'));
  reader.readAsDataURL(file);
}

/**
 * 批量压缩图片
 * @param files - 文件数组
 * @param options - 压缩选项
 * @returns Promise<Array<{ file: File; compressedDataUrl: string; originalSize: number; compressedSize: number }>>
 */
export async function compressImages(
  files: File[],
  options?: CompressionOptions
): Promise<Array<{
  file: File;
  compressedDataUrl: string;
  originalSize: number;
  compressedSize: number;
}>> {
  const results = [];

  for (const file of files) {
    try {
      const compressedDataUrl = await compressImage(file, options);
      const originalSize = file.size;
      const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);

      results.push({
        file,
        compressedDataUrl,
        originalSize,
        compressedSize
      });
    } catch (error) {
      console.error(`压缩图片 ${file.name} 失败:`, error);
      // 失败时跳过该图片
    }
  }

  return results;
}

/**
 * 检查文件是否为图片
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  return validTypes.includes(file.type) || /\.(heic|heif|jpg|jpeg|png|webp)$/i.test(file.name);
}
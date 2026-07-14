/**
 * 图片水印工具
 * 用于给图片添加文字水印
 */

/**
 * 水印配置选项
 */
export interface WatermarkOptions {
  text: string;           // 水印文字
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'tile';
  opacity: number;        // 0-1
  fontSize: number;       // 像素
  color: string;          // 十六进制颜色
  fontFamily: string;     // 字体
  offsetX: number;        // X偏移
  offsetY: number;        // Y偏移
}

/**
 * 默认水印配置
 */
const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  text: '',
  position: 'bottom-right',
  opacity: 0.5,
  fontSize: 24,
  color: '#ffffff',
  fontFamily: 'Arial',
  offsetX: 20,
  offsetY: 20
};

/**
 * 给图片添加水印
 * @param image - HTMLImageElement 图片元素
 * @param options - 水印配置选项
 * @returns Promise<Blob> - 添加水印后的图片 Blob
 */
export async function addWatermark(
  image: HTMLImageElement,
  options: Partial<WatermarkOptions> = {}
): Promise<Blob> {
  const config = { ...DEFAULT_WATERMARK_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    try {
      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 canvas 上下文'));
        return;
      }

      // 绘制原图
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // 设置水印样式
      ctx.font = `${config.fontSize}px ${config.fontFamily}`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // 解析颜色并设置透明度
      const colorWithOpacity = hexToRgba(config.color, config.opacity);
      ctx.fillStyle = colorWithOpacity;

      if (config.position === 'tile') {
        // 平铺模式
        drawTileWatermark(ctx, config, canvas.width, canvas.height);
      } else {
        // 单点定位模式
        const position = calculateWatermarkPosition(
          ctx,
          config.text,
          config.position,
          canvas.width,
          canvas.height,
          config.offsetX,
          config.offsetY
        );
        ctx.fillText(config.text, position.x, position.y);
      }

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('图片转换失败'));
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error('添加水印失败:', error);
      reject(error);
    }
  });
}

/**
 * 计算水印位置
 */
function calculateWatermarkPosition(
  ctx: CanvasRenderingContext2D,
  text: string,
  position: WatermarkOptions['position'],
  canvasWidth: number,
  canvasHeight: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number } {
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent || 30;

  let x = 0;
  let y = 0;

  switch (position) {
    case 'top-left':
      x = offsetX;
      y = offsetY;
      break;
    case 'top-right':
      x = canvasWidth - textWidth - offsetX;
      y = offsetY;
      break;
    case 'bottom-left':
      x = offsetX;
      y = canvasHeight - textHeight - offsetY;
      break;
    case 'bottom-right':
      x = canvasWidth - textWidth - offsetX;
      y = canvasHeight - textHeight - offsetY;
      break;
    case 'center':
      x = (canvasWidth - textWidth) / 2;
      y = (canvasHeight - textHeight) / 2;
      break;
    default:
      x = offsetX;
      y = offsetY;
  }

  return { x, y };
}

/**
 * 绘制平铺水印
 */
function drawTileWatermark(
  ctx: CanvasRenderingContext2D,
  config: WatermarkOptions,
  canvasWidth: number,
  canvasHeight: number
): void {
  const textMetrics = ctx.measureText(config.text);
  const textWidth = textMetrics.width;
  const textHeight = config.fontSize;

  // 计算间距（水印之间的距离）
  const gapX = textWidth + 80;
  const gapY = textHeight + 60;

  // 旋转角度（-25度，模仿专业水印效果）
  const angle = -25 * (Math.PI / 180);

  // 遍历绘制平铺水印
  for (let y = -canvasHeight; y < canvasHeight * 2; y += gapY) {
    for (let x = -canvasWidth; x < canvasWidth * 2; x += gapX) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(config.text, 0, 0);
      ctx.restore();
    }
  }
}

/**
 * 十六进制颜色转 RGBA
 */
function hexToRgba(hex: string, opacity: number): string {
  // 移除 # 前缀
  hex = hex.replace('#', '');

  // 处理简写格式（如 #fff）
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * 从 File 创建 HTMLImageElement
 * @param file - 图片文件
 * @returns Promise<HTMLImageElement>
 */
async function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 批量添加水印
 * @param files - 图片文件数组
 * @param options - 水印配置选项
 * @returns Promise<Blob[]> - 添加水印后的图片 Blob 数组
 */
export async function addWatermarkToFiles(
  files: File[],
  options: Partial<WatermarkOptions> = {}
): Promise<Blob[]> {
  const results: Blob[] = [];

  for (const file of files) {
    try {
      const image = await createImageFromFile(file);
      const blob = await addWatermark(image, options);
      results.push(blob);
    } catch (error) {
      console.error(`为文件 ${file.name} 添加水印失败:`, error);
      // 失败时，将原文件转为 Blob 添加到结果中
      results.push(file);
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

/**
 * 从 URL 加载图片并添加水印
 * @param url - 图片 URL
 * @param options - 水印配置选项
 * @returns Promise<Blob>
 */
export async function addWatermarkFromUrl(
  url: string,
  options: Partial<WatermarkOptions> = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 处理跨域图片

    img.onload = async () => {
      try {
        const blob = await addWatermark(img, options);
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = url;
  });
}
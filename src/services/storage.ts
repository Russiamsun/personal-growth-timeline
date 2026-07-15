import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Supabase Storage 图片上传服务
 * 优化版：快速压缩 + 智能重试 + 详细错误提示
 */

const BUCKET_NAME = 'activity-photos';

// 重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

/**
 * 压缩图片（快速版）
 */
async function compressImage(file: File): Promise<File> {
  // 小于100KB不压缩
  if (file.size < 100 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      try {
        // 快速压缩：最大800px，质量0.6
        const maxDim = 800;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size * 0.9) {
              const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              console.log(`[压缩] ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB`);
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.6
        );
      } catch (e) {
        console.warn('[压缩失败]', e);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * 延迟函数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 检查Storage bucket是否存在
 */
async function checkBucket(): Promise<{ exists: boolean; error?: string }> {
  try {
    // 尝试列出bucket中的文件（测试权限）
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit: 1 });

    if (error) {
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        return { exists: false, error: `Storage bucket "${BUCKET_NAME}" 不存在，请在Supabase控制台创建` };
      }
      if (error.message.includes('permission') || error.message.includes('policy')) {
        return { exists: false, error: `Storage bucket权限不足，请检查RLS策略` };
      }
      return { exists: false, error: error.message };
    }

    return { exists: true };
  } catch (e: any) {
    return { exists: false, error: e.message };
  }
}

/**
 * 上传单张图片（带重试）
 */
async function uploadWithRetry(
  file: File,
  retryCount: number = 0
): Promise<{ url: string; path: string }> {
  try {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${random}.${ext}`;

    console.log(`[上传] 第${retryCount + 1}次尝试: ${fileName}`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    console.log(`[上传成功] ${urlData.publicUrl}`);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    console.warn(`[上传失败] 第${retryCount + 1}次:`, error.message);

    // 网络错误或临时错误，重试
    if (retryCount < MAX_RETRIES - 1) {
      const isNetworkError = error.message.includes('fetch') ||
                             error.message.includes('network') ||
                             error.message.includes('timeout');

      if (isNetworkError) {
        console.log(`[重试] 等待${RETRY_DELAY}ms后重试...`);
        await delay(RETRY_DELAY);
        return uploadWithRetry(file, retryCount + 1);
      }
    }

    throw error;
  }
}

/**
 * 上传图片到Supabase Storage
 */
export async function uploadImageToStorage(
  file: File,
  folderPath?: string
): Promise<{ url: string; path: string }> {
  // 检查配置
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase未配置，请检查环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  }

  // 检查bucket
  const bucketCheck = await checkBucket();
  if (!bucketCheck.exists) {
    throw new Error(`Storage检查失败: ${bucketCheck.error}`);
  }

  // 压缩图片
  const compressedFile = await compressImage(file);

  // 上传（带重试）
  return uploadWithRetry(compressedFile);
}

/**
 * 批量上传图片
 */
export async function uploadMultipleImages(
  files: File[],
  folderPath?: string
): Promise<{ url: string; path: string; fileName: string }[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase未配置');
  }

  // 检查bucket
  const bucketCheck = await checkBucket();
  if (!bucketCheck.exists) {
    throw new Error(`Storage检查失败: ${bucketCheck.error}`);
  }

  // 并行上传所有图片
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const result = await uploadImageToStorage(file, folderPath);
        return {
          ...result,
          fileName: file.name,
        };
      } catch (error: any) {
        console.error(`[批量上传失败] ${file.name}:`, error.message);
        throw error;
      }
    })
  );

  console.log(`[批量上传完成] 成功 ${results.length} 张`);
  return results;
}

/**
 * 删除图片
 */
export async function deleteImageFromStorage(path: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.warn('[删除失败]', error.message);
    }
  } catch (e) {
    console.warn('[删除异常]', e);
  }
}

/**
 * 检查是否为Storage URL
 */
export function isStorageUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/v1/object/public/');
}

/**
 * 从URL提取路径
 */
export function extractPathFromUrl(url: string): string | null {
  if (!isStorageUrl(url)) return null;

  const match = url.match(/\/activity-photos\/(.+)/);
  return match ? match[1] : null;
}

// ========== 视频上传相关 ==========

const VIDEO_BUCKET_NAME = 'activity-videos';

/**
 * 检查视频Bucket是否存在
 */
async function checkVideoBucket(): Promise<{ exists: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(VIDEO_BUCKET_NAME)
      .list('', { limit: 1 });

    if (error) {
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        return { exists: false, error: `Storage bucket "${VIDEO_BUCKET_NAME}" 不存在，请在Supabase控制台创建` };
      }
      if (error.message.includes('permission') || error.message.includes('policy')) {
        return { exists: false, error: `Storage bucket权限不足，请检查RLS策略` };
      }
      return { exists: false, error: error.message };
    }

    return { exists: true };
  } catch (e: any) {
    return { exists: false, error: e.message };
  }
}

/**
 * 上传单个视频（带重试）
 */
async function uploadVideoWithRetry(
  file: File,
  retryCount: number = 0
): Promise<{ url: string; path: string }> {
  try {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    const ext = file.name.split('.').pop() || 'mp4';
    const fileName = `${timestamp}-${random}.${ext}`;

    console.log(`[视频上传] 第${retryCount + 1}次尝试: ${fileName}`);

    const { data, error } = await supabase.storage
      .from(VIDEO_BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(VIDEO_BUCKET_NAME)
      .getPublicUrl(data.path);

    console.log(`[视频上传成功] ${urlData.publicUrl}`);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    console.warn(`[视频上传失败] 第${retryCount + 1}次:`, error.message);

    // 网络错误或临时错误，重试
    if (retryCount < MAX_RETRIES - 1) {
      const isNetworkError = error.message.includes('fetch') ||
                             error.message.includes('network') ||
                             error.message.includes('timeout');

      if (isNetworkError) {
        console.log(`[重试] 等待${RETRY_DELAY}ms后重试...`);
        await delay(RETRY_DELAY);
        return uploadVideoWithRetry(file, retryCount + 1);
      }
    }

    throw error;
  }
}

/**
 * 上传视频到Supabase Storage
 */
export async function uploadVideoToStorage(
  file: File
): Promise<{ url: string; path: string }> {
  // 检查配置
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase未配置，请检查环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  }

  // 检查文件类型
  const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov)$/i)) {
    throw new Error('仅支持 MP4 和 MOV 格式的视频文件');
  }

  // 检查文件大小（限制为500MB）
  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('视频文件大小不能超过500MB');
  }

  // 检查bucket
  const bucketCheck = await checkVideoBucket();
  if (!bucketCheck.exists) {
    throw new Error(`Storage检查失败: ${bucketCheck.error}`);
  }

  // 上传（带重试）
  return uploadVideoWithRetry(file);
}

/**
 * 批量上传视频
 */
export async function uploadMultipleVideos(
  files: File[]
): Promise<{ url: string; path: string; fileName: string }[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase未配置');
  }

  // 检查bucket
  const bucketCheck = await checkVideoBucket();
  if (!bucketCheck.exists) {
    throw new Error(`Storage检查失败: ${bucketCheck.error}`);
  }

  // 并行上传所有视频
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const result = await uploadVideoToStorage(file);
        return {
          ...result,
          fileName: file.name,
        };
      } catch (error: any) {
        console.error(`[批量视频上传失败] ${file.name}:`, error.message);
        throw error;
      }
    })
  );

  console.log(`[批量视频上传完成] 成功 ${results.length} 个`);
  return results;
}

/**
 * 删除视频
 */
export async function deleteVideoFromStorage(path: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    const { error } = await supabase.storage
      .from(VIDEO_BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.warn('[删除视频失败]', error.message);
    }
  } catch (e) {
    console.warn('[删除视频异常]', e);
  }
}

/**
 * 检查是否为视频Storage URL
 */
export function isVideoStorageUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/v1/object/public/') && url.includes('activity-videos');
}

/**
 * 从视频URL提取路径
 */
export function extractVideoPathFromUrl(url: string): string | null {
  if (!isVideoStorageUrl(url)) return null;

  const match = url.match(/\/activity-videos\/(.+)/);
  return match ? match[1] : null;
}
import { supabase } from '@/lib/supabase';

/**
 * Supabase Storage 图片上传服务
 * 用于上传活动照片到云端Storage，替代Base64存储方案
 */

// Storage bucket名称
const BUCKET_NAME = 'activity-photos';

/**
 * 快速压缩图片为Blob
 * @param file 图片文件
 * @param maxSizeKB 最大大小KB（默认500KB）
 * @returns 压缩后的Blob
 */
async function fastCompressImage(file: File, maxSizeKB: number = 500): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      try {
        let quality = 0.8;
        let width = img.width;
        let height = img.height;

        // 限制最大尺寸为1200px
        const maxDimension = 1200;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
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

        // 尝试压缩到目标大小
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const sizeKB = blob.size / 1024;
              console.log(`[快速压缩] ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${sizeKB.toFixed(0)}KB`);
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      } catch (error) {
        console.warn('[快速压缩] 压缩失败，使用原图');
        resolve(file);
      }
    };

    img.onerror = () => {
      resolve(file);
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 快速上传图片到Supabase Storage（带压缩）
 * @param file 图片文件
 * @param folderPath 文件夹路径（可选）
 * @returns 上传成功后的图片公开URL
 */
export async function uploadImageToStorage(
  file: File,
  folderPath?: string
): Promise<{ url: string; path: string }> {
  try {
    // 快速压缩图片（大于100KB才压缩）
    let uploadFile: File | Blob = file;
    if (file.size > 100 * 1024) {
      uploadFile = await fastCompressImage(file, 500);
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

    // 上传文件到Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, uploadFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('[Storage] 上传失败:', error);
      throw new Error(`图片上传失败: ${error.message}`);
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('[Storage] 上传异常:', error);
    throw error;
  }
}

/**
 * 批量上传图片
 * @param files 图片文件数组
 * @param folderPath 文件夹路径
 * @returns 上传成功后的URL数组
 */
export async function uploadMultipleImages(
  files: File[],
  folderPath?: string
): Promise<{ url: string; path: string; fileName: string }[]> {
  const uploadResults = await Promise.all(
    files.map(async (file) => {
      try {
        const result = await uploadImageToStorage(file, folderPath);
        return {
          ...result,
          fileName: file.name,
        };
      } catch (error) {
        console.error(`[Storage] 上传 ${file.name} 失败:`, error);
        throw error;
      }
    })
  );

  console.log(`[Storage] 批量上传成功: ${uploadResults.length}张图片`);
  return uploadResults;
}

/**
 * 删除Storage中的图片
 * @param path 图片路径
 */
export async function deleteImageFromStorage(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('[Storage] 删除失败:', error);
      throw new Error(`图片删除失败: ${error.message}`);
    }

    console.log('[Storage] 删除成功:', path);
  } catch (error) {
    console.error('[Storage] 删除异常:', error);
    throw error;
  }
}

/**
 * 批量删除图片
 * @param paths 图片路径数组
 */
export async function deleteMultipleImages(paths: string[]): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (error) {
      console.error('[Storage] 批量删除失败:', error);
      throw new Error(`批量删除失败: ${error.message}`);
    }

    console.log(`[Storage] 批量删除成功: ${paths.length}张图片`);
  } catch (error) {
    console.error('[Storage] 批量删除异常:', error);
    throw error;
  }
}

/**
 * 检查图片是否为Supabase Storage URL
 * @param url 图片URL
 * @returns 是否为Storage URL
 */
export function isStorageUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/v1/object/public/');
}

/**
 * 从Storage URL提取路径
 * @param url Storage公开URL
 * @returns 图片路径
 */
export function extractPathFromUrl(url: string): string | null {
  if (!isStorageUrl(url)) return null;

  try {
    // URL格式: https://xxx.supabase.co/storage/v1/object/public/activity-photos/path/file.jpg
    const match = url.match(/\/storage\/v1\/object\/public\/activity-photos\/(.+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('[Storage] URL解析失败:', error);
    return null;
  }
}
import { supabase } from '@/lib/supabase';

/**
 * Supabase Storage 图片上传服务
 * 用于上传活动照片到云端Storage，替代Base64存储方案
 */

// Storage bucket名称
const BUCKET_NAME = 'activity-photos';

/**
 * 上传图片到Supabase Storage
 * @param file 图片文件
 * @param folderPath 文件夹路径（可选，用于分类存储）
 * @returns 上传成功后的图片公开URL
 */
export async function uploadImageToStorage(
  file: File,
  folderPath?: string
): Promise<{ url: string; path: string }> {
  try {
    // 生成唯一文件名（避免重名冲突）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // 构建完整路径
    const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

    // 上传文件到Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: '3600', // 缓存1小时
        upsert: false, // 不覆盖已存在的文件
      });

    if (error) {
      console.error('[Storage] 上传失败:', error);
      throw new Error(`图片上传失败: ${error.message}`);
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    console.log('[Storage] 上传成功:', {
      path: data.path,
      url: urlData.publicUrl,
    });

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
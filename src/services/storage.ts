import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Supabase Storage 图片上传服务 - 优化版
 * 快速压缩 + 高效上传
 */

const BUCKET_NAME = 'activity-photos';

/**
 * 极速压缩图片（优化版）
 * 使用更小的尺寸和更高的压缩率
 */
async function fastCompress(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      try {
        // 限制最大尺寸800px，更快上传
        const maxDim = 800;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else {
            width = (width * maxDim) / height;
            height = maxDim;
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

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为Blob（质量0.7，更小文件）
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              // 返回压缩后的文件
              const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              console.log(`[压缩] ${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB`);
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.7
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
 * 快速上传单张图片
 */
export async function uploadImageToStorage(
  file: File,
  folderPath?: string
): Promise<{ url: string; path: string }> {
  // 检查Supabase配置
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase未配置，请检查环境变量');
  }

  try {
    // 快速压缩（大于50KB才压缩）
    let uploadFile = file;
    if (file.size > 50 * 1024) {
      uploadFile = await fastCompress(file);
    }

    // 生成文件名
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    const ext = uploadFile.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${random}.${ext}`;
    const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

    // 上传
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, uploadFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('[上传失败]', error);
      throw new Error(`上传失败: ${error.message}`);
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    console.error('[上传异常]', error);
    throw error;
  }
}

/**
 * 批量上传（并行上传，更快）
 */
export async function uploadMultipleImages(
  files: File[],
  folderPath?: string
): Promise<{ url: string; path: string; fileName: string }[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase未配置');
  }

  // 并行上传所有图片
  const results = await Promise.all(
    files.map(async (file) => {
      const result = await uploadImageToStorage(file, folderPath);
      return {
        ...result,
        fileName: file.name,
      };
    })
  );

  console.log(`[批量上传] 成功 ${results.length} 张`);
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
      console.error('[删除失败]', error);
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
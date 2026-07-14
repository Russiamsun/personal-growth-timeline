import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Supabase Storage 图片上传服务 - 增强版
 * 支持云端上传 + 本地存储fallback
 */

const BUCKET_NAME = 'activity-photos';

// 检测是否为在线环境
const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * 压缩图片
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      try {
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

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.7
        );
      } catch (e) {
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
 * 转换为Base64（本地存储用）
 */
async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 上传图片（云端优先，本地fallback）
 */
export async function uploadImageToStorage(
  file: File,
  folderPath?: string
): Promise<{ url: string; path: string }> {
  // 1. 压缩图片
  const compressedFile = file.size > 50 * 1024 ? await compressImage(file) : file;

  // 2. 尝试云端上传
  if (isSupabaseConfigured() && isOnline()) {
    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 6);
      const ext = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `${timestamp}-${random}.${ext}`;
      const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

      console.log('[上传] 尝试云端上传...');

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fullPath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('[云端上传失败]', error.message);
        // 继续使用本地存储
      } else {
        // 成功
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(data.path);

        console.log('[上传成功] 云端URL');
        return {
          url: urlData.publicUrl,
          path: data.path,
        };
      }
    } catch (e) {
      console.warn('[云端上传异常]', e);
      // 继续使用本地存储
    }
  }

  // 3. Fallback: 本地Base64存储
  console.log('[上传] 使用本地存储');
  const base64 = await toBase64(compressedFile);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);

  return {
    url: base64,
    path: `local-${timestamp}-${random}`,
  };
}

/**
 * 批量上传
 */
export async function uploadMultipleImages(
  files: File[],
  folderPath?: string
): Promise<{ url: string; path: string; fileName: string }[]> {
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
  // 本地存储不需要删除，直接返回
  if (path.startsWith('local-')) {
    return;
  }

  if (!isSupabaseConfigured() || !isOnline()) {
    return;
  }

  try {
    await supabase.storage.from(BUCKET_NAME).remove([path]);
  } catch (e) {
    console.warn('[删除失败]', e);
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
  if (url.startsWith('data:')) {
    // Base64本地存储
    return `local-${Date.now()}`;
  }

  if (!isStorageUrl(url)) return null;

  const match = url.match(/\/activity-photos\/(.+)/);
  return match ? match[1] : null;
}
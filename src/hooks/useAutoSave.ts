import { useEffect, useRef, useCallback } from 'react';

const DRAFT_PREFIX = 'draft-';

interface UseAutoSaveOptions<T> {
  /** 数据对象 */
  data: T;
  /** 草稿唯一标识 */
  key: string;
  /** 自动保存间隔（毫秒），默认30000ms */
  interval?: number;
  /** 保存回调 */
  onSave?: (data: T) => void;
  /** 是否启用自动保存，默认true */
  enabled?: boolean;
}

interface UseAutoSaveReturn<T> {
  /** 手动保存 */
  save: () => void;
  /** 清除草稿 */
  clear: () => void;
  /** 是否有未保存的草稿 */
  hasDraft: boolean;
  /** 加载草稿 */
  loadDraft: () => T | null;
  /** 上次保存时间 */
  lastSavedAt: Date | null;
}

/**
 * 自动保存草稿Hook
 * 用于表单数据的自动保存，防止意外丢失
 */
export function useAutoSave<T extends object>({
  data,
  key,
  interval = 30000,
  onSave,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn<T> {
  const lastSavedAtRef = useRef<Date | null>(null);
  const dataRef = useRef(data);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 更新数据引用
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // 保存函数
  const save = useCallback(() => {
    if (!enabled) return;

    try {
      const storageKey = `${DRAFT_PREFIX}${key}`;
      const draftData = {
        data: dataRef.current,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(draftData));
      lastSavedAtRef.current = new Date();
      onSave?.(dataRef.current);
    } catch (error) {
      console.error('Auto save failed:', error);
    }
  }, [key, enabled, onSave]);

  // 清除草稿
  const clear = useCallback(() => {
    try {
      const storageKey = `${DRAFT_PREFIX}${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Clear draft failed:', error);
    }
  }, [key]);

  // 加载草稿
  const loadDraft = useCallback((): T | null => {
    try {
      const storageKey = `${DRAFT_PREFIX}${key}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const draftData = JSON.parse(stored);
        return draftData.data as T;
      }
    } catch (error) {
      console.error('Load draft failed:', error);
    }
    return null;
  }, [key]);

  // 检查是否有草稿
  const hasDraft = useCallback((): boolean => {
    try {
      const storageKey = `${DRAFT_PREFIX}${key}`;
      return localStorage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  }, [key]);

  // 设置定时自动保存
  useEffect(() => {
    if (!enabled) return;

    timerRef.current = setInterval(() => {
      save();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interval, enabled, save]);

  // 页面关闭前自动保存
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      save();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, save]);

  return {
    save,
    clear,
    hasDraft: hasDraft(),
    loadDraft,
    lastSavedAt: lastSavedAtRef.current,
  };
}

/**
 * 获取所有草稿列表
 */
export function getAllDrafts(): Array<{ key: string; savedAt: string }> {
  const drafts: Array<{ key: string; savedAt: string }> = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(DRAFT_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const draftData = JSON.parse(stored);
          drafts.push({
            key: key.replace(DRAFT_PREFIX, ''),
            savedAt: draftData.savedAt,
          });
        }
      }
    }
  } catch (error) {
    console.error('Get all drafts failed:', error);
  }

  return drafts.sort((a, b) => 
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

/**
 * 清除所有草稿
 */
export function clearAllDrafts(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(DRAFT_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Clear all drafts failed:', error);
  }
}

export default useAutoSave;
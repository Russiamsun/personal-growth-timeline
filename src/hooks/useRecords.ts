import { create } from 'zustand';
import { TimeRecord, YearStats, Mood, Photo, Theme, ThemeStats } from '@/types';
import { sortByDate } from '@/utils/dateUtils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import recordsData from '@/data/records.json';

const STORAGE_KEY = 'time-records';
const USE_SUPABASE_KEY = 'use-supabase';
const DATA_VERSION_KEY = 'data-version';
const DATA_VERSION = '2025.07.07'; // 数据版本号，更新此值会重新初始化数据

interface RecordsState {
  records: TimeRecord[];
  isLoading: boolean;
  error: string | null;
  useSupabase: boolean;

  // Actions
  loadRecords: () => Promise<void>;
  getRecordsByYear: (year: number) => TimeRecord[];
  getRecordsByTheme: (theme: Theme) => TimeRecord[];
  getRecordById: (id: string) => TimeRecord | undefined;
  getYearStats: (year: number) => YearStats | null;
  getThemeStats: () => ThemeStats[];
  getAllThemes: () => Theme[];
  getAvailableYears: () => number[];
  searchRecords: (query: string) => TimeRecord[];
  saveRecord: (record: Omit<TimeRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TimeRecord>;
  updateRecord: (id: string, updates: Partial<TimeRecord>) => Promise<TimeRecord | null>;
  deleteRecord: (id: string) => Promise<boolean>;
  switchDataSource: (useSupabase: boolean) => void;
}

// 辅助函数：生成唯一ID
const generateId = () => `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 辅助函数：将TimeRecord转换为Supabase格式
const toSupabaseFormat = (record: TimeRecord) => ({
  id: record.id,
  title: record.title,
  content: record.content,
  recordDate: record.recordDate,
  mood: record.mood,
  theme: record.theme,
  location: record.location,
  tags: record.tags,
  photos: JSON.stringify(record.photos),
  year: record.year,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

// 辅助函数：从Supabase格式转换为TimeRecord
const fromSupabaseFormat = (data: any): TimeRecord => ({
  id: data.id,
  title: data.title,
  content: data.content,
  recordDate: data.recordDate,
  mood: data.mood,
  theme: data.theme,
  location: data.location,
  tags: data.tags || [],
  photos: typeof data.photos === 'string' ? JSON.parse(data.photos) : data.photos || [],
  year: data.year,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const useRecords = create<RecordsState>((set, get) => ({
  records: [],
  isLoading: false,
  error: null,
  useSupabase: isSupabaseConfigured(),

  loadRecords: async () => {
    set({ isLoading: true, error: null });
    
    // 检查Supabase配置是否有效，如果无效则强制使用localStorage
    if (!isSupabaseConfigured()) {
      set({ useSupabase: false });
    }
    
    try {
      const { useSupabase } = get();

      if (useSupabase && isSupabaseConfigured()) {
        // 从Supabase加载
        const { data, error } = await supabase
          .from('records')
          .select('*')
          .order('recordDate', { ascending: false });

        if (error) {
          // 仅在开发模式下输出警告
          if (import.meta.env.DEV) {
            console.warn('Supabase加载失败，将使用localStorage:', error.message);
          }
          // 不要抛出错误，fallback到localStorage
          const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
          const storedRecords = localStorage.getItem(STORAGE_KEY);

          // 检查数据版本，如果不匹配则重新初始化
          if (storedVersion !== DATA_VERSION || !storedRecords) {
            const records = sortByDate(recordsData.records as TimeRecord[]);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
            set({ records, isLoading: false, useSupabase: false });
          } else {
            const records = sortByDate(JSON.parse(storedRecords) as TimeRecord[]);
            set({ records, isLoading: false, useSupabase: false });
          }
          return;
        }

        const records = (data || []).map(fromSupabaseFormat);
        set({ records: sortByDate(records), isLoading: false });
      } else {
        // 从localStorage加载
        await new Promise(resolve => setTimeout(resolve, 100));
        const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
        const storedRecords = localStorage.getItem(STORAGE_KEY);

        // 检查数据版本，如果不匹配则重新初始化
        if (storedVersion !== DATA_VERSION || !storedRecords) {
          const records = sortByDate(recordsData.records as TimeRecord[]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
          localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
          set({ records, isLoading: false });
          return;
        }

        const records = sortByDate(JSON.parse(storedRecords) as TimeRecord[]);
        set({ records, isLoading: false });
      }
    } catch (error: any) {
      // 仅在开发模式下输出警告
      if (import.meta.env.DEV) {
        console.warn('加载记录失败:', error.message || error);
      }
      set({ error: error.message || '加载记录失败', isLoading: false });
    }
  },

  getRecordsByYear: (year: number) => {
    const { records } = get();
    return records.filter(record => record.year === year);
  },

  getRecordsByTheme: (theme: Theme) => {
    const { records } = get();
    return records.filter(record => record.theme === theme);
  },

  getRecordById: (id: string) => {
    const { records } = get();
    return records.find(record => record.id === id);
  },

  getYearStats: (year: number) => {
    const { records } = get();
    const yearRecords = records.filter(record => record.year === year);

    if (yearRecords.length === 0) return null;

    const moodCounts: Record<Mood, number> = {} as Record<Mood, number>;
    let totalMoods = 0;

    yearRecords.forEach(record => {
      if (record.mood) {
        moodCounts[record.mood] = (moodCounts[record.mood] || 0) + 1;
        totalMoods++;
      }
    });

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood as Mood,
      count,
      percentage: Math.round((count / totalMoods) * 100),
    }));

    const tagCounts: Record<string, number> = {};
    yearRecords.forEach(record => {
      record.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    const featuredPhotos = yearRecords
      .filter(record => record.photos.length > 0)
      .slice(0, 4)
      .map(record => record.photos[0]);

    return {
      year,
      recordCount: yearRecords.length,
      moodDistribution,
      topTags,
      featuredPhotos,
    };
  },

  getThemeStats: () => {
    const { records } = get();
    const themeMap = new Map<Theme, TimeRecord[]>();

    records.forEach(record => {
      if (record.theme) {
        const themeRecords = themeMap.get(record.theme) || [];
        themeRecords.push(record);
        themeMap.set(record.theme, themeRecords);
      }
    });

    const themeStats: ThemeStats[] = [];
    themeMap.forEach((themeRecords, theme) => {
      const sortedRecords = sortByDate([...themeRecords], 'asc');
      const dates = sortedRecords.map(r => r.recordDate);
      const startDate = dates[0];
      const endDate = dates[dates.length - 1];

      const featuredPhotos: Photo[] = [];
      for (const record of sortedRecords) {
        if (record.photos.length > 0) {
          featuredPhotos.push(record.photos[0]);
          if (featuredPhotos.length >= 3) break;
        }
      }

      themeStats.push({
        theme,
        recordCount: sortedRecords.length,
        timeRange: {
          start: startDate,
          end: endDate,
        },
        featuredPhotos,
      });
    });

    return themeStats;
  },

  getAllThemes: () => {
    const { records } = get();
    const themes = new Set<Theme>();
    records.forEach(record => {
      if (record.theme) {
        themes.add(record.theme);
      }
    });
    return Array.from(themes);
  },

  getAvailableYears: () => {
    const { records } = get();
    const years = [...new Set(records.map(record => record.year))];
    return years.sort((a, b) => a - b);
  },

  searchRecords: (query: string) => {
    const { records } = get();
    const lowerQuery = query.toLowerCase();

    return records.filter(record =>
      record.title.toLowerCase().includes(lowerQuery) ||
      record.content.toLowerCase().includes(lowerQuery) ||
      record.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      record.location?.toLowerCase().includes(lowerQuery)
    );
  },

  saveRecord: async (record: Omit<TimeRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    // 检查Supabase配置是否有效
    if (!isSupabaseConfigured()) {
      set({ useSupabase: false });
    }
    
    const { records, useSupabase } = get();

    const id = generateId();
    const now = new Date().toISOString();

    const newRecord: TimeRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now,
    };

    try {
      if (useSupabase && isSupabaseConfigured()) {
        // 保存到Supabase
        const { error } = await supabase
          .from('records')
          .insert([toSupabaseFormat(newRecord)]);

        if (error) {
          // 仅在开发模式下输出警告，fallback到localStorage
          if (import.meta.env.DEV) {
            console.warn('Supabase保存失败，将使用localStorage:', error.message);
          }
          // fallback到localStorage
          const newRecords = sortByDate([newRecord, ...records]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
          set({ records: newRecords, useSupabase: false });
          return newRecord;
        }

        // 重新加载记录
        await get().loadRecords();
      } else {
        // 保存到localStorage
        const newRecords = sortByDate([newRecord, ...records]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
        set({ records: newRecords });
      }

      return newRecord;
    } catch (error: any) {
      // 仅在开发模式下输出警告
      if (import.meta.env.DEV) {
        console.warn('保存记录失败:', error.message || error);
      }
      throw error;
    }
  },

  updateRecord: async (id: string, updates: Partial<TimeRecord>) => {
    // 检查Supabase配置是否有效
    if (!isSupabaseConfigured()) {
      set({ useSupabase: false });
    }
    
    const { records, useSupabase } = get();

    const index = records.findIndex(record => record.id === id);
    if (index === -1) {
      return null;
    }

    const updatedRecord: TimeRecord = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (useSupabase && isSupabaseConfigured()) {
        // 更新Supabase
        const { error } = await supabase
          .from('records')
          .update({
            ...updates,
            updatedAt: updatedRecord.updatedAt,
          })
          .eq('id', id);

        if (error) {
          // 仅在开发模式下输出警告，fallback到localStorage
          if (import.meta.env.DEV) {
            console.warn('Supabase更新失败，将使用localStorage:', error.message);
          }
          // fallback到localStorage
          const newRecords = [...records];
          newRecords[index] = updatedRecord;
          const sortedRecords = sortByDate(newRecords);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedRecords));
          set({ records: sortedRecords, useSupabase: false });
          return updatedRecord;
        }

        // 重新加载记录
        await get().loadRecords();
        return updatedRecord;
      } else {
        // 更新localStorage
        const newRecords = [...records];
        newRecords[index] = updatedRecord;
        const sortedRecords = sortByDate(newRecords);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedRecords));
        set({ records: sortedRecords });
        return updatedRecord;
      }
    } catch (error: any) {
      // 仅在开发模式下输出警告
      if (import.meta.env.DEV) {
        console.warn('更新记录失败:', error.message || error);
      }
      throw error;
    }
  },

  deleteRecord: async (id: string) => {
    // 检查Supabase配置是否有效
    if (!isSupabaseConfigured()) {
      set({ useSupabase: false });
    }
    
    const { records, useSupabase } = get();

    const index = records.findIndex(record => record.id === id);
    if (index === -1) {
      return false;
    }

    try {
      if (useSupabase && isSupabaseConfigured()) {
        // 从Supabase删除
        const { error } = await supabase
          .from('records')
          .delete()
          .eq('id', id);

        if (error) {
          // 仅在开发模式下输出警告，fallback到localStorage
          if (import.meta.env.DEV) {
            console.warn('Supabase删除失败，将使用localStorage:', error.message);
          }
          // fallback到localStorage
          const newRecords = records.filter(record => record.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
          set({ records: newRecords, useSupabase: false });
          return true;
        }

        // 重新加载记录
        await get().loadRecords();
      } else {
        // 从localStorage删除
        const newRecords = records.filter(record => record.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
        set({ records: newRecords });
      }

      return true;
    } catch (error: any) {
      // 仅在开发模式下输出警告
      if (import.meta.env.DEV) {
        console.warn('删除记录失败:', error.message || error);
      }
      throw error;
    }
  },

  switchDataSource: (useSupabase: boolean) => {
    set({ useSupabase });
    localStorage.setItem(USE_SUPABASE_KEY, String(useSupabase));
    // 切换后重新加载记录
    get().loadRecords();
  },
}));

// 初始化：检查是否使用Supabase
const savedUseSupabase = localStorage.getItem(USE_SUPABASE_KEY);
if (savedUseSupabase === 'true' && isSupabaseConfigured()) {
  useRecords.setState({ useSupabase: true });
}

// 初始化加载记录
useRecords.getState().loadRecords();
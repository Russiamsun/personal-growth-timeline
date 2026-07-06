import { create } from 'zustand';
import { TimeRecord, YearStats, Mood, Photo, Theme, ThemeStats } from '@/types';
import { sortByDate } from '@/utils/dateUtils';
import recordsData from '@/data/records.json';

const STORAGE_KEY = 'time-records';

interface RecordsState {
  records: TimeRecord[];
  isLoading: boolean;
  error: string | null;

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
  saveRecord: (record: Omit<TimeRecord, 'id' | 'createdAt' | 'updatedAt'>) => TimeRecord;
  updateRecord: (id: string, updates: Partial<TimeRecord>) => TimeRecord | null;
  deleteRecord: (id: string) => boolean;
}

export const useRecords = create<RecordsState>((set, get) => ({
  records: [],
  isLoading: false,
  error: null,

  loadRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      // 模拟异步加载
      await new Promise(resolve => setTimeout(resolve, 100));

      // 从 localStorage 加载数据
      const storedRecords = localStorage.getItem(STORAGE_KEY);

      if (storedRecords) {
        // 如果 localStorage 有数据，使用 localStorage 的数据
        const records = sortByDate(JSON.parse(storedRecords) as TimeRecord[]);
        set({ records, isLoading: false });
      } else {
        // 否则使用 JSON 文件作为初始数据
        const records = sortByDate(recordsData.records as TimeRecord[]);
        // 保存到 localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        set({ records, isLoading: false });
      }
    } catch (error) {
      set({ error: '加载记录失败', isLoading: false });
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

    // 计算心情分布
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

    // 获取高频标签
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

    // 精选照片（每条记录取第一张，最多4张）
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

    // 按主题分组
    records.forEach(record => {
      if (record.theme) {
        const themeRecords = themeMap.get(record.theme) || [];
        themeRecords.push(record);
        themeMap.set(record.theme, themeRecords);
      }
    });

    // 计算每个主题的统计信息
    const themeStats: ThemeStats[] = [];
    themeMap.forEach((themeRecords, theme) => {
      // 按日期排序（从旧到新）
      const sortedRecords = sortByDate([...themeRecords], 'asc');

      // 提取日期
      const dates = sortedRecords.map(r => r.recordDate);
      const startDate = dates[0];
      const endDate = dates[dates.length - 1];

      // 精选照片（取每条记录的第一张，最多3张）
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
    // 从旧到新排序
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

  // 保存新记录
  saveRecord: (record: Omit<TimeRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { records } = get();

    // 生成唯一ID
    const id = `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newRecord: TimeRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // 添加到记录列表并按日期排序
    const newRecords = sortByDate([newRecord, ...records]);

    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));

    // 更新状态
    set({ records: newRecords });

    return newRecord;
  },

  // 更新记录
  updateRecord: (id: string, updates: Partial<TimeRecord>) => {
    const { records } = get();

    const index = records.findIndex(record => record.id === id);
    if (index === -1) {
      return null;
    }

    const updatedRecord: TimeRecord = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // 更新记录列表
    const newRecords = [...records];
    newRecords[index] = updatedRecord;

    // 按日期重新排序
    const sortedRecords = sortByDate(newRecords);

    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedRecords));

    // 更新状态
    set({ records: sortedRecords });

    return updatedRecord;
  },

  // 删除记录
  deleteRecord: (id: string) => {
    const { records } = get();

    const index = records.findIndex(record => record.id === id);
    if (index === -1) {
      return false;
    }

    // 过滤掉要删除的记录
    const newRecords = records.filter(record => record.id !== id);

    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));

    // 更新状态
    set({ records: newRecords });

    return true;
  },
}));

// 初始化加载记录
useRecords.getState().loadRecords();
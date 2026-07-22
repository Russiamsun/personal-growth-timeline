import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity, Question, Reflection } from '@/types';
import initialData from '@/data/emma-data.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DataContextType {
  // Activities
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  // Questions
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;

  // Reflections
  reflections: Reflection[];
  addReflection: (reflection: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReflection: (id: string, updates: Partial<Reflection>) => Promise<void>;
  deleteReflection: (id: string) => Promise<void>;

  // 状态
  isLoading: boolean;
  dataSource: 'local' | 'supabase';
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'emma-growth-data';
const DATA_VERSION_KEY = 'emma-growth-version';
const DATA_VERSION = 'v4'; // 升级版本号以支持Supabase

// 数据源配置
const getDataSource = (): 'local' | 'supabase' => {
  const config = import.meta.env.VITE_DATA_SOURCE;
  if (config === 'supabase' && isSupabaseConfigured()) {
    return 'supabase';
  }
  return 'local';
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource] = useState<'local' | 'supabase'>(getDataSource());

  // 数据迁移函数：将旧的单语言字段转换为新的双语言字段（逐字段检查）
  const migrateActivity = (activity: any): Activity => {
    return {
      ...activity,
      titleZh: activity.titleZh || activity.title_zh || activity.title || '',
      titleEn: activity.titleEn || activity.title_en || activity.title || '',
      descriptionZh: activity.descriptionZh || activity.description_zh || activity.description || '',
      descriptionEn: activity.descriptionEn || activity.description_en || activity.description || '',
      contentZh: activity.contentZh || activity.content_zh || activity.content || '',
      contentEn: activity.contentEn || activity.content_en || activity.content || '',
      locationZh: activity.locationZh || activity.location_zh || activity.location || '',
      locationEn: activity.locationEn || activity.location_en || activity.location || '',
      tagsZh: activity.tagsZh || activity.tags_zh || activity.tags || [],
      tagsEn: activity.tagsEn || activity.tags_en || [],
      photos: activity.photos || [],
      createdAt: activity.createdAt || activity.created_at || new Date().toISOString(),
      updatedAt: activity.updatedAt || activity.updated_at || new Date().toISOString(),
    };
  };

  const migrateQuestion = (question: any): Question => {
    return {
      ...question,
      questionZh: question.questionZh || question.question_zh || question.question || '',
      questionEn: question.questionEn || question.question_en || question.question || '',
      thoughtsZh: question.thoughtsZh || question.thoughts_zh || question.thoughts || '',
      thoughtsEn: question.thoughtsEn || question.thoughts_en || question.thoughts || '',
      tagsZh: question.tagsZh || question.tags_zh || question.tags || [],
      tagsEn: question.tagsEn || question.tags_en || [],
      createdAt: question.createdAt || question.created_at || new Date().toISOString(),
      updatedAt: question.updatedAt || question.updated_at || new Date().toISOString(),
    };
  };

  const migrateReflection = (reflection: any): Reflection => {
    return {
      ...reflection,
      contentZh: reflection.contentZh || reflection.content_zh || reflection.content || '',
      contentEn: reflection.contentEn || reflection.content_en || reflection.content || '',
      tagsZh: reflection.tagsZh || reflection.tags_zh || reflection.tags || [],
      tagsEn: reflection.tagsEn || reflection.tags_en || [],
      createdAt: reflection.createdAt || reflection.created_at || new Date().toISOString(),
      updatedAt: reflection.updatedAt || reflection.updated_at || new Date().toISOString(),
    };
  };

  // Supabase数据库操作
  const loadFromSupabase = async () => {
    try {
      console.log('[Supabase] 开始从云端加载数据...');

      // 并行加载三张表
      const [activitiesRes, questionsRes, reflectionsRes] = await Promise.all([
        supabase.from('activities').select('*').order('date', { ascending: false }),
        supabase.from('questions').select('*').order('date', { ascending: false }),
        supabase.from('reflections').select('*').order('date', { ascending: false }),
      ]);

      if (activitiesRes.error) throw activitiesRes.error;
      if (questionsRes.error) throw questionsRes.error;
      if (reflectionsRes.error) throw reflectionsRes.error;

      // 转换字段名（Supabase使用下划线，前端使用驼峰）
      const activitiesData = (activitiesRes.data || []).map((item: any) => migrateActivity({
        id: item.id,
        type: item.type,
        titleZh: item.title_zh,
        titleEn: item.title_en,
        descriptionZh: item.description_zh,
        descriptionEn: item.description_en,
        contentZh: item.content_zh,
        contentEn: item.content_en,
        date: item.date,
        locationZh: item.location_zh,
        locationEn: item.location_en,
        photos: item.photos || [],
        tagsZh: item.tags_zh || [],
        tagsEn: item.tags_en || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      const questionsData = (questionsRes.data || []).map((item: any) => migrateQuestion({
        id: item.id,
        questionZh: item.question_zh,
        questionEn: item.question_en,
        thoughtsZh: item.thoughts_zh,
        thoughtsEn: item.thoughts_en,
        date: item.date,
        tagsZh: item.tags_zh || [],
        tagsEn: item.tags_en || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      const reflectionsData = (reflectionsRes.data || []).map((item: any) => migrateReflection({
        id: item.id,
        contentZh: item.content_zh,
        contentEn: item.content_en,
        date: item.date,
        tagsZh: item.tags_zh || [],
        tagsEn: item.tags_en || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setActivities(activitiesData);
      setQuestions(questionsData);
      setReflections(reflectionsData);

      console.log(`[Supabase] 数据加载成功: ${activitiesData.length}个活动, ${questionsData.length}个问题, ${reflectionsData.length}个反思`);
    } catch (error) {
      console.error('[Supabase] 加载数据失败:', error);
      throw error;
    }
  };

  // localStorage操作
  const loadFromLocalStorage = () => {
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);

    // 如果版本不匹配，清除旧数据
    if (storedVersion !== DATA_VERSION) {
      console.log(`[LocalStorage] 数据版本不匹配: ${storedVersion} -> ${DATA_VERSION}, 清除旧数据`);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);

      const { activities: a, questions: q, reflections: r } = initialData as any;
      setActivities(a || []);
      setQuestions(q || []);
      setReflections(r || []);
      return;
    }

    if (stored) {
      try {
        const data = JSON.parse(stored);
        const migratedActivities = (data.activities || []).map(migrateActivity);
        const migratedQuestions = (data.questions || []).map(migrateQuestion);
        const migratedReflections = (data.reflections || []).map(migrateReflection);

        setActivities(migratedActivities);
        setQuestions(migratedQuestions);
        setReflections(migratedReflections);
        console.log(`[LocalStorage] 数据加载成功: ${migratedActivities.length}个活动, ${migratedQuestions.length}个问题, ${migratedReflections.length}个反思`);
      } catch (error) {
        console.error('[LocalStorage] 数据解析失败:', error);
        const { activities: a, questions: q, reflections: r } = initialData as any;
        setActivities(a || []);
        setQuestions(q || []);
        setReflections(r || []);
      }
    } else {
      localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      const { activities: a, questions: q, reflections: r } = initialData as any;
      setActivities(a || []);
      setQuestions(q || []);
      setReflections(r || []);
    }
  };

  // 初始化数据加载
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);

      try {
        if (dataSource === 'supabase') {
          await loadFromSupabase();
        } else {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('[初始化失败] 回退到localStorage:', error);
        loadFromLocalStorage();
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeData();
  }, [dataSource]);

  // localStorage持久化（仅在本地模式下）
  useEffect(() => {
    if (!isInitialized || dataSource !== 'local') return;

    try {
      const dataToStore = JSON.stringify({
        activities,
        questions,
        reflections,
      });

      const dataSize = new Blob([dataToStore]).size;
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (dataSize > maxSize) {
        console.warn(`[LocalStorage] 数据大小 ${Math.round(dataSize / 1024 / 1024)}MB 已超过建议限制`);
      }

      localStorage.setItem(STORAGE_KEY, dataToStore);
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        console.error('[LocalStorage] 存储空间不足:', error);
        alert('存储空间不足！照片数据过大，建议：\n1. 减少照片数量\n2. 使用网络图片URL而非上传本地文件\n3. 清除旧数据重新开始');
      } else {
        console.error('[LocalStorage] 保存失败:', error);
      }
    }
  }, [activities, questions, reflections, isInitialized, dataSource]);

  // 生成唯一ID
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // ==================== Activities CRUD ====================
  const addActivity = async (activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = generateId();
    const newActivity: Activity = {
      ...activityData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // 乐观更新：立即更新UI
    setActivities(prev => [newActivity, ...prev]);

    if (dataSource === 'supabase') {
      try {
        const { error } = await supabase.from('activities').insert({
          id: newActivity.id,
          type: newActivity.type,
          title_zh: newActivity.titleZh,
          title_en: newActivity.titleEn,
          description_zh: newActivity.descriptionZh,
          description_en: newActivity.descriptionEn,
          content_zh: newActivity.contentZh,
          content_en: newActivity.contentEn,
          date: newActivity.date,
          location_zh: newActivity.locationZh,
          location_en: newActivity.locationEn,
          photos: newActivity.photos,
          tags_zh: newActivity.tagsZh,
          tags_en: newActivity.tagsEn,
          created_at: newActivity.createdAt,
          updated_at: newActivity.updatedAt,
        });

        if (error) throw error;
        console.log('[Supabase] 活动添加成功:', id);
      } catch (error) {
        console.error('[Supabase] 活动添加失败:', error);
        // 回滚
        setActivities(prev => prev.filter(a => a.id !== id));
        throw error;
      }
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    const now = new Date().toISOString();

    // 乐观更新
    setActivities(prev => prev.map(activity =>
      activity.id === id ? { ...activity, ...updates, updatedAt: now } : activity
    ));

    if (dataSource === 'supabase') {
      try {
        const updateData: any = { updated_at: now };
        if (updates.type) updateData.type = updates.type;
        if (updates.titleZh) updateData.title_zh = updates.titleZh;
        if (updates.titleEn) updateData.title_en = updates.titleEn;
        if (updates.descriptionZh !== undefined) updateData.description_zh = updates.descriptionZh;
        if (updates.descriptionEn !== undefined) updateData.description_en = updates.descriptionEn;
        if (updates.contentZh !== undefined) updateData.content_zh = updates.contentZh;
        if (updates.contentEn !== undefined) updateData.content_en = updates.contentEn;
        if (updates.date) updateData.date = updates.date;
        if (updates.locationZh !== undefined) updateData.location_zh = updates.locationZh;
        if (updates.locationEn !== undefined) updateData.location_en = updates.locationEn;
        if (updates.photos) updateData.photos = updates.photos;
        if (updates.tagsZh) updateData.tags_zh = updates.tagsZh;
        if (updates.tagsEn) updateData.tags_en = updates.tagsEn;

        const { error } = await supabase.from('activities').update(updateData).eq('id', id);
        if (error) throw error;
        console.log('[Supabase] 活动更新成功:', id);
      } catch (error) {
        console.error('[Supabase] 活动更新失败:', error);
        // 这里可以添加回滚逻辑
        throw error;
      }
    }
  };

  const deleteActivity = async (id: string) => {
    // 乐观删除
    const deletedActivity = activities.find(a => a.id === id);
    setActivities(prev => prev.filter(activity => activity.id !== id));

    if (dataSource === 'supabase') {
      try {
        const { error } = await supabase.from('activities').delete().eq('id', id);
        if (error) throw error;
        console.log('[Supabase] 活动删除成功:', id);
      } catch (error) {
        console.error('[Supabase] 活动删除失败:', error);
        // 回滚
        if (deletedActivity) {
          setActivities(prev => [...prev, deletedActivity]);
        }
        throw error;
      }
    }
  };

  // ==================== Questions CRUD ====================
  const addQuestion = async (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = generateId();
    const newQuestion: Question = {
      ...questionData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    setQuestions(prev => [newQuestion, ...prev]);

    if (dataSource === 'supabase') {
      try {
        const { error } = await supabase.from('questions').insert({
          id: newQuestion.id,
          question_zh: newQuestion.questionZh,
          question_en: newQuestion.questionEn,
          thoughts_zh: newQuestion.thoughtsZh,
          thoughts_en: newQuestion.thoughtsEn,
          date: newQuestion.date,
          tags_zh: newQuestion.tagsZh,
          tags_en: newQuestion.tagsEn,
          created_at: newQuestion.createdAt,
          updated_at: newQuestion.updatedAt,
        });

        if (error) throw error;
        console.log('[Supabase] 问题添加成功:', id);
      } catch (error) {
        console.error('[Supabase] 问题添加失败:', error);
        setQuestions(prev => prev.filter(q => q.id !== id));
        throw error;
      }
    }
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    const now = new Date().toISOString();

    setQuestions(prev => prev.map(question =>
      question.id === id ? { ...question, ...updates, updatedAt: now } : question
    ));

    if (dataSource === 'supabase') {
      try {
        const updateData: any = { updated_at: now };
        if (updates.questionZh) updateData.question_zh = updates.questionZh;
        if (updates.questionEn) updateData.question_en = updates.questionEn;
        if (updates.thoughtsZh !== undefined) updateData.thoughts_zh = updates.thoughtsZh;
        if (updates.thoughtsEn !== undefined) updateData.thoughts_en = updates.thoughtsEn;
        if (updates.date) updateData.date = updates.date;
        if (updates.tagsZh) updateData.tags_zh = updates.tagsZh;
        if (updates.tagsEn) updateData.tags_en = updates.tagsEn;

        const { error } = await supabase.from('questions').update(updateData).eq('id', id);
        if (error) throw error;
        console.log('[Supabase] 问题更新成功:', id);
      } catch (error) {
        console.error('[Supabase] 问题更新失败:', error);
        throw error;
      }
    }
  };

  const deleteQuestion = async (id: string) => {
    const deletedQuestion = questions.find(q => q.id === id);
    setQuestions(prev => prev.filter(question => question.id !== id));

    if (dataSource === 'supabase') {
      try {
        const { error } = await supabase.from('questions').delete().eq('id', id);
        if (error) throw error;
        console.log('[Supabase] 问题删除成功:', id);
      } catch (error) {
        console.error('[Supabase] 问题删除失败:', error);
        if (deletedQuestion) {
          setQuestions(prev => [...prev, deletedQuestion]);
        }
        throw error;
      }
    }
  };

  // ==================== Reflections CRUD ====================
  const addReflection = async (reflectionData: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = generateId();
    const newReflection: Reflection = {
      ...reflectionData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    setReflections(prev => [newReflection, ...prev]);

    if (dataSource === 'supabase') {
      try {
        const { error } = await supabase.from('reflections').insert({
          id: newReflection.id,
          content_zh: newReflection.contentZh,
          content_en: newReflection.contentEn,
          date: newReflection.date,
          tags_zh: newReflection.tagsZh,
          tags_en: newReflection.tagsEn,
          created_at: newReflection.createdAt,
          updated_at: newReflection.updatedAt,
        });

        if (error) throw error;
        console.log('[Supabase] 反思添加成功:', id);
      } catch (error) {
        console.error('[Supabase] 反思添加失败:', error);
        setReflections(prev => prev.filter(r => r.id !== id));
        throw error;
      }
    }
  };

  const updateReflection = async (id: string, updates: Partial<Reflection>) => {
    const now = new Date().toISOString();

    setReflections(prev => prev.map(reflection =>
      reflection.id === id ? { ...reflection, ...updates, updatedAt: now } : reflection
    ));

    if (dataSource === 'supabase') {
      try {
        const updateData: any = { updated_at: now };
        if (updates.contentZh) updateData.content_zh = updates.contentZh;
        if (updates.contentEn) updateData.content_en = updates.contentEn;
        if (updates.date) updateData.date = updates.date;
        if (updates.tagsZh) updateData.tags_zh = updates.tagsZh;
        if (updates.tagsEn) updateData.tags_en = updates.tagsEn;

        const { error } = await supabase.from('reflections').update(updateData).eq('id', id);
        if (error) throw error;
        console.log('[Supabase] 反思更新成功:', id);
      } catch (error) {
        console.error('[Supabase] 反思更新失败:', error);
        throw error;
      }
    }
  };

  const deleteReflection = async (id: string) => {
    const deletedReflection = reflections.find(r => r.id === id);
    setReflections(prev => prev.filter(reflection => reflection.id !== id));

    if (dataSource === 'supabase') {
      try {
        const { error } = await supabase.from('reflections').delete().eq('id', id);
        if (error) throw error;
        console.log('[Supabase] 反思删除成功:', id);
      } catch (error) {
        console.error('[Supabase] 反思删除失败:', error);
        if (deletedReflection) {
          setReflections(prev => [...prev, deletedReflection]);
        }
        throw error;
      }
    }
  };

  return (
    <DataContext.Provider value={{
      activities,
      addActivity,
      updateActivity,
      deleteActivity,
      questions,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      reflections,
      addReflection,
      updateReflection,
      deleteReflection,
      isLoading,
      dataSource,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
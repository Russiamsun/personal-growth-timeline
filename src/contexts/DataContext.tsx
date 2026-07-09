import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity, Question, Reflection } from '@/types';
import initialData from '@/data/emma-data.json';

interface DataContextType {
  // Activities
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  
  // Questions
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  
  // Reflections
  reflections: Reflection[];
  addReflection: (reflection: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReflection: (id: string, updates: Partial<Reflection>) => void;
  deleteReflection: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'emma-growth-data';
const DATA_VERSION_KEY = 'emma-growth-version';
const DATA_VERSION = 'v3'; // 数据版本号，每次数据结构重大变化时更新

export function DataProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 数据迁移函数：将旧的单语言字段转换为新的双语言字段（逐字段检查）
  // 关键：tagsEn应为空数组（除非已有英文标签），让fallback逻辑正确工作
  const migrateActivity = (activity: any): Activity => {
    return {
      ...activity,
      // 逐字段检查并迁移
      titleZh: activity.titleZh || activity.title || '',
      titleEn: activity.titleEn || activity.title || '',
      descriptionZh: activity.descriptionZh || activity.description || '',
      descriptionEn: activity.descriptionEn || activity.description || '',
      contentZh: activity.contentZh || activity.content || '',
      contentEn: activity.contentEn || activity.content || '',
      locationZh: activity.locationZh || activity.location || '',
      locationEn: activity.locationEn || activity.location || '',
      tagsZh: activity.tagsZh || activity.tags || [],
      tagsEn: activity.tagsEn || [], // 如果没有英文标签，设为空数组，而不是复制中文tags
    };
  };

  const migrateQuestion = (question: any): Question => {
    return {
      ...question,
      questionZh: question.questionZh || question.question || '',
      questionEn: question.questionEn || question.question || '',
      thoughtsZh: question.thoughtsZh || question.thoughts || '',
      thoughtsEn: question.thoughtsEn || question.thoughts || '',
      tagsZh: question.tagsZh || question.tags || [],
      tagsEn: question.tagsEn || [], // 如果没有英文标签，设为空数组
    };
  };

  const migrateReflection = (reflection: any): Reflection => {
    return {
      ...reflection,
      contentZh: reflection.contentZh || reflection.content || '',
      contentEn: reflection.contentEn || reflection.content || '',
      tagsZh: reflection.tagsZh || reflection.tags || [],
      tagsEn: reflection.tagsEn || [], // 如果没有英文标签，设为空数组
    };
  };

  // 初始化：从localStorage或初始数据加载（带版本检测）
  useEffect(() => {
    // 检查数据版本
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);

    // 如果版本不匹配，清除旧数据
    if (storedVersion !== DATA_VERSION) {
      console.log(`Data version mismatch: stored=${storedVersion}, current=${DATA_VERSION}. Clearing old data.`);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      
      // 直接使用初始数据
      const { activities: a, questions: q, reflections: r } = initialData as any;
      setActivities(a || []);
      setQuestions(q || []);
      setReflections(r || []);
    } else if (stored) {
      // 版本匹配，尝试加载localStorage数据
      try {
        const data = JSON.parse(stored);
        // 迁移旧数据格式（补充缺失字段）
        const migratedActivities = (data.activities || []).map(migrateActivity);
        const migratedQuestions = (data.questions || []).map(migrateQuestion);
        const migratedReflections = (data.reflections || []).map(migrateReflection);
        
        setActivities(migratedActivities);
        setQuestions(migratedQuestions);
        setReflections(migratedReflections);
      } catch (error) {
        console.error('Failed to parse stored data:', error);
        // 使用初始数据
        const { activities: a, questions: q, reflections: r } = initialData as any;
        setActivities(a || []);
        setQuestions(q || []);
        setReflections(r || []);
      }
    } else {
      // 无localStorage数据，使用初始数据
      localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      const { activities: a, questions: q, reflections: r } = initialData as any;
      setActivities(a || []);
      setQuestions(q || []);
      setReflections(r || []);
    }
    setIsInitialized(true);
  }, []);

  // 每次数据变化都保存到localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        const dataToStore = JSON.stringify({
          activities,
          questions,
          reflections,
        });
        
        // 检查数据大小（localStorage限制约5-10MB）
        const dataSize = new Blob([dataToStore]).size;
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (dataSize > maxSize) {
          console.warn(`数据大小 ${Math.round(dataSize / 1024 / 1024)}MB 已超过建议限制`);
          // 可以选择压缩照片质量或提醒用户
        }
        
        localStorage.setItem(STORAGE_KEY, dataToStore);
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.error('localStorage存储空间不足:', error);
          alert('存储空间不足！照片数据过大，建议：\n1. 减少照片数量\n2. 使用网络图片URL而非上传本地文件\n3. 清除旧数据重新开始');
        } else {
          console.error('localStorage保存失败:', error);
          alert('数据保存失败，请检查浏览器设置或减少照片数量');
        }
      }
    }
  }, [activities, questions, reflections, isInitialized]);

  // 生成唯一ID
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Activities CRUD
  const addActivity = (activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id 
        ? { ...activity, ...updates, updatedAt: new Date().toISOString() }
        : activity
    ));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  // Questions CRUD
  const addQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newQuestion: Question = {
      ...questionData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(question => 
      question.id === id 
        ? { ...question, ...updates, updatedAt: new Date().toISOString() }
        : question
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(question => question.id !== id));
  };

  // Reflections CRUD
  const addReflection = (reflectionData: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newReflection: Reflection = {
      ...reflectionData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setReflections(prev => [...prev, newReflection]);
  };

  const updateReflection = (id: string, updates: Partial<Reflection>) => {
    setReflections(prev => prev.map(reflection => 
      reflection.id === id 
        ? { ...reflection, ...updates, updatedAt: new Date().toISOString() }
        : reflection
    ));
  };

  const deleteReflection = (id: string) => {
    setReflections(prev => prev.filter(reflection => reflection.id !== id));
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
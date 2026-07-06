// 心情类型
export type Mood = 'happy' | 'calm' | 'moved' | 'excited' | 'sad' | 'anxious' | 'thinking' | 'striving';

// 主题类型
export type Theme = 'cambridge-study' | 'charity-family' | 'personal-growth' | 'travel-explore' | 'work-career' | 'life-daily';

// 时间记录类型
export interface TimeRecord {
  id: string;
  title: string;
  content: string;          // 富文本HTML内容
  recordDate: string;       // YYYY-MM-DD格式
  mood?: Mood;              // 心情标记
  theme?: Theme;            // 主题篇章
  location?: string;        // 地点
  tags: string[];           // 标签数组
  photos: Photo[];          // 照片数组
  year: number;             // 年份(便于查询)
  createdAt: string;        // 创建时间戳
  updatedAt: string;        // 更新时间戳
}

// 照片类型
export interface Photo {
  id: string;
  url: string;              // 照片路径(相对路径)
  order: number;            // 排序序号
  uploadedAt: string;       // 上传时间
}

// 年度统计类型
export interface YearStats {
  year: number;
  recordCount: number;
  moodDistribution: {       // 心情分布
    mood: Mood;
    count: number;
    percentage: number;
  }[];
  topTags: string[];        // 高频标签
  featuredPhotos: Photo[];  // 精选照片
}

// 心情图标映射
export const MoodIcons: Record<Mood, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: '开心', color: '#FFD93D' },
  calm: { emoji: '😌', label: '平静', color: '#6BCB77' },
  moved: { emoji: '🥰', label: '感动', color: '#FF6B9D' },
  excited: { emoji: '🎉', label: '兴奋', color: '#FF8C42' },
  sad: { emoji: '😢', label: '难过', color: '#4A90E2' },
  anxious: { emoji: '😰', label: '焦虑', color: '#C9B1FF' },
  thinking: { emoji: '🤔', label: '思考', color: '#95E1D3' },
  striving: { emoji: '💪', label: '努力', color: '#F38181' },
};

// 心情颜色映射到Tailwind类名
export const MoodColorClasses: Record<Mood, string> = {
  happy: 'bg-mood-happy',
  calm: 'bg-mood-calm',
  moved: 'bg-mood-moved',
  excited: 'bg-mood-excited',
  sad: 'bg-mood-sad',
  anxious: 'bg-mood-anxious',
  thinking: 'bg-mood-thinking',
  striving: 'bg-mood-striving',
};

// 主题图标和颜色映射
export const ThemeConfig: Record<Theme, { 
  label: string; 
  icon: string; 
  color: string; 
  gradient: string;
}> = {
  'cambridge-study': {
    label: '剑桥研学',
    icon: '🎓',
    color: '#4A90E2',
    gradient: 'from-blue-400 to-indigo-500',
  },
  'charity-family': {
    label: '小家公益',
    icon: '🏠',
    color: '#FF6B9D',
    gradient: 'from-pink-400 to-rose-500',
  },
  'personal-growth': {
    label: '个人成长',
    icon: '🌱',
    color: '#6BCB77',
    gradient: 'from-green-400 to-emerald-500',
  },
  'travel-explore': {
    label: '旅行探索',
    icon: '🌍',
    color: '#FF8C42',
    gradient: 'from-orange-400 to-amber-500',
  },
  'work-career': {
    label: '工作职场',
    icon: '💼',
    color: '#C9B1FF',
    gradient: 'from-purple-400 to-violet-500',
  },
  'life-daily': {
    label: '生活日常',
    icon: '☕',
    color: '#95E1D3',
    gradient: 'from-teal-400 to-cyan-500',
  },
};

// 主题统计类型
export interface ThemeStats {
  theme: Theme;
  recordCount: number;
  timeRange: {
    start: string;
    end: string;
  };
  featuredPhotos: Photo[];
}
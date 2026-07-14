import React, { createContext, useContext, useState, ReactNode } from 'react';

// 支持的语言类型
export type Language = 'zh' | 'en';

// 翻译对象类型
export interface TranslationStrings {
  // 导航
  nav: {
    home: string;
    experiences: string;
    questions: string;
    reflection: string;
    timeline: string;
    stats: string;
  };
  
  // 首页
  home: {
    title: string;
    subtitle: string;
    ageBadge: string;
    sectionExperiences: string;
    sectionQuestions: string;
    sectionReflection: string;
    viewMore: string;
  };
  
  // 经历页面
  experiences: {
    title: string;
    subtitle: string;
    createNew: string;
    edit: string;
    delete: string;
    photos: string;
    morePhotos: string;
  };
  
  // 问题页面
  questions: {
    title: string;
    subtitle: string;
    createNew: string;
    edit: string;
    delete: string;
  };
  
  // 反思页面
  reflection: {
    title: string;
    subtitle: string;
    createNew: string;
    edit: string;
    delete: string;
  };
  
  // 时间轴页面
  timeline: {
    title: string;
    subtitle: string;
  };
  
  // 表单通用
  form: {
    createActivity: string;
    editActivity: string;
    createQuestion: string;
    editQuestion: string;
    createReflection: string;
    editReflection: string;
    save: string;
    cancel: string;
    back: string;
    submit: string;
    update: string;
    deleteConfirm: string;
    success: string;
    loading: string;
    
    // 字段标签
    type: string;
    title: string;
    titleEn: string;
    titleZh: string;
    description: string;
    descriptionEn: string;
    descriptionZh: string;
    content: string;
    contentEn: string;
    contentZh: string;
    date: string;
    location: string;
    locationEn: string;
    locationZh: string;
    tags: string;
    tagsZh: string;
    tagsEn: string;
    photos: string;
    question: string;
    questionEn: string;
    questionZh: string;
    thoughts: string;
    thoughtsEn: string;
    thoughtsZh: string;
    reflectionContent: string;
    reflectionContentEn: string;
    reflectionContentZh: string;
    
    // 错误提示
    errorRequired: string;
    errorTitle: string;
    errorDescription: string;
    errorContent: string;
    errorDate: string;
    errorQuestion: string;
    errorReflection: string;
    errorSave: string;
    errorUpload: string;
    
    // 照片相关
    uploadFile: string;
    uploadUrl: string;
    addUrlPhoto: string;
    photoUrl: string;
    photoCaption: string;
    photoCount: string;
    uploading: string;
    dragDrop: string;
    supportedFormats: string;
    storageWarning: string;
    
    // 语言切换提示
    languageSwitch: string;
    currentLanguage: string;
    switchToZh: string;
    switchToEn: string;
    inputBoth: string;
    inputZh: string;
    inputEn: string;
    
    // 活动详情页
    activityNotFound: string;
    backToActivities: string;
    activityPhotos: string;
    activityDetails: string;
    photoToUpload: string;
  };
  
  // 活动类型
  activityTypes: {
    charity: string;
    'science-museum': string;
    'city-explore': string;
    'ai-experience': string;
    'social-observation': string;
  };
  
  // 通用
  common: {
    loading: string;
    noData: string;
    noPhotos: string;
    clickToView: string;
    deleteSuccess: string;
    confirmDelete: string;
  };
}

// 翻译内容
const translations: Record<Language, TranslationStrings> = {
  zh: {
    nav: {
      home: '首页',
      experiences: '实践经历',
      questions: '思考探究',
      reflection: '成长感悟',
      timeline: '时光轴',
      stats: '统计',
    },
    home: {
      title: 'Emma | Growing Up in the AI Era',
      subtitle: '一个关于好奇心、真实世界与未来成长的长期观察计划',
      ageBadge: 'Age 9',
      sectionExperiences: '实践经历',
      sectionQuestions: '思考探究',
      sectionReflection: '成长感悟',
      viewMore: '查看更多',
    },
    experiences: {
      title: '实践经历',
      subtitle: '公益活动、科学馆、城市探索、AI体验、社会观察',
      createNew: '创建新活动',
      edit: '编辑',
      delete: '删除',
      photos: '张照片',
      morePhotos: '张照片',
    },
    questions: {
      title: '思考探究',
      subtitle: 'genuine curiosity - 真实好奇心',
      createNew: '创建新问题',
      edit: '编辑',
      delete: '删除',
    },
    reflection: {
      title: '成长感悟',
      subtitle: '简短真实的成长感悟',
      createNew: '创建新反思',
      edit: '编辑',
      delete: '删除',
    },
    timeline: {
      title: '时光轴',
      subtitle: 'Emma的成长历程',
    },
    form: {
      createActivity: '创建活动',
      editActivity: '编辑活动',
      createQuestion: '创建问题',
      editQuestion: '编辑问题',
      createReflection: '创建反思',
      editReflection: '编辑反思',
      save: '保存',
      cancel: '取消',
      back: '返回',
      submit: '提交',
      update: '更新',
      deleteConfirm: '确认删除',
      success: '操作成功',
      loading: '加载中...',
      
      type: '活动类型',
      title: '标题',
      titleEn: '英文标题',
      titleZh: '中文标题',
      description: '描述',
      descriptionEn: '英文描述',
      descriptionZh: '中文描述',
      content: '内容',
      contentEn: '英文内容',
      contentZh: '中文内容',
      date: '日期',
      location: '地点',
      locationEn: '英文地点',
      locationZh: '中文地点',
      tags: '标签',
      tagsZh: '中文标签',
      tagsEn: '英文标签',
      photos: '照片',
      question: '问题',
      questionEn: '英文问题',
      questionZh: '中文问题',
      thoughts: '思考',
      thoughtsEn: '英文思考',
      thoughtsZh: '中文思考',
      reflectionContent: '反思内容',
      reflectionContentEn: '英文反思',
      reflectionContentZh: '中文反思',
      
      errorRequired: '不能为空',
      errorTitle: '标题不能为空',
      errorDescription: '描述不能为空',
      errorContent: '内容不能为空',
      errorDate: '请选择日期',
      errorQuestion: '问题不能为空',
      errorReflection: '反思内容不能为空',
      errorSave: '保存失败，请重试',
      errorUpload: '上传失败，请重试',
      
      uploadFile: '上传本地文件',
      uploadUrl: '添加网络图片URL',
      addUrlPhoto: '添加网络图片',
      photoUrl: '图片URL',
      photoCaption: '图片说明（可选）',
      photoCount: '已添加照片',
      uploading: '正在上传...',
      dragDrop: '点击上传照片',
      supportedFormats: '支持 JPG/PNG/WEBP 格式，可一次上传多张照片',
      storageWarning: '存储空间不足！照片数据过大',
      
      languageSwitch: '语言切换',
      currentLanguage: '当前语言',
      switchToZh: '切换到中文',
      switchToEn: '切换到英文',
      inputBoth: '双语输入',
      inputZh: '中文输入',
      inputEn: '英文输入',
      
      // 活动详情页
      activityNotFound: '找不到活动详情',
      backToActivities: '返回活动列表',
      activityPhotos: '活动照片',
      activityDetails: '活动详情',
      photoToUpload: '照片待上传',
    },
    activityTypes: {
      charity: '公益活动',
      'science-museum': '科学馆',
      'city-explore': '城市探索',
      'ai-experience': 'AI体验',
      'social-observation': '社会观察',
    },
    common: {
      loading: '加载中...',
      noData: '暂无数据',
      noPhotos: '暂无照片',
      clickToView: '点击查看详情',
      deleteSuccess: '删除成功',
      confirmDelete: '确认要删除吗？',
    },
  },
  en: {
    nav: {
      home: 'Home',
      experiences: 'Real World Experiences',
      questions: 'Questions I\'m Thinking About',
      reflection: 'Reflection Journal',
      timeline: 'Timeline',
      stats: 'Statistics',
    },
    home: {
      title: 'Emma | Growing Up in the AI Era',
      subtitle: 'A long-term observation project about curiosity, real world and future growth',
      ageBadge: 'Age 9',
      sectionExperiences: 'Real World Experiences',
      sectionQuestions: 'Questions I\'m Thinking About',
      sectionReflection: 'Reflection Journal',
      viewMore: 'View More',
    },
    experiences: {
      title: 'Experiences',
      subtitle: 'Charity, Science Museums, City Exploration, AI Experience, Social Observation',
      createNew: 'Create New Activity',
      edit: 'Edit',
      delete: 'Delete',
      photos: 'photos',
      morePhotos: 'photos',
    },
    questions: {
      title: 'Questions',
      subtitle: 'genuine curiosity - authentic wondering',
      createNew: 'Create New Question',
      edit: 'Edit',
      delete: 'Delete',
    },
    reflection: {
      title: 'Reflection',
      subtitle: 'Short authentic growth reflections',
      createNew: 'Create New Reflection',
      edit: 'Edit',
      delete: 'Delete',
    },
    timeline: {
      title: 'Timeline',
      subtitle: 'Emma\'s Growth Journey',
    },
    form: {
      createActivity: 'Create Activity',
      editActivity: 'Edit Activity',
      createQuestion: 'Create Question',
      editQuestion: 'Edit Question',
      createReflection: 'Create Reflection',
      editReflection: 'Edit Reflection',
      save: 'Save',
      cancel: 'Cancel',
      back: 'Back',
      submit: 'Submit',
      update: 'Update',
      deleteConfirm: 'Confirm Delete',
      success: 'Success',
      loading: 'Loading...',
      
      type: 'Activity Type',
      title: 'Title',
      titleEn: 'English Title',
      titleZh: 'Chinese Title',
      description: 'Description',
      descriptionEn: 'English Description',
      descriptionZh: 'Chinese Description',
      content: 'Content',
      contentEn: 'English Content',
      contentZh: 'Chinese Content',
      date: 'Date',
      location: 'Location',
      locationEn: 'English Location',
      locationZh: 'Chinese Location',
      tags: 'Tags',
      tagsZh: 'Chinese Tags',
      tagsEn: 'English Tags',
      photos: 'Photos',
      question: 'Question',
      questionEn: 'English Question',
      questionZh: 'Chinese Question',
      thoughts: 'Thoughts',
      thoughtsEn: 'English Thoughts',
      thoughtsZh: 'Chinese Thoughts',
      reflectionContent: 'Reflection',
      reflectionContentEn: 'English Reflection',
      reflectionContentZh: 'Chinese Reflection',
      
      errorRequired: 'is required',
      errorTitle: 'Title is required',
      errorDescription: 'Description is required',
      errorContent: 'Content is required',
      errorDate: 'Please select a date',
      errorQuestion: 'Question is required',
      errorReflection: 'Reflection content is required',
      errorSave: 'Save failed, please retry',
      errorUpload: 'Upload failed, please retry',
      
      uploadFile: 'Upload Local File',
      uploadUrl: 'Add Image URL',
      addUrlPhoto: 'Add Web Image',
      photoUrl: 'Image URL',
      photoCaption: 'Caption (optional)',
      photoCount: 'Photos Added',
      uploading: 'Uploading...',
      dragDrop: 'Click to upload photos',
      supportedFormats: 'Supports JPG/PNG/WEBP, multiple files allowed',
      storageWarning: 'Storage space insufficient! Photo data too large',
      
      languageSwitch: 'Language Switch',
      currentLanguage: 'Current Language',
      switchToZh: 'Switch to Chinese',
      switchToEn: 'Switch to English',
      inputBoth: 'Bilingual Input',
      inputZh: 'Chinese Input',
      inputEn: 'English Input',
      
      // 活动详情页
      activityNotFound: 'Activity not found',
      backToActivities: 'Back to Activities',
      activityPhotos: 'Activity Photos',
      activityDetails: 'Activity Details',
      photoToUpload: 'Photo to be uploaded',
    },
    activityTypes: {
      charity: 'Charity Activity',
      'science-museum': 'Science Museum',
      'city-explore': 'City Exploration',
      'ai-experience': 'AI Experience',
      'social-observation': 'Social Observation',
    },
    common: {
      loading: 'Loading...',
      noData: 'No data yet',
      noPhotos: 'No photos yet',
      clickToView: 'Click to view details',
      deleteSuccess: 'Deleted successfully',
      confirmDelete: 'Confirm deletion?',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // 从localStorage加载语言设置
    const saved = localStorage.getItem('emma-language');
    return (saved === 'zh' || saved === 'en') ? saved : 'zh';
  });

  // 切换语言
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    localStorage.setItem('emma-language', newLang);
  };

  // 每次语言变化都保存到localStorage
  React.useEffect(() => {
    localStorage.setItem('emma-language', language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
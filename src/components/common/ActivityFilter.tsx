import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Activity, ActivityType, Language } from '@/types';
import { ActivityTypeConfig } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FilterOptions {
  searchQuery: string;
  selectedTypes: ActivityType[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface ActivityFilterProps {
  activities: Activity[];
  onFilterChange: (filtered: Activity[]) => void;
}

const defaultFilters: FilterOptions = {
  searchQuery: '',
  selectedTypes: [],
  dateRange: {
    start: '',
    end: '',
  },
};

export function ActivityFilter({ activities, onFilterChange }: ActivityFilterProps) {
  const { language, t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    activities.forEach((activity) => {
      const activityTags = language === 'zh' ? activity.tagsZh : activity.tagsEn;
      activityTags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [activities, language]);

  // 应用筛选
  const applyFilters = useMemo(() => {
    return activities.filter((activity) => {
      // 搜索查询
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const title = language === 'zh' ? activity.titleZh : activity.titleEn;
        const description = language === 'zh' ? activity.descriptionZh : activity.descriptionEn;
        const tags = language === 'zh' ? activity.tagsZh : activity.tagsEn;
        
        const matchesSearch =
          title?.toLowerCase().includes(query) ||
          description?.toLowerCase().includes(query) ||
          tags?.some((tag) => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // 类型筛选
      if (filters.selectedTypes.length > 0) {
        if (!filters.selectedTypes.includes(activity.type)) {
          return false;
        }
      }

      // 日期范围筛选
      if (filters.dateRange.start && activity.date < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && activity.date > filters.dateRange.end) {
        return false;
      }

      return true;
    });
  }, [activities, filters, language]);

  // 通知父组件筛选结果变化
  useMemo(() => {
    onFilterChange(applyFilters);
  }, [applyFilters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.selectedTypes.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="mb-6">
      {/* 搜索栏 */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            placeholder={language === 'zh' ? '搜索活动、标签...' : 'Search activities, tags...'}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
            showFilters || hasActiveFilters
              ? 'border-orange-500 bg-orange-50 text-orange-700'
              : 'border-gray-200 text-gray-600 hover:border-orange-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-5 h-5" />
          <span>{language === 'zh' ? '筛选' : 'Filter'}</span>
          {hasActiveFilters && (
            <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {filters.selectedTypes.length + (filters.dateRange.start ? 1 : 0) + (filters.dateRange.end ? 1 : 0)}
            </span>
          )}
        </motion.button>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-white rounded-lg border-2 border-orange-200 shadow-sm"
        >
          {/* 活动类型筛选 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'zh' ? '活动类型' : 'Activity Type'}
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ActivityTypeConfig).map(([key, config]) => (
                <motion.button
                  key={key}
                  onClick={() => {
                    const type = key as ActivityType;
                    const newTypes = filters.selectedTypes.includes(type)
                      ? filters.selectedTypes.filter((t) => t !== type)
                      : [...filters.selectedTypes, type];
                    handleFilterChange('selectedTypes', newTypes);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                    filters.selectedTypes.includes(key as ActivityType)
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-orange-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{config.icon}</span>
                  <span className="text-sm">{language === 'zh' ? config.label : key}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 日期范围筛选 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {language === 'zh' ? '日期范围' : 'Date Range'}
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    start: e.target.value,
                  })
                }
                placeholder={language === 'zh' ? '开始日期' : 'Start Date'}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
              <span className="text-gray-400 self-center">—</span>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    end: e.target.value,
                  })
                }
                placeholder={language === 'zh' ? '结束日期' : 'End Date'}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* 清除筛选 */}
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <X className="w-4 h-4" />
              <span>{language === 'zh' ? '清除所有筛选' : 'Clear all filters'}</span>
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ActivityFilter;
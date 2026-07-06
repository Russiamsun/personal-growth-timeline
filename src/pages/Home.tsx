import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Filter, Grid, Clock } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { RecordCard } from '@/components/timeline/RecordCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeConfig, Theme } from '@/types';
import { cn } from '@/lib/utils';

// 逐字动画组件
function AnimatedTitle({ text }: { text: string }) {
  const words = text.split('');

  return (
    <div className="flex items-center justify-center flex-wrap gap-1">
      {words.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: index * 0.05,
            type: 'spring',
            stiffness: 200,
            damping: 10,
          }}
          className={cn(
            'inline-block text-4xl md:text-6xl font-bold text-white',
            char === ' ' ? 'w-4' : ''
          )}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const {
    records,
    isLoading,
    error,
    loadRecords,
    getAvailableYears,
    getYearStats,
    getThemeStats
  } = useRecords();

  const [filterMode, setFilterMode] = useState<'all' | 'theme' | 'time'>('all');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const years = getAvailableYears();
  const themeStats = getThemeStats();

  // 过滤记录
  const filteredRecords = records.filter(record => {
    if (filterMode === 'all') return true;
    if (filterMode === 'theme' && selectedTheme) {
      return record.theme === selectedTheme;
    }
    if (filterMode === 'time' && selectedYear) {
      return record.year === selectedYear;
    }
    return true;
  });

  const handleRecordClick = (record: { id: string }) => {
    navigate(`/record/${record.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => loadRecords()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 区域 */}
      <motion.div
        className="relative overflow-hidden py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-90" />

        {/* 装饰图案 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-pink-300 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ delay: 1, duration: 1, ease: 'easeInOut' }}
              >
                <Sparkles className="w-10 h-10 text-yellow-300" />
              </motion.div>
              <AnimatedTitle text="我的成长时光轴" />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ delay: 1, duration: 1, ease: 'easeInOut' }}
              >
                <Sparkles className="w-10 h-10 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* 副标语 */}
          <motion.p
            className="text-white/90 text-lg md:text-xl text-center max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            记录人生每一段经历，见证成长轨迹
          </motion.p>

          {/* 公告栏 */}
          <motion.div
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <p className="text-white text-center text-sm">
              📝 共记录了 <span className="font-bold">{records.length}</span> 个精彩瞬间，
              跨越 <span className="font-bold">{years.length}</span> 年时光，
              涵盖 <span className="font-bold">{themeStats.length}</span> 个主题
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧边栏 */}
          <div className="lg:w-72 flex-shrink-0">
            <Sidebar />
          </div>

          {/* 右侧内容区 */}
          <div className="flex-1 min-w-0">
            {/* 工具栏 */}
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900">成长记录</h2>

              {/* 筛选按钮 */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => {
                    setFilterMode('all');
                    setSelectedTheme(null);
                    setSelectedYear(null);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm',
                    filterMode === 'all'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilterMode('theme')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm',
                    filterMode === 'theme'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid className="w-4 h-4" />
                  按主题
                </button>
                <button
                  onClick={() => setFilterMode('time')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm',
                    filterMode === 'time'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Clock className="w-4 h-4" />
                  按时间
                </button>
              </div>
            </motion.div>

            {/* 筛选选项 */}
            <AnimatePresence>
              {filterMode === 'theme' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-sm text-gray-600 mb-3">选择主题：</p>
                    <div className="flex flex-wrap gap-2">
                      {themeStats.map(stat => {
                        const config = ThemeConfig[stat.theme];
                        return (
                          <button
                            key={stat.theme}
                            onClick={() => setSelectedTheme(
                              selectedTheme === stat.theme ? null : stat.theme
                            )}
                            className={cn(
                              'px-4 py-2 rounded-full text-sm font-medium transition-all',
                              selectedTheme === stat.theme
                                ? 'text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            )}
                            style={selectedTheme === stat.theme ? {
                              backgroundColor: config.color,
                            } : {}}
                          >
                            {config.icon} {config.label} ({stat.recordCount})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {filterMode === 'time' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-sm text-gray-600 mb-3">选择年份：</p>
                    <div className="flex flex-wrap gap-2">
                      {years.map(year => {
                        const yearStats = getYearStats(year);
                        return (
                          <button
                            key={year}
                            onClick={() => setSelectedYear(
                              selectedYear === year ? null : year
                            )}
                            className={cn(
                              'px-4 py-2 rounded-full text-sm font-medium transition-all',
                              selectedYear === year
                                ? 'bg-purple-500 text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            )}
                          >
                            {year}年 ({yearStats?.recordCount || 0})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 记录列表 */}
            <AnimatePresence mode="wait">
              {filteredRecords.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <p className="text-gray-500">暂无记录</p>
                </motion.div>
              ) : (
                <motion.div
                  key="records"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <RecordCard
                        record={record}
                        onClick={handleRecordClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
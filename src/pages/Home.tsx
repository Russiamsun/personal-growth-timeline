import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, Plus, Filter, Grid, Clock } from 'lucide-react';
import { useRecords } from '@/hooks/useRecords';
import { YearCard } from '@/components/timeline/YearCard';
import { ThemeConfig, ThemeStats } from '@/types';
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

// 主题卡片组件
function ThemeCard({
  themeStats,
  onClick,
}: {
  themeStats: ThemeStats;
  onClick: () => void;
}) {
  const config = ThemeConfig[themeStats.theme];

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 背景渐变 */}
      <div className={cn('h-48 p-6 bg-gradient-to-br', config.gradient)}>
        {/* 内容 */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* 图标和标题 */}
          <div>
            <div className="text-5xl mb-3">{config.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{config.label}</h3>
          </div>

          {/* 统计信息 */}
          <div className="text-white/90">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{themeStats.recordCount} 条记录</span>
            </div>
            <div className="text-xs opacity-80">
              {themeStats.timeRange.start} → {themeStats.timeRange.end}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 年份时间轴组件
function YearTimeline({
  years,
  onYearClick,
}: {
  years: number[];
  onYearClick: (year: number) => void;
}) {
  return (
    <div className="relative">
      {/* 时间线 */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 opacity-30" />

      {/* 年份列表 */}
      <div className="space-y-6">
        {years.map((year, index) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center gap-6"
          >
            {/* 时间线节点 */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {year}
            </div>

            {/* 年份卡片 */}
            <motion.div
              className="flex-1 bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onYearClick(year)}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {year} 年
                  </h4>
                  <p className="text-sm text-gray-500">点击查看详情</p>
                </div>
                <div className="flex items-center gap-2 text-purple-500">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { records, isLoading, error, loadRecords, getAvailableYears, getYearStats, getThemeStats } = useRecords();
  const [filterMode, setFilterMode] = useState<'theme' | 'time'>('theme');

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const years = getAvailableYears();
  const themeStats = getThemeStats();

  const handleYearClick = (year: number) => {
    navigate(`/year/${year}`);
  };

  const handleThemeClick = (theme: string) => {
    // 暂时跳转到主题对应的记录列表
    // 后续可以创建专门的主题详情页
    console.log('Theme clicked:', theme);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => loadRecords()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page min-h-screen">
      {/* Hero 区域 - 逐字动画标题 */}
      <motion.div
        className="hero-section relative overflow-hidden py-20 md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 动态渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90" />

        {/* 装饰图案 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-pink-300 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* 主标题 - 逐字动画 */}
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

          {/* 副标题 */}
          <motion.p
            className="text-white/90 text-lg md:text-xl text-center max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            记录生活中的点点滴滴，见证成长的每一步
          </motion.p>

          {/* 统计信息 */}
          <motion.div
            className="flex justify-center gap-8 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{years.length} 个年份</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>{records.length} 条记录</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 顶部工具栏 */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">浏览记录</h2>

            {/* 筛选按钮 */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilterMode('theme')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                  filterMode === 'theme'
                    ? 'bg-white shadow-md text-purple-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Grid className="w-4 h-4" />
                按主题
              </button>
              <button
                onClick={() => setFilterMode('time')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                  filterMode === 'time'
                    ? 'bg-white shadow-md text-purple-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Clock className="w-4 h-4" />
                按时间
              </button>
            </div>
          </div>

          {/* 新建按钮 */}
          <motion.button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            新建记录
          </motion.button>
        </motion.div>

        {/* 内容展示区域 */}
        <AnimatePresence mode="wait">
          {filterMode === 'theme' ? (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {themeStats.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>暂无主题记录</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {themeStats.map((stats, index) => (
                    <motion.div
                      key={stats.theme}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <ThemeCard
                        themeStats={stats}
                        onClick={() => handleThemeClick(stats.theme)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="time"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {years.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>暂无记录</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {years.map((year, index) => {
                    const yearStats = getYearStats(year);
                    if (!yearStats) return null;

                    return (
                      <motion.div
                        key={year}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <YearCard
                          yearStats={yearStats}
                          onClick={handleYearClick}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
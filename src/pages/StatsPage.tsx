import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
} from 'recharts';
import { Activity, TrendingUp, BookOpen, HelpCircle, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { ActivityTypeConfig } from '@/types';

export default function StatsPage() {
  const { language, t } = useLanguage();
  const { activities, questions, reflections } = useData();

  // 计算统计数据
  const statsData = useMemo(() => {
    // 活动按类型分布
    const activitiesByType = activities.reduce((acc, activity) => {
      const type = activity.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.entries(activitiesByType).map(([type, count]) => ({
      name: language === 'zh'
        ? ActivityTypeConfig[type as keyof typeof ActivityTypeConfig]?.label || type
        : type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: count,
      color: ActivityTypeConfig[type as keyof typeof ActivityTypeConfig]?.color || '#8884d8',
    }));

    // 获取月份
    const getMonth = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    // 活动按月份分布
    const activitiesByMonth = activities.reduce((acc, activity) => {
      const month = getMonth(activity.date);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 问题按月份分布
    const questionsByMonth = questions.reduce((acc, question) => {
      const month = getMonth(question.date);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 反思按月份分布
    const reflectionsByMonth = reflections.reduce((acc, reflection) => {
      const month = getMonth(reflection.date);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 合并所有月份
    const allMonths = Array.from(new Set([
      ...Object.keys(activitiesByMonth),
      ...Object.keys(questionsByMonth),
      ...Object.keys(reflectionsByMonth),
    ])).sort();

    // 月度数据（用于柱状图和折线图）
    const monthlyData = allMonths.map(month => ({
      month: month.replace('-', '年') + '月',
      monthShort: month,
      activities: activitiesByMonth[month] || 0,
      questions: questionsByMonth[month] || 0,
      reflections: reflectionsByMonth[month] || 0,
      total: (activitiesByMonth[month] || 0) + (questionsByMonth[month] || 0) + (reflectionsByMonth[month] || 0),
    }));

    // 有思考内容的问题数
    const questionsWithThoughts = questions.filter(q => q.thoughtsZh || q.thoughtsEn).length;

    // 反思平均长度
    const avgReflectionLength = reflections.length > 0
      ? Math.round(reflections.reduce((sum, r) => {
          const content = language === 'zh' ? r.contentZh : r.contentEn;
          return sum + content.length;
        }, 0) / reflections.length)
      : 0;

    // 记录天数（不重复的日期）
    const allDates = new Set([
      ...activities.map(a => a.date),
      ...questions.map(q => q.date),
      ...reflections.map(r => r.date),
    ]);

    // 最活跃月份
    let mostActiveMonth = '';
    let maxActivityCount = 0;
    allMonths.forEach(month => {
      const count = (activitiesByMonth[month] || 0) +
                    (questionsByMonth[month] || 0) +
                    (reflectionsByMonth[month] || 0);
      if (count > maxActivityCount) {
        maxActivityCount = count;
        mostActiveMonth = month;
      }
    });

    return {
      totalActivities: activities.length,
      totalQuestions: questions.length,
      totalReflections: reflections.length,
      totalRecords: activities.length + questions.length + reflections.length,
      pieChartData,
      monthlyData,
      questionsWithThoughts,
      avgReflectionLength,
      recordDays: allDates.size,
      mostActiveMonth,
      mostActiveMonthCount: maxActivityCount,
    };
  }, [activities, questions, reflections, language]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-12">
      {/* 页面标题 */}
      <motion.div
        className="relative overflow-hidden py-12 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-90" />

        {/* 装饰图案 */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-yellow-300" />
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {language === 'zh' ? '统计概览' : 'Statistics Overview'}
              </h1>
              <Sparkles className="w-10 h-10 text-yellow-300" />
            </div>
            <p className="text-white/90 text-lg md:text-xl">
              {language === 'zh' ? '数据洞察与成长轨迹' : 'Data Insights and Growth Trajectory'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* 总览卡片 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'zh' ? '活动总数' : 'Total Activities'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{statsData.totalActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'zh' ? '问题总数' : 'Total Questions'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{statsData.totalQuestions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'zh' ? '反思总数' : 'Total Reflections'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{statsData.totalReflections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'zh' ? '记录天数' : 'Record Days'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{statsData.recordDays}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 详细统计 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {language === 'zh' ? '问题统计' : 'Questions Stats'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {language === 'zh' ? '有思考内容' : 'With Thoughts'}
                </span>
                <span className="font-semibold text-indigo-600">{statsData.questionsWithThoughts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {language === 'zh' ? '无思考内容' : 'Without Thoughts'}
                </span>
                <span className="font-semibold text-gray-600">
                  {statsData.totalQuestions - statsData.questionsWithThoughts}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {language === 'zh' ? '反思统计' : 'Reflections Stats'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {language === 'zh' ? '平均长度' : 'Avg Length'}
                </span>
                <span className="font-semibold text-emerald-600">{statsData.avgReflectionLength} {language === 'zh' ? '字' : 'chars'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {language === 'zh' ? '总数量' : 'Total Count'}
                </span>
                <span className="font-semibold text-gray-600">{statsData.totalReflections}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {language === 'zh' ? '活跃度' : 'Activity Level'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {language === 'zh' ? '最活跃月份' : 'Most Active Month'}
                </span>
                <span className="font-semibold text-blue-600">
                  {statsData.mostActiveMonth ? statsData.mostActiveMonth.replace('-', '年') + '月' : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {language === 'zh' ? '记录总数' : 'Total Records'}
                </span>
                <span className="font-semibold text-gray-600">{statsData.totalRecords}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 图表区域 */}
        {statsData.totalRecords > 0 ? (
          <>
            {/* 饼图和柱状图 */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* 活动类型分布 - 饼图 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {language === 'zh' ? '活动类型分布' : 'Activity Types Distribution'}
                </h3>
                {statsData.pieChartData.length > 0 ? (
                  <PieChart width={400} height={300}>
                    <Pie
                      data={statsData.pieChartData}
                      cx={200}
                      cy={150}
                      labelLine={false}
                      label={(entry: any) => `${entry.name} (${entry.value})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statsData.pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    {language === 'zh' ? '暂无活动数据' : 'No activity data'}
                  </div>
                )}
              </div>

              {/* 月度活动分布 - 柱状图 */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {language === 'zh' ? '月度活动分布' : 'Monthly Distribution'}
                </h3>
                {statsData.monthlyData.length > 0 ? (
                  <BarChart width={500} height={300} data={statsData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activities" name={language === 'zh' ? '活动' : 'Activities'} fill="#FF6B9D" />
                    <Bar dataKey="questions" name={language === 'zh' ? '问题' : 'Questions'} fill="#6BCB77" />
                    <Bar dataKey="reflections" name={language === 'zh' ? '反思' : 'Reflections'} fill="#4A90E2" />
                  </BarChart>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    {language === 'zh' ? '暂无月度数据' : 'No monthly data'}
                  </div>
                )}
              </div>
            </motion.div>

            {/* 成长趋势 - 折线图 */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {language === 'zh' ? '成长趋势' : 'Growth Trend'}
                </h3>
              </div>
              {statsData.monthlyData.length > 0 ? (
                <LineChart width={1000} height={300} data={statsData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name={language === 'zh' ? '总数' : 'Total'}
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="activities"
                    name={language === 'zh' ? '活动' : 'Activities'}
                    stroke="#FF6B9D"
                    strokeWidth={2}
                    dot={{ fill: '#FF6B9D', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="questions"
                    name={language === 'zh' ? '问题' : 'Questions'}
                    stroke="#6BCB77"
                    strokeWidth={2}
                    dot={{ fill: '#6BCB77', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reflections"
                    name={language === 'zh' ? '反思' : 'Reflections'}
                    stroke="#4A90E2"
                    strokeWidth={2}
                    dot={{ fill: '#4A90E2', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  {language === 'zh' ? '暂无成长趋势数据' : 'No growth trend data'}
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {language === 'zh' ? '暂无数据' : 'No Data Yet'}
              </h3>
              <p className="text-gray-600 max-w-md">
                {language === 'zh'
                  ? '开始添加活动、问题和反思，即可查看成长统计数据'
                  : 'Start adding activities, questions, and reflections to see your growth statistics'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
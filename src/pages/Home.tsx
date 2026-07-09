import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, HelpCircle, BookOpen, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const sections = [
    {
      title: t.nav.experiences,
      subtitle: t.home.sectionExperiences,
      description: t.experiences.subtitle,
      icon: Globe,
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
      shadowColor: 'shadow-orange-200',
      hoverShadow: 'shadow-orange-300',
      path: '/experiences',
      hoverText: t.home.viewMore,
      particleColor: 'bg-orange-300',
    },
    {
      title: t.nav.questions,
      subtitle: t.home.sectionQuestions,
      description: t.questions.subtitle,
      icon: HelpCircle,
      gradient: 'from-indigo-500 via-purple-500 to-violet-600',
      shadowColor: 'shadow-indigo-200',
      hoverShadow: 'shadow-indigo-400',
      path: '/questions',
      hoverText: t.home.viewMore,
      particleColor: 'bg-purple-400',
    },
    {
      title: t.nav.reflection,
      subtitle: t.home.sectionReflection,
      description: t.reflection.subtitle,
      icon: BookOpen,
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      shadowColor: 'shadow-emerald-200',
      hoverShadow: 'shadow-emerald-300',
      path: '/reflection',
      hoverText: t.home.viewMore,
      particleColor: 'bg-green-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero 区域 */}
      <motion.div
        className="relative overflow-hidden py-20 md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 渐变背景 */}
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
            className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-36 h-36 bg-pink-300 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ delay: 1, duration: 1.5, ease: 'easeInOut' }}
              >
                <Sparkles className="w-12 h-12 text-yellow-300" />
              </motion.div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Emma
              </motion.h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ delay: 1, duration: 1.5, ease: 'easeInOut' }}
              >
                <Sparkles className="w-12 h-12 text-yellow-300" />
              </motion.div>
            </div>

            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-white/95 text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Growing Up in the AI Era
            </motion.h2>

            <motion.p
              className="text-white/85 text-lg md:text-xl text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {t.home.subtitle}
            </motion.p>
          </motion.div>

          {/* 年龄标识 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <Heart className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">{t.home.ageBadge} · Phase 1 · Growth Observation</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* 栏目介绍 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {language === 'zh' ? '我的成长世界' : 'My Growth World'}
          </h3>
          <p className="text-gray-600 text-lg">
            {language === 'zh' ? '三个核心栏目,记录成长的每一个瞬间' : 'Three core sections capturing every moment of growth'}
          </p>
        </motion.div>

        {/* 三个栏目卡片 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.6 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ delay: 2.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.08, y: -10 }}
              className="group cursor-pointer"
              onClick={() => navigate(section.path)}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${section.gradient} p-6 md:p-8 min-h-80 md:min-h-96 flex flex-col ${section.shadowColor} hover:${section.hoverShadow} transition-shadow duration-500`}>
                {/* 粒子装饰 */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 ${section.particleColor} rounded-full opacity-40`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}

                {/* 内容 */}
                <div className="relative z-10 flex flex-col h-full">
                  <motion.div
                    className="mb-4 inline-block"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <section.icon className="w-12 h-12 md:w-14 md:h-14 text-white drop-shadow-lg" />
                  </motion.div>

                  <h4 className="text-xl md:text-2xl font-bold text-white mb-3 drop-shadow-md">
                    {section.title}
                  </h4>

                  <p className="text-white/90 text-sm mb-2 leading-relaxed">
                    {section.subtitle}
                  </p>

                  <p className="text-white/80 text-xs leading-relaxed">
                    {section.description}
                  </p>

                  {/* Hover提示 */}
                  <motion.div
                    className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <p className="text-white/95 text-sm font-medium">
                      {section.hoverText}
                    </p>
                  </motion.div>
                </div>

                {/* 边框光效 */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
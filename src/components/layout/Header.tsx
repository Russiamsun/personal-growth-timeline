import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Globe, HelpCircle, BookOpen, Clock, Languages, BarChart2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/experiences', label: t.nav.experiences, icon: Globe },
    { path: '/questions', label: t.nav.questions, icon: HelpCircle },
    { path: '/reflection', label: t.nav.reflection, icon: BookOpen },
    { path: '/timeline', label: t.nav.timeline, icon: Clock },
    { path: '/stats', label: t.nav.stats, icon: BarChart2 },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* 柔和背景 */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-100" />

      {/* 内容层 */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">✨</span>
            <div className="hidden sm:block">
              <span className="text-gray-900 font-bold text-lg">
                Emma
              </span>
              <span className="text-gray-600 text-sm ml-1">
                | Growing Up in AI Era
              </span>
            </div>
          </motion.div>

          {/* 桌面端导航链接和语言切换 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'relative px-2 py-1.5 rounded-lg transition-all duration-300',
                    'flex items-center gap-1.5',
                    isActive
                      ? 'text-purple-600 font-semibold bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{item.label}</span>

                    {/* 激活指示器 */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-600 rounded-full"
                        layoutId="activeTab"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* 语言切换按钮 */}
            <motion.button
              onClick={toggleLanguage}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* 渐变背景 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* 额外的光效层 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0"
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />

              {/* 阴影效果 */}
              <motion.div
                className="absolute inset-0 shadow-lg shadow-purple-500/25"
                whileHover={{
                  boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.3)',
                }}
              />

              {/* 按钮内容 */}
              <div className="relative flex items-center gap-2 z-10">
                <Languages className="w-4 h-4" />
                <span>{language === 'zh' ? 'English' : '中文'}</span>
              </div>
            </motion.button>
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* 移动端下拉菜单 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block px-4 py-3 rounded-lg transition-all duration-300',
                        'flex items-center gap-3',
                        isActive
                          ? 'text-purple-600 font-semibold bg-purple-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}

                {/* 移动端语言切换按钮 */}
                <motion.button
                  onClick={() => {
                    toggleLanguage();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
                  whileTap={{ scale: 0.98 }}
                >
                  <Languages className="w-5 h-5" />
                  <span>{language === 'zh' ? 'English' : '中文'}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
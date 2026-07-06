import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/timeline', label: '时光轴', icon: Clock },
];

export function Header() {
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
            <span className="text-gray-900 font-bold text-lg hidden sm:block">
              成长时光轴
            </span>
          </motion.div>

          {/* 导航链接 */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'relative px-4 py-2 rounded-lg transition-all duration-300',
                    'flex items-center gap-2',
                    isActive
                      ? 'text-purple-600 font-semibold bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>

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

            {/* 新建按钮 */}
            <NavLink to="/create">
              <motion.button
                className="flex items-center gap-1 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">新建</span>
              </motion.button>
            </NavLink>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
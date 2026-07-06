import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/articles', label: '文章', icon: FileText },
  { path: '/timeline', label: '时光轴', icon: Clock },
  { path: '/about', label: '关于', icon: Info },
];

export function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* 毛玻璃背景层 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80 backdrop-blur-md shadow-lg" />

      {/* 内容层 */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">✨</span>
            <span className="text-white font-bold text-lg hidden sm:block">
              成长时光轴
            </span>
          </motion.div>

          {/* 导航链接 */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'relative px-3 py-2 rounded-lg transition-all duration-300',
                    'flex items-center gap-2 text-white/90 hover:text-white',
                    'hover:bg-white/10',
                    isActive && 'text-white font-semibold'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline text-sm">{item.label}</span>

                    {/* 激活指示器 */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
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
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
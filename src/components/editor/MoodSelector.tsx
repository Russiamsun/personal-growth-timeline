import { motion } from 'framer-motion';
import { Mood, MoodIcons } from '@/types';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  value?: Mood;
  onChange: (mood: Mood) => void;
  className?: string;
}

export function MoodSelector({ value, onChange, className }: MoodSelectorProps) {
  const moods: Mood[] = ['happy', 'calm', 'moved', 'excited', 'sad', 'anxious', 'thinking', 'striving'];

  return (
    <div className={cn('mood-selector', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        选择心情
      </label>
      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood) => {
          const moodInfo = MoodIcons[mood];
          const isSelected = value === mood;

          return (
            <motion.button
              key={mood}
              type="button"
              onClick={() => onChange(mood)}
              className={cn(
                'relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 选中指示器 */}
              {isSelected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Emoji */}
              <div
                className={cn(
                  'text-3xl mb-1.5 transition-transform',
                  isSelected && 'scale-110'
                )}
              >
                {moodInfo.emoji}
              </div>

              {/* 标签 */}
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isSelected ? 'text-blue-600' : 'text-gray-600'
                )}
              >
                {moodInfo.label}
              </span>

              {/* 颜色条 */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 h-1 rounded-b-lg transition-opacity',
                  isSelected ? 'opacity-100' : 'opacity-0'
                )}
                style={{ backgroundColor: moodInfo.color }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
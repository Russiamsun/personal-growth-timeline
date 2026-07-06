import { Mood, MoodIcons } from '@/types';
import { cn } from '@/lib/utils';

interface MoodIconProps {
  mood: Mood;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

const containerSizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export function MoodIcon({ 
  mood, 
  size = 'md', 
  showLabel = false,
  className 
}: MoodIconProps) {
  const moodInfo = MoodIcons[mood];
  
  if (!moodInfo) {
    return null;
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div 
        className={cn(
          'mood-icon inline-flex items-center justify-center rounded-full',
          containerSizeClasses[size]
        )}
        style={{ backgroundColor: `${moodInfo.color}20` }}
        title={moodInfo.label}
      >
        <span className={sizeClasses[size]}>{moodInfo.emoji}</span>
      </div>
      {showLabel && (
        <span 
          className="text-sm font-medium"
          style={{ color: moodInfo.color }}
        >
          {moodInfo.label}
        </span>
      )}
    </div>
  );
}

// 心情颜色条组件（用于统计展示）
interface MoodBarProps {
  moodDistribution: { mood: Mood; count: number; percentage: number }[];
  className?: string;
}

export function MoodBar({ moodDistribution, className }: MoodBarProps) {
  if (!moodDistribution || moodDistribution.length === 0) {
    return null;
  }

  return (
    <div className={cn('mood-bar flex items-center gap-1', className)}>
      {moodDistribution.map(({ mood, percentage }) => {
        const moodInfo = MoodIcons[mood];
        return (
          <div
            key={mood}
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: moodInfo.color,
              minWidth: '4px'
            }}
            title={`${moodInfo.label}: ${percentage}%`}
          />
        );
      })}
    </div>
  );
}
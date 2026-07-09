import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export type InputMode = 'both' | 'zh' | 'en';

interface InputModeSelectorProps {
  value: InputMode;
  onChange: (mode: InputMode) => void;
  colorScheme?: 'orange' | 'violet' | 'green';
}

const colorSchemes = {
  orange: {
    active: 'bg-orange-500 text-white shadow-md',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
  violet: {
    active: 'bg-violet-500 text-white shadow-md',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
  green: {
    active: 'bg-green-500 text-white shadow-md',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
};

export function InputModeSelector({ 
  value, 
  onChange, 
  colorScheme = 'orange' 
}: InputModeSelectorProps) {
  const { t } = useLanguage();
  const colors = colorSchemes[colorScheme];

  return (
    <div className="flex gap-2 border-b border-gray-200 pb-4">
      <motion.button
        type="button"
        onClick={() => onChange('both')}
        className={`px-4 py-2 rounded-lg transition-all ${
          value === 'both' ? colors.active : colors.inactive
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {t.form.inputBoth}
      </motion.button>
      <motion.button
        type="button"
        onClick={() => onChange('zh')}
        className={`px-4 py-2 rounded-lg transition-all ${
          value === 'zh' ? colors.active : colors.inactive
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {t.form.inputZh}
      </motion.button>
      <motion.button
        type="button"
        onClick={() => onChange('en')}
        className={`px-4 py-2 rounded-lg transition-all ${
          value === 'en' ? colors.active : colors.inactive
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {t.form.inputEn}
      </motion.button>
    </div>
  );
}

export default InputModeSelector;
import { useLanguage } from '@/contexts/LanguageContext';
import { InputMode } from './InputModeSelector';

interface BilingualInputProps {
  label: string;
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
  onChangeZh: (value: string) => void;
  onChangeEn: (value: string) => void;
  inputMode: InputMode;
  placeholderZh?: string;
  placeholderEn?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'textarea';
  rows?: number;
  helpText?: string;
}

export function BilingualInput({
  label,
  labelZh,
  labelEn,
  valueZh,
  valueEn,
  onChangeZh,
  onChangeEn,
  inputMode,
  placeholderZh,
  placeholderEn,
  error,
  required = false,
  type = 'text',
  rows = 4,
  helpText,
}: BilingualInputProps) {
  const { t } = useLanguage();

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3 rounded-lg border-2 transition-all 
    focus:outline-none focus:ring-2 focus:ring-orange-500 
    ${hasError ? 'border-red-500' : 'border-gray-200 hover:border-orange-300'}
    ${type === 'textarea' ? 'resize-none' : ''}
  `;

  const renderInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder?: string,
    hasError: boolean = false
  ) => {
    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses(hasError)}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses(hasError)}
      />
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {inputMode === 'both' ? (
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{labelZh}</label>
            {renderInput(valueZh, onChangeZh, placeholderZh, !!error)}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{labelEn}</label>
            {renderInput(valueEn, onChangeEn, placeholderEn, !!error)}
          </div>
        </div>
      ) : inputMode === 'zh' ? (
        renderInput(valueZh, onChangeZh, placeholderZh, !!error)
      ) : (
        renderInput(valueEn, onChangeEn, placeholderEn, !!error)
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-gray-500 text-xs mt-1">{helpText}</p>
      )}
    </div>
  );
}

export default BilingualInput;
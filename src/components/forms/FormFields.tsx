import React from 'react';
import { InputMode } from '@/hooks/useBilingualForm';

/**
 * 基础表单字段组件Props
 */
interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  colorScheme?: 'orange' | 'violet' | 'green';
  className?: string;
  children: React.ReactNode;
}

/**
 * 基础表单字段包装组件
 */
export function FormField({
  label,
  error,
  required = false,
  colorScheme = 'orange',
  className = '',
  children,
}: BaseFieldProps) {
  const colorMap = {
    orange: 'focus:ring-orange-500 hover:border-orange-300',
    violet: 'focus:ring-violet-500 hover:border-violet-300',
    green: 'focus:ring-green-500 hover:border-green-300',
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

/**
 * 文本输入组件Props
 */
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'number';
  error?: string;
  colorScheme?: 'orange' | 'violet' | 'green';
  disabled?: boolean;
  className?: string;
}

/**
 * 文本输入组件
 */
export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  colorScheme = 'orange',
  disabled = false,
  className = '',
}: TextInputProps) {
  const colorMap = {
    orange: 'focus:ring-orange-500 hover:border-orange-300',
    violet: 'focus:ring-violet-500 hover:border-violet-300',
    green: 'focus:ring-green-500 hover:border-green-300',
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${colorMap[colorScheme]} ${
        error ? 'border-red-500' : 'border-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    />
  );
}

/**
 * 文本域组件Props
 */
interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  colorScheme?: 'orange' | 'violet' | 'green';
  className?: string;
}

/**
 * 文本域组件
 */
export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  colorScheme = 'orange',
  className = '',
}: TextAreaProps) {
  const colorMap = {
    orange: 'focus:ring-orange-500 hover:border-orange-300',
    violet: 'focus:ring-violet-500 hover:border-violet-300',
    green: 'focus:ring-green-500 hover:border-green-300',
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 resize-none ${colorMap[colorScheme]} ${
        error ? 'border-red-500' : 'border-gray-200'
      } ${className}`}
    />
  );
}

/**
 * 双语输入字段Props
 */
interface BilingualInputFieldProps {
  label: string;
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
  onChangeZh: (value: string) => void;
  onChangeEn: (value: string) => void;
  inputMode: InputMode;
  type?: 'text' | 'textarea';
  rows?: number;
  error?: string;
  required?: boolean;
  colorScheme?: 'orange' | 'violet' | 'green';
}

/**
 * 双语输入字段组件
 * 
 * 根据inputMode自动显示对应的输入框
 */
export function BilingualInputField({
  label,
  labelZh,
  labelEn,
  valueZh,
  valueEn,
  onChangeZh,
  onChangeEn,
  inputMode,
  type = 'text',
  rows = 4,
  error,
  required = false,
  colorScheme = 'orange',
}: BilingualInputFieldProps) {
  const showBoth = inputMode === 'both';
  const showZh = inputMode === 'zh' || showBoth;
  const showEn = inputMode === 'en' || showBoth;

  const colorMap = {
    orange: 'focus:ring-orange-500 hover:border-orange-300',
    violet: 'focus:ring-violet-500 hover:border-violet-300',
    green: 'focus:ring-green-500 hover:border-green-300',
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${colorMap[colorScheme]} ${
    error ? 'border-red-500' : 'border-gray-200'
  }`;

  const renderInput = (value: string, onChange: (v: string) => void, placeholder: string) => {
    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClass} resize-none`}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    );
  };

  return (
    <FormField label={label} error={error} required={required} colorScheme={colorScheme}>
      {showBoth ? (
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{labelZh}</label>
            {renderInput(valueZh, onChangeZh, labelZh)}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{labelEn}</label>
            {renderInput(valueEn, onChangeEn, labelEn)}
          </div>
        </div>
      ) : showZh ? (
        renderInput(valueZh, onChangeZh, labelZh)
      ) : (
        renderInput(valueEn, onChangeEn, labelEn)
      )}
    </FormField>
  );
}

/**
 * 输入模式选择器Props
 */
interface InputModeSelectorProps {
  value: InputMode;
  onChange: (mode: InputMode) => void;
  labels?: {
    both: string;
    zh: string;
    en: string;
  };
  colorScheme?: 'orange' | 'violet' | 'green';
}

/**
 * 输入模式选择器组件
 */
export function InputModeSelector({
  value,
  onChange,
  labels = { both: '双语', zh: '中文', en: 'English' },
  colorScheme = 'orange',
}: InputModeSelectorProps) {
  const colorMap = {
    orange: 'bg-orange-500',
    violet: 'bg-violet-500',
    green: 'bg-green-500',
  };

  const modes: InputMode[] = ['both', 'zh', 'en'];

  return (
    <div className="flex gap-2 border-b border-gray-200 pb-4">
      {modes.map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`px-4 py-2 rounded-lg transition-all ${
            value === mode
              ? `${colorMap[colorScheme]} text-white shadow-md`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {labels[mode]}
        </button>
      ))}
    </div>
  );
}

export default FormField;
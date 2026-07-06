import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  maxTags = 10,
  suggestions = [],
  placeholder = '输入标签后按回车添加',
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 添加标签
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    if (tags.length >= maxTags) return;
    if (tags.includes(trimmedTag)) return;

    onChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  // 删除标签
  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  // 键盘事件处理
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // 删除最后一个标签
      removeTag(tags.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // 过滤建议标签
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !tags.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={cn('tag-input', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        标签
      </label>

      {/* 标签列表 */}
      <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <div className="flex flex-wrap gap-2 mb-2">
          <AnimatePresence mode="popLayout">
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm border border-gray-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Tag className="w-3 h-3 text-gray-500" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* 输入框 */}
        <div className="relative flex items-center gap-2">
          {tags.length < maxTags ? (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(e.target.value.length > 0 && suggestions.length > 0);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(inputValue.length > 0 && suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={tags.length === 0 ? placeholder : '继续添加标签...'}
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                disabled={!inputValue.trim()}
                className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">已达到最大标签数量 ({maxTags})</p>
          )}
        </div>

        {/* 建议标签 */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium">建议标签</p>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 帮助文本 */}
      <p className="mt-1.5 text-xs text-gray-500">
        按回车键添加标签，最多 {maxTags} 个标签
      </p>
    </div>
  );
}
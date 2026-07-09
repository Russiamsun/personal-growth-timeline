import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, List, ListOrdered, Eye, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createSafeHtml } from '@/utils/sanitize';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = '写下你的故事...',
  className,
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // 保存选区
  const saveSelection = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  // 插入格式
  const insertFormat = (prefix: string, suffix: string = prefix) => {
    if (!textareaRef.current) return;

    saveSelection();
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);

    onChange(newText);

    // 恢复焦点和选区
    setTimeout(() => {
      textarea.focus();
      const newStart = start + prefix.length;
      const newEnd = end + prefix.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  // 插入列表
  const insertList = (ordered: boolean) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const lines = selectedText.split('\n');
    const prefix = ordered ? '1. ' : '- ';
    const formattedLines = lines.map(line => prefix + line).join('\n');
    const newText = value.substring(0, start) + formattedLines + value.substring(end);

    onChange(newText);
    setTimeout(() => textarea.focus(), 0);
  };

  // 格式化按钮配置
  const formatButtons = [
    { icon: Bold, label: '加粗', action: () => insertFormat('**') },
    { icon: Italic, label: '斜体', action: () => insertFormat('*') },
    { icon: List, label: '无序列表', action: () => insertList(false) },
    { icon: ListOrdered, label: '有序列表', action: () => insertList(true) },
  ];

  // 简单的Markdown渲染为HTML
  const renderMarkdown = (text: string): string => {
    return text
      // 加粗
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 无序列表
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // 有序列表
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // 段落
      .split('\n\n')
      .map(para => {
        if (para.includes('<li>')) {
          return `<ul class="list-disc list-inside my-2">${para}</ul>`;
        }
        return `<p class="mb-2">${para}</p>`;
      })
      .join('');
  };

  return (
    <div className={cn('rich-text-editor', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-1">
          {formatButtons.map((button, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={button.action}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title={button.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button.icon className="w-4 h-4 text-gray-600" />
            </motion.button>
          ))}
        </div>

        {/* 预览切换 */}
        <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium transition-all',
              !isPreview ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Edit3 className="w-3.5 h-3.5" />
            编辑
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium transition-all',
              isPreview ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            预览
          </button>
        </div>
      </div>

      {/* 编辑器内容 */}
      <div className="border border-gray-300 rounded-b-lg overflow-hidden">
        {!isPreview ? (
          // 编辑模式
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[300px] p-4 outline-none resize-none text-gray-700 placeholder-gray-400"
            rows={12}
          />
        ) : (
          // 预览模式
          <div className="min-h-[300px] p-4 bg-white">
            {value ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={createSafeHtml(renderMarkdown(value))}
              />
            ) : (
              <p className="text-gray-400 text-center py-12">暂无内容</p>
            )}
          </div>
        )}
      </div>

      {/* 帮助文本 */}
      <p className="mt-1.5 text-xs text-gray-500">
        支持 Markdown 语法：**加粗**、*斜体*、- 无序列表、1. 有序列表
      </p>
    </div>
  );
}
import { useState, useEffect, useCallback, useRef } from 'react';
import { translateText } from '@/utils/translate';

/**
 * 自动翻译Hook
 * 当某个语言字段为空时，自动翻译另一种语言的内容
 */

interface UseAutoTranslateOptions {
  /** 是否启用自动翻译 */
  enabled?: boolean;
  /** 翻译延迟（毫秒），避免频繁调用API */
  delay?: number;
}

/**
 * 自动翻译单个字段
 */
export function useAutoTranslate(
  valueZh: string,
  valueEn: string,
  options: UseAutoTranslateOptions = {}
) {
  const { enabled = true, delay = 500 } = options;
  const [translatedZh, setTranslatedZh] = useState(valueZh);
  const [translatedEn, setTranslatedEn] = useState(valueEn);
  const [isTranslating, setIsTranslating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 当输入变化时，更新翻译结果
  useEffect(() => {
    setTranslatedZh(valueZh);
    setTranslatedEn(valueEn);
  }, [valueZh, valueEn]);

  // 自动翻译逻辑
  useEffect(() => {
    if (!enabled) return;

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 设置延迟翻译
    timeoutRef.current = setTimeout(async () => {
      // 如果中文有内容但英文为空，翻译中文到英文
      if (valueZh && valueZh.trim() && (!valueEn || !valueEn.trim())) {
        setIsTranslating(true);
        try {
          const translated = await translateText(valueZh, 'zh', 'en');
          setTranslatedEn(translated);
        } catch (error) {
          console.error('翻译失败:', error);
        } finally {
          setIsTranslating(false);
        }
      }
      // 如果英文有内容但中文为空，翻译英文到中文
      else if (valueEn && valueEn.trim() && (!valueZh || !valueZh.trim())) {
        setIsTranslating(true);
        try {
          const translated = await translateText(valueEn, 'en', 'zh');
          setTranslatedZh(translated);
        } catch (error) {
          console.error('翻译失败:', error);
        } finally {
          setIsTranslating(false);
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [valueZh, valueEn, enabled, delay]);

  return {
    translatedZh,
    translatedEn,
    isTranslating,
  };
}

/**
 * 批量自动翻译多个字段
 */
export function useAutoTranslateFields(
  fields: Record<string, { zh: string; en: string }>,
  options: UseAutoTranslateOptions = {}
) {
  const { enabled = true, delay = 500 } = options;
  const [translatedFields, setTranslatedFields] = useState(fields);
  const [isTranslating, setIsTranslating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 当输入变化时更新
  useEffect(() => {
    setTranslatedFields(fields);
  }, [fields]);

  // 自动翻译逻辑
  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const translations: Record<string, { zh: string; en: string }> = {};
      let hasTranslation = false;

      for (const [key, value] of Object.entries(fields)) {
        if (value.zh && value.zh.trim() && (!value.en || !value.en.trim())) {
          hasTranslation = true;
        } else if (value.en && value.en.trim() && (!value.zh || !value.zh.trim())) {
          hasTranslation = true;
        }
      }

      if (!hasTranslation) return;

      setIsTranslating(true);
      try {
        for (const [key, value] of Object.entries(fields)) {
          if (value.zh && value.zh.trim() && (!value.en || !value.en.trim())) {
            const translated = await translateText(value.zh, 'zh', 'en');
            translations[key] = { zh: value.zh, en: translated };
          } else if (value.en && value.en.trim() && (!value.zh || !value.zh.trim())) {
            const translated = await translateText(value.en, 'en', 'zh');
            translations[key] = { zh: translated, en: value.en };
          } else {
            translations[key] = value;
          }
        }
        setTranslatedFields(translations);
      } catch (error) {
        console.error('批量翻译失败:', error);
      } finally {
        setIsTranslating(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fields, enabled, delay]);

  return {
    translatedFields,
    isTranslating,
  };
}

export default useAutoTranslate;
import { useState, useCallback } from 'react';

/**
 * 双语表单输入模式
 */
export type InputMode = 'both' | 'zh' | 'en';

/**
 * 双语字段值
 */
export interface BilingualValue {
  zh: string;
  en: string;
}

/**
 * 双语表单状态管理Hook
 * 
 * 统一处理中英文双语输入逻辑，减少表单页面重复代码
 */
export function useBilingualForm(initialMode: InputMode = 'zh') {
  const [inputMode, setInputMode] = useState<InputMode>(initialMode);

  /**
   * 更新双语字段
   */
  const updateBilingualField = useCallback((
    fieldZh: string,
    fieldEn: string,
    value: string,
    setFormData: React.Dispatch<React.SetStateAction<any>>
  ) => {
    if (inputMode === 'both') {
      // 双语模式下需要分别处理，由组件自己处理
      return;
    } else if (inputMode === 'zh') {
      setFormData(prev => ({ ...prev, [fieldZh]: value }));
    } else {
      setFormData(prev => ({ ...prev, [fieldEn]: value }));
    }
  }, [inputMode]);

  /**
   * 获取当前输入模式下的字段名
   */
  const getActiveField = useCallback((fieldZh: string, fieldEn: string): string => {
    if (inputMode === 'zh') return fieldZh;
    if (inputMode === 'en') return fieldEn;
    return fieldZh; // both模式下返回中文字段
  }, [inputMode]);

  /**
   * 判断是否显示双语输入
   */
  const showBothInputs = inputMode === 'both';

  /**
   * 判断是否显示中文输入
   */
  const showZhInput = inputMode === 'both' || inputMode === 'zh';

  /**
   * 判断是否显示英文输入
   */
  const showEnInput = inputMode === 'both' || inputMode === 'en';

  return {
    inputMode,
    setInputMode,
    updateBilingualField,
    getActiveField,
    showBothInputs,
    showZhInput,
    showEnInput,
  };
}

export default useBilingualForm;
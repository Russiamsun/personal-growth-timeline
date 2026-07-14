import { useState, useCallback } from 'react';

/**
 * 通用表单验证Hook
 * 
 * 用于处理表单验证逻辑，减少重复代码
 */

export type ValidationRule = {
  required?: boolean;
  message: string;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => boolean;
};

export type ValidationRules = Record<string, ValidationRule>;

export type FormErrors = Record<string, string>;

interface UseFormValidationReturn {
  errors: FormErrors;
  validate: (values: Record<string, string>, rules: ValidationRules) => boolean;
  validateField: (field: string, value: string, rules: ValidationRules) => boolean;
  clearError: (field: string) => void;
  clearErrors: () => void;
  setErrors: (errors: FormErrors) => void;
}

/**
 * 表单验证Hook
 */
export function useFormValidation(): UseFormValidationReturn {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((field: string, value: string, rules: ValidationRules): boolean => {
    const rule = rules[field];
    if (!rule) return true;

    // 必填验证
    if (rule.required && !value.trim()) {
      setErrors(prev => ({ ...prev, [field]: rule.message }));
      return false;
    }

    // 正则验证
    if (rule.pattern && !rule.pattern.test(value)) {
      setErrors(prev => ({ ...prev, [field]: rule.message }));
      return false;
    }

    // 最小长度验证
    if (rule.minLength && value.length < rule.minLength) {
      setErrors(prev => ({ ...prev, [field]: rule.message }));
      return false;
    }

    // 最大长度验证
    if (rule.maxLength && value.length > rule.maxLength) {
      setErrors(prev => ({ ...prev, [field]: rule.message }));
      return false;
    }

    // 自定义验证
    if (rule.custom && !rule.custom(value)) {
      setErrors(prev => ({ ...prev, [field]: rule.message }));
      return false;
    }

    // 验证通过，清除错误
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    return true;
  }, []);

  const validate = useCallback((values: Record<string, string>, rules: ValidationRules): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = values[field] || '';

      // 必填验证
      if (rule.required && !value.trim()) {
        newErrors[field] = rule.message;
        isValid = false;
      }

      // 正则验证
      if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.message;
        isValid = false;
      }

      // 最小长度验证
      if (rule.minLength && value.length < rule.minLength) {
        newErrors[field] = rule.message;
        isValid = false;
      }

      // 最大长度验证
      if (rule.maxLength && value.length > rule.maxLength) {
        newErrors[field] = rule.message;
        isValid = false;
      }

      // 自定义验证
      if (rule.custom && value && !rule.custom(value)) {
        newErrors[field] = rule.message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    validateField,
    clearError,
    clearErrors,
    setErrors,
  };
}

export default useFormValidation;
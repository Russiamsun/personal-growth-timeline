import { createClient } from '@supabase/supabase-js';

// 从环境变量获取Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 检查是否已配置有效的Supabase（排除占位符）
export const isSupabaseConfigured = (): boolean => {
  // 检查是否为空字符串
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }
  
  // 检查是否为占位符URL（your-project-id）
  if (supabaseUrl.includes('your-project-id') || 
      supabaseUrl.includes('example.com') ||
      supabaseAnonKey.includes('your-') ||
      supabaseAnonKey.length < 50) {
    return false;
  }
  
  // 检查URL是否为有效的Supabase域名
  if (!supabaseUrl.includes('.supabase.co')) {
    return false;
  }
  
  return true;
};
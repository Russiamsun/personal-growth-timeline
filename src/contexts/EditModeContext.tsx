import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * 编辑模式上下文
 * 
 * 通过URL参数控制编辑权限：
 * - 正常访问：只读模式，隐藏所有编辑/删除按钮
 * - 编辑访问：?edit=emma2024 启用编辑模式
 * 
 * 使用场景：老师只能查看，Emma通过特殊URL进行编辑
 */

interface EditModeContextType {
  isEditMode: boolean;
  editKey: string | null;
  enterEditMode: (key: string) => boolean;
  exitEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

// 编辑密钥（可配置）
const EDIT_KEY = 'emma2024';

interface EditModeProviderProps {
  children: ReactNode;
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);

  useEffect(() => {
    // 检查URL参数
    const params = new URLSearchParams(window.location.search);
    const key = params.get('edit');
    
    if (key === EDIT_KEY) {
      setIsEditMode(true);
      setEditKey(key);
      
      // 清理URL中的edit参数，避免暴露密钥
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // 保存编辑状态到sessionStorage（仅当前会话有效）
      sessionStorage.setItem('editMode', 'true');
    } else {
      // 检查sessionStorage是否已开启编辑模式
      const savedEditMode = sessionStorage.getItem('editMode');
      if (savedEditMode === 'true') {
        setIsEditMode(true);
      }
    }
  }, []);

  const enterEditMode = (key: string): boolean => {
    if (key === EDIT_KEY) {
      setIsEditMode(true);
      setEditKey(key);
      sessionStorage.setItem('editMode', 'true');
      return true;
    }
    return false;
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setEditKey(null);
    sessionStorage.removeItem('editMode');
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, editKey, enterEditMode, exitEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = (): EditModeContextType => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};

export default EditModeContext;
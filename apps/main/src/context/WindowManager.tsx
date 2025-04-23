'use client'
import React, { createContext, useContext, useState } from 'react';
import DraggableWindow, { WindowContext } from '@/components/window/WindowComponent';

interface WindowInstance {
  id: string;
  title: string;
  width: string;
  height: string;
  context: WindowContext<React.ReactNode>;
  isFrameless: boolean;
  isModal?: boolean;
  isOnly?: boolean;
}

interface WindowManagerContextType {
  openWindow: (title: string, content: React.ReactNode, width?: string, height?: string, windowId?: string, isOnly?: boolean) => void;
  openModalWindow: (title: string, content: React.ReactNode, width?: string, height?: string, windowId?: string, isOnly?: boolean) => void;
  openFramelessWindow: (title: string, content: React.ReactNode, width?: string, height?: string, windowId?: string, isOnly?: boolean) => void;
  closeWindow: (id: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [windowInstancesId, setWindowInstancesId] = useState<string>();
  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(window => window.id !== id));
    setWindowInstancesId(undefined);
  };

  const openWindow = (
    title: string,
    content: React.ReactNode,
    width: string = '950px',
    height: string = '650px',
    windowId?: string,
    isOnly: boolean = true
  ) => {
    //只可打开一个窗口
    if (windowInstancesId && isOnly) {
      closeWindow(windowInstancesId);
    }
    const id = windowId || Math.random().toString(36).substr(2, 9);
    const windowInstance: WindowInstance = {
      id,
      title,
      width,
      height,
      isFrameless: false,
      context: {
        domContext: content,
        onClose: () => closeWindow(id),
      },
    };
    setWindows(prev => [...prev, windowInstance]);
    setWindowInstancesId(id);
    return id;
  };
  
  const openFramelessWindow = (
    title: string,
    content: React.ReactNode,
    width: string = '850px',
    height: string = '550px',
    windowId?: string,
    isOnly: boolean = true
  ) => {
    //只可打开一个窗口
    if (windowInstancesId && isOnly) {
      closeWindow(windowInstancesId);
    }
    const id = windowId || Math.random().toString(36).substr(2, 9);
    const windowInstance: WindowInstance = {
      id,
      title,
      width,
      height,
      isFrameless: true,
      context: {
        domContext: content,
        onClose: () => closeWindow(id),
      },
    };
    setWindows(prev => [...prev, windowInstance]);
    setWindowInstancesId(id);
    return id;
  };

  const openModalWindow = (
    title: string,
    content: React.ReactNode,
    width: string = '850px',
    height: string = '550px',
    windowId?: string,
    isOnly: boolean = false
  ) => {
    //只可打开一个窗口
    if (isOnly && windowInstancesId) {
      closeWindow(windowInstancesId);
    }
    const id = windowId || Math.random().toString(36).substr(2, 9);
    const windowInstance: WindowInstance = {
      id,
      title,
      width,
      height,
      isFrameless: false,
      isModal: true,
      context: {
        domContext: content,
        onClose: () => closeWindow(id),
      },
    };
    setWindowInstancesId(id);
    setWindows(prev => [...prev, windowInstance]);
    return id;
  }

  return (
    <WindowManagerContext.Provider value={{ openWindow, openModalWindow, openFramelessWindow, closeWindow }}>
      {children}
      {windows.map(window => (
        <DraggableWindow
          id={window.id}
          title={window.title}
          width={window.width}
          height={window.height}
          isFrameless={window.isFrameless}
          isModal={window.isModal}
          windowContext={window.context}
        />
      ))}
    </WindowManagerContext.Provider>
  );
};

// 创建自定义Hook来使用WindowManager
export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};

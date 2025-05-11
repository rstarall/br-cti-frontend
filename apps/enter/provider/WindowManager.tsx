'use client'
import React, { createContext, useContext, useState } from 'react';
import DraggableWindow, { WindowContext, DragHandlers } from '@/components/window/WindowComponent';

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
  openWindow: (title: string, content: React.ReactNode, width?: string, height?: string, windowId?: string, isOnly?: boolean) => string;
  openModalWindow: (title: string, content: React.ReactNode, width?: string, height?: string, windowId?: string, isOnly?: boolean) => string;
  openFramelessWindow: (title: string, content: React.ReactNode, width?: string, height?: string, windowId?: string, isOnly?: boolean) => string;
  closeWindow: (id: string) => void;
  getWindowDragHandlers: (windowId: string) => DragHandlers | undefined;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [windowInstancesId, setWindowInstancesId] = useState<string>();

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(window => window.id !== id));
    setWindowInstancesId(undefined);
  };

  // 创建拖拽处理函数
  const createDragHandlers = (): DragHandlers => {
    return {
      onMouseDown: (_: React.MouseEvent) => {
        // 这里只是一个占位函数，实际的拖拽逻辑在 WindowComponent 中实现
      },
      onMouseMove: (_: React.MouseEvent) => {
        // 这里只是一个占位函数，实际的拖拽逻辑在 WindowComponent 中实现
      },
      onMouseUp: () => {
        // 这里只是一个占位函数，实际的拖拽逻辑在 WindowComponent 中实现
      }
    };
  };

  // 获取指定窗口的拖拽处理函数
  const getWindowDragHandlers = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    return window?.context.dragHandlers;
  };

  // 更新窗口大小
  const updateWindowSize = (id: string, width: number, height: number) => {
    setWindows(prev =>
      prev.map(window =>
        window.id === id
          ? { ...window, width: `${width}px`, height: `${height}px` }
          : window
      )
    );
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
    const id = windowId || Math.random().toString(36).substring(2, 9);
    const windowInstance: WindowInstance = {
      id,
      title,
      width,
      height,
      isFrameless: false,
      context: {
        domContext: content,
        onClose: () => closeWindow(id),
        dragHandlers: createDragHandlers(),
        onResize: (width, height) => updateWindowSize(id, width, height),
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
    const id = windowId || Math.random().toString(36).substring(2, 9);

    // 如果内容是一个 React 组件，并且需要 windowId 属性，则传递 windowId
    let domContent = content;
    if (React.isValidElement(content) && 'windowId' in (content.props || {})) {
      domContent = React.cloneElement(content as React.ReactElement<any>, { windowId: id });
    }

    const windowInstance: WindowInstance = {
      id,
      title,
      width,
      height,
      isFrameless: true,
      context: {
        domContext: domContent,
        onClose: () => closeWindow(id),
        dragHandlers: createDragHandlers(),
        onResize: (width, height) => updateWindowSize(id, width, height),
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
    const id = windowId || Math.random().toString(36).substring(2, 9);
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
        dragHandlers: createDragHandlers(),
        onResize: (width, height) => updateWindowSize(id, width, height),
      },
    };
    setWindowInstancesId(id);
    setWindows(prev => [...prev, windowInstance]);
    return id;
  }

  return (
    <WindowManagerContext.Provider value={{ openWindow, openModalWindow, openFramelessWindow, closeWindow, getWindowDragHandlers }}>
      {children}
      {windows.map(window => (
        <DraggableWindow
          key={window.id}
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

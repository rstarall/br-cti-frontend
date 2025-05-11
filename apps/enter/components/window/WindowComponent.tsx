'use client'
import React, { useState, useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
// 定义一个抽象的泛型 WindowContext
export interface DragHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export interface WindowContext<T> {
  domContext: T;
  onClose: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (width: number, height: number) => void;
  dragHandlers?: DragHandlers; // 添加拖拽处理函数
  // 你可以根据需要添加更多的方法或属性
}

// 修改 DraggableWindow 组件以接受 WindowContext 作为参数
export interface DraggableWindowProps<T> {
  id: string;
  title: string;
  width: string;
  height: string;
  isFrameless?: boolean | false;
  isModal?: boolean | false;
  windowContext: WindowContext<T>;
}

// 定义调整大小的方向
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

const DraggableWindow = <T,>({ title, width, height, isFrameless, isModal, windowContext }: DraggableWindowProps<T>) => {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - parseInt(width) / 2,
    y: window.innerHeight / 2 - parseInt(height) / 2 });
  const [size, setSize] = useState({
    width: parseInt(width),
    height: parseInt(height)
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // 添加ESC按键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        windowContext.onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [windowContext]);

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      setPosition({ x: newX, y: newY });
      if (windowContext.onMove) {
        windowContext.onMove(newX, newY);
      }
    } else if (isResizing && resizeDirection) {
      handleResizeMouseMove(e);
    } else {
      // 检测鼠标是否在窗口边缘，设置相应的鼠标样式
      const direction = getResizeDirection(e);
      if (windowRef.current) {
        windowRef.current.style.cursor = getResizeCursor(direction);
      }
    }
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 检测鼠标是否在窗口边缘，用于调整大小
  const getResizeDirection = (e: React.MouseEvent): ResizeDirection => {
    if (!windowRef.current) return null;

    const rect = windowRef.current.getBoundingClientRect();
    const edgeThreshold = 8; // 边缘检测的阈值（像素）

    // 不检测上边界
    // const isNorth = e.clientY >= rect.top && e.clientY <= rect.top + edgeThreshold;
    const isSouth = e.clientY >= rect.bottom - edgeThreshold && e.clientY <= rect.bottom;
    const isEast = e.clientX >= rect.right - edgeThreshold && e.clientX <= rect.right;
    const isWest = e.clientX >= rect.left && e.clientX <= rect.left + edgeThreshold;

    // 不返回与上边界相关的方向
    // if (isNorth && isEast) return 'ne';
    // if (isNorth && isWest) return 'nw';
    if (isSouth && isEast) return 'se';
    if (isSouth && isWest) return 'sw';
    // if (isNorth) return 'n';
    if (isSouth) return 's';
    if (isEast) return 'e';
    if (isWest) return 'w';

    return null;
  };

  // 根据调整方向设置鼠标样式
  const getResizeCursor = (direction: ResizeDirection): string => {
    switch (direction) {
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      case 'nw':
      case 'se':
        return 'nwse-resize';
      default:
        return 'default';
    }
  };

  // 处理鼠标移动事件，用于调整窗口大小
  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!isResizing || !resizeDirection) return;

    e.preventDefault();

    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    let newWidth = size.width;
    let newHeight = size.height;
    let newX = position.x;
    let newY = position.y;

    // 根据调整方向计算新的尺寸和位置
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(200, e.clientX - position.x); // 最小宽度为200px
    }
    if (resizeDirection.includes('w')) {
      const deltaX = position.x - e.clientX;
      newWidth = Math.max(200, size.width + deltaX);
      if (newWidth !== size.width) {
        newX = e.clientX;
      }
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(150, e.clientY - position.y); // 最小高度为150px
    }
    // 不处理上边界的调整
    // if (resizeDirection.includes('n')) {
    //   const deltaY = position.y - e.clientY;
    //   newHeight = Math.max(150, size.height + deltaY);
    //   if (newHeight !== size.height) {
    //     newY = e.clientY;
    //   }
    // }

    // 更新窗口尺寸和位置
    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });

    // 如果有onResize回调，则调用
    if (windowContext.onResize) {
      windowContext.onResize(newWidth, newHeight);
    }
  };

  // 处理鼠标按下事件，用于开始调整窗口大小
  const handleResizeMouseDown = (e: React.MouseEvent, direction: ResizeDirection) => {
    if (direction) {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeDirection(direction);
    }
  };
  // 将拖拽处理函数赋值给 windowContext.dragHandlers
  useEffect(() => {
    if (windowContext && typeof windowContext === 'object') {
      windowContext.dragHandlers = {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp
      };
    }
  }, [windowContext, handleMouseDown, handleMouseMove, handleMouseUp]);

  // 添加全局鼠标事件监听，用于处理拖拽和调整大小
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging || isResizing) {
        const mouseEvent = e as unknown as React.MouseEvent;
        if (isDragging) {
          const newX = e.clientX - offset.x;
          const newY = e.clientY - offset.y;
          setPosition({ x: newX, y: newY });
          if (windowContext.onMove) {
            windowContext.onMove(newX, newY);
          }
        } else if (isResizing && resizeDirection) {
          handleResizeMouseMove(mouseEvent);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, offset, resizeDirection, windowContext]);

  return (
    <div className={`${isModal ? 'fixed inset-0 z-[999] bg-gray-500 bg-opacity-50' : ''}`}>
      <div
        ref={windowRef}
        className={`fixed rounded-sm shadow-xl z-[999] ${isFrameless ? 'bg-transparent' : 'bg-white'}`}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          padding: isFrameless ? 0 : undefined,
          margin: isFrameless ? 0 : undefined,
          overflow: 'hidden',
          position: 'fixed'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={(e) => {
          const direction = getResizeDirection(e);
          if (direction) {
            handleResizeMouseDown(e, direction);
          }
        }}
      >
        <div
          style={{
            display: isFrameless ? 'none' : 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: '40px',
          }}
          className="bg-gray-100 text-gray-800 px-4 text-[14px] cursor-move justify-between items-center rounded-t-lg shadow-sm border-b border-gray-200"
          onMouseDown={handleMouseDown}
        >
          <span className="font-medium">{title}</span>
          <button
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            onClick={windowContext.onClose}
          >
            <CloseOutlined />
          </button>
        </div>
        <div
          className={`${isFrameless ? 'bg-transparent p-0' : 'bg-white p-2'} ${isFrameless ? '' : 'mt-[40px]'}`}
          style={{
            height: isFrameless ? '100%' : `calc(100% - 40px)`,
            width: '100%',
            overscrollBehavior: 'contain', // 阻止父级滚动
            overflow: 'auto', // 允许内容超出
            scrollbarWidth: 'none', // 隐藏滚动条（Firefox）
            msOverflowStyle: 'none', // 隐藏滚动条（IE/Edge）
          }}
          onWheel={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
          }}
        >
          <style>{`
            ::-webkit-scrollbar {
              display: none; /* 隐藏滚动条（Chrome/Safari）*/
            }
          `}</style>
          {isFrameless ? (
            <div className="w-full h-full">
              {windowContext.domContext as React.ReactNode}
            </div>
          ) : (
            <div className="p-2">
              {windowContext.domContext as React.ReactNode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraggableWindow;

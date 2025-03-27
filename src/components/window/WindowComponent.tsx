import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
// 定义一个抽象的泛型 WindowContext
export interface WindowContext<T> {
  domContext: T;
  onClose: () => void;
  onMove?: (x: number, y: number) => void;
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

const DraggableWindow = <T,>({ id, title, width, height, isFrameless, isModal, windowContext }: DraggableWindowProps<T>) => {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - parseInt(width) / 2, 
    y: window.innerHeight / 2 - parseInt(height) / 2 });
  const [windowId, setWindowId] = useState(id);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      setPosition({ x: newX, y: newY });
      if (windowContext.onMove) {
        windowContext.onMove(newX, newY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`${isModal ? 'fixed inset-0 z-1000 bg-gray-500' : ''}`}>
      <div
          className="fixed rounded-sm shadow-xl z-1000 bg-white"
          style={{
          width,
          height,
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          style={{
            display: isFrameless ? 'none' : 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1001,
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
          className={`bg-white p-2 ${isFrameless ? '' : 'mt-[40px]'}`}
          style={{
            height: isFrameless ? '100%' : `calc(100% - 40px)`,
            overscrollBehavior: 'contain', // 阻止父级滚动
            overflow: 'auto', // 允许内容超出
            scrollbarWidth: 'none', // 隐藏滚动条（Firefox）
            msOverflowStyle: 'none' // 隐藏滚动条（IE/Edge）
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
          {typeof windowContext.domContext === 'string' ? (
            windowContext.domContext as React.ReactNode
          ) : (
            windowContext.domContext as React.ReactNode
          )}
        </div>
      </div>
    </div>
  );
};

export default DraggableWindow;

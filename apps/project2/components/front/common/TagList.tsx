import React from 'react';

interface TagListProps {
  tags: string[];
  onClick?: (tag: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
}

export function TagList({ 
  tags, 
  onClick, 
  className = '', 
  size = 'md',
  color = 'blue'
}: TagListProps) {
  // 根据大小设置样式
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  // 根据颜色设置样式
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    gray: 'bg-gray-50 text-gray-700'
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`inline-flex items-center rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${onClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
          onClick={() => onClick && onClick(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

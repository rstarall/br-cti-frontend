import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = '搜索...', className = '' }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  
  const handleSearch = () => {
    onSearch(keyword);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className={`flex w-full ${className}`}>
      <input
        type="text"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="primary"
        className="rounded-l-none"
        onClick={handleSearch}
      >
        搜索
      </Button>
    </div>
  );
}

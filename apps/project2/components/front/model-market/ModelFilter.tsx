import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/front/common/SearchBar';

interface ModelFilterProps {
  onFilter: (type: number, incentiveMechanism: number, keyword: string) => void;
  className?: string;
}

export function ModelFilter({ onFilter, className = '' }: ModelFilterProps) {
  const [selectedType, setSelectedType] = useState(-1);
  const [selectedIncentiveMechanism, setSelectedIncentiveMechanism] = useState(-1);
  const [keyword, setKeyword] = useState('');

  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
    onFilter(selectedType, selectedIncentiveMechanism, searchKeyword);
  };

  const handleTypeChange = (type: number) => {
    setSelectedType(type);
    onFilter(type, selectedIncentiveMechanism, keyword);
  };

  const handleIncentiveMechanismChange = (mechanism: number) => {
    setSelectedIncentiveMechanism(mechanism);
    onFilter(selectedType, mechanism, keyword);
  };

  const handleReset = () => {
    setSelectedType(-1);
    setSelectedIncentiveMechanism(-1);
    setKeyword('');
    onFilter(-1, -1, '');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <SearchBar
        onSearch={handleSearch}
        placeholder="搜索模型名称、描述或标签..."
      />

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">模型类型</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="全部"
            isActive={selectedType === -1}
            onClick={() => handleTypeChange(-1)}
          />
          <FilterButton
            label="B&R检测"
            isActive={selectedType === 1}
            onClick={() => handleTypeChange(1)}
          />
          <FilterButton
            label="正则优化"
            isActive={selectedType === 2}
            onClick={() => handleTypeChange(2)}
          />
          <FilterButton
            label="漏洞分析"
            isActive={selectedType === 3}
            onClick={() => handleTypeChange(3)}
          />
          <FilterButton
            label="防御策略"
            isActive={selectedType === 4}
            onClick={() => handleTypeChange(4)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">激励机制</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="全部"
            isActive={selectedIncentiveMechanism === -1}
            onClick={() => handleIncentiveMechanismChange(-1)}
          />
          <FilterButton
            label="积分激励"
            isActive={selectedIncentiveMechanism === 1}
            onClick={() => handleIncentiveMechanismChange(1)}
          />
          <FilterButton
            label="三方博弈"
            isActive={selectedIncentiveMechanism === 2}
            onClick={() => handleIncentiveMechanismChange(2)}
          />
          <FilterButton
            label="演化博弈"
            isActive={selectedIncentiveMechanism === 3}
            onClick={() => handleIncentiveMechanismChange(3)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleReset}
        >
          重置筛选
        </Button>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm font-medium ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

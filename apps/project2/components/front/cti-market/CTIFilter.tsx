import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/front/common/SearchBar';

interface CTIFilterProps {
  onFilter: (type: number, trafficType: number, incentiveMechanism: number, keyword: string) => void;
  className?: string;
}

export function CTIFilter({ onFilter, className = '' }: CTIFilterProps) {
  const [selectedType, setSelectedType] = useState(-1);
  const [selectedTrafficType, setSelectedTrafficType] = useState(-1);
  const [selectedIncentiveMechanism, setSelectedIncentiveMechanism] = useState(-1);
  const [keyword, setKeyword] = useState('');

  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
    onFilter(selectedType, selectedTrafficType, selectedIncentiveMechanism, searchKeyword);
  };

  const handleTypeChange = (type: number) => {
    setSelectedType(type);
    onFilter(type, selectedTrafficType, selectedIncentiveMechanism, keyword);
  };

  const handleTrafficTypeChange = (trafficType: number) => {
    setSelectedTrafficType(trafficType);
    onFilter(selectedType, trafficType, selectedIncentiveMechanism, keyword);
  };

  const handleIncentiveMechanismChange = (mechanism: number) => {
    setSelectedIncentiveMechanism(mechanism);
    onFilter(selectedType, selectedTrafficType, mechanism, keyword);
  };

  const handleReset = () => {
    setSelectedType(-1);
    setSelectedTrafficType(-1);
    setSelectedIncentiveMechanism(-1);
    setKeyword('');
    onFilter(-1, -1, -1, '');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <SearchBar
        onSearch={handleSearch}
        placeholder="搜索情报名称、描述或标签..."
      />

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">情报类型</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="全部"
            isActive={selectedType === -1}
            onClick={() => handleTypeChange(-1)}
          />
          <FilterButton
            label="恶意流量"
            isActive={selectedType === 1}
            onClick={() => handleTypeChange(1)}
          />
          <FilterButton
            label="蜜罐情报"
            isActive={selectedType === 2}
            onClick={() => handleTypeChange(2)}
          />
          <FilterButton
            label="僵尸网络"
            isActive={selectedType === 3}
            onClick={() => handleTypeChange(3)}
          />
          <FilterButton
            label="应用层攻击"
            isActive={selectedType === 4}
            onClick={() => handleTypeChange(4)}
          />
          <FilterButton
            label="开源情报"
            isActive={selectedType === 5}
            onClick={() => handleTypeChange(5)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">流量类型</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="全部"
            isActive={selectedTrafficType === -1}
            onClick={() => handleTrafficTypeChange(-1)}
          />
          <FilterButton
            label="5G"
            isActive={selectedTrafficType === 1}
            onClick={() => handleTrafficTypeChange(1)}
          />
          <FilterButton
            label="卫星网络"
            isActive={selectedTrafficType === 2}
            onClick={() => handleTrafficTypeChange(2)}
          />
          <FilterButton
            label="SDN"
            isActive={selectedTrafficType === 3}
            onClick={() => handleTrafficTypeChange(3)}
          />
          <FilterButton
            label="非流量"
            isActive={selectedTrafficType === 4}
            onClick={() => handleTrafficTypeChange(4)}
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

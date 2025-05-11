import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBlockchainStore } from '@/store/blockchainStore';

export function BlockchainSearch() {
  const { searchBlockchain, isLoading } = useBlockchainStore();
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) {
      alert('请输入搜索关键词');
      return;
    }
    
    setHasSearched(true);
    const result = await searchBlockchain(query);
    setSearchResult(result);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const renderSearchResult = () => {
    if (!searchResult) return null;
    
    switch (searchResult.type) {
      case 'block':
        return renderBlockResult(searchResult.data);
      case 'transaction':
        return renderTransactionResult(searchResult.data);
      case 'address':
        return renderAddressResult(searchResult.data);
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">未找到结果</h3>
            <p className="text-gray-600 text-center">
              没有找到与 "{query}" 相关的区块链信息，请尝试其他关键词
            </p>
          </div>
        );
    }
  };
  
  const renderBlockResult = (block: any) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">区块信息</h3>
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-24">区块高度:</span>
            <span>{block.height}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">区块哈希:</span>
            <span className="break-all">{block.hash}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">时间戳:</span>
            <span>{new Date(block.timestamp).toLocaleString()}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">交易数量:</span>
            <span>{block.transactions}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">区块大小:</span>
            <span>{block.size} bytes</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">矿工:</span>
            <span>{block.miner}</span>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTransactionResult = (tx: any) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">交易信息</h3>
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-24">交易ID:</span>
            <span className="break-all">{tx.txid}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">发送方:</span>
            <span>{tx.from}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">接收方:</span>
            <span>{tx.to}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">金额:</span>
            <span>{tx.amount} 积分</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">时间戳:</span>
            <span>{new Date(tx.timestamp).toLocaleString()}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">状态:</span>
            <span className={tx.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}>
              {tx.status === 'confirmed' ? '已确认' : '待确认'}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">类型:</span>
            <span>{tx.type}</span>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAddressResult = (address: any) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">地址信息</h3>
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-24">地址:</span>
            <span className="break-all">{address.address}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">余额:</span>
            <span>{address.balance} 积分</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">交易数量:</span>
            <span>{address.transactions}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">首次交易:</span>
            <span>{new Date(address.firstSeen).toLocaleString()}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">最后交易:</span>
            <span>{new Date(address.lastSeen).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="输入区块高度、交易哈希或钱包地址进行搜索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="primary"
          onClick={handleSearch}
          isLoading={isLoading}
        >
          搜索
        </Button>
      </div>
      
      {hasSearched && (
        isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          renderSearchResult()
        )
      )}
    </div>
  );
}

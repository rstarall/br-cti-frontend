import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Block {
  height: number;
  hash: string;
  timestamp: string;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
}

export function BlockchainExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'block' | 'transaction' | 'address'>('block');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample data for demonstration
  const sampleBlocks: Record<string, Block> = {
    '1000': {
      height: 1000,
      hash: '0x8f5b85b4a5dd21a15c8e5b55c76b155d8e8a4c2d',
      timestamp: '2023-05-15T14:30:45Z',
      transactions: [
        {
          id: '0x1a2b3c4d5e6f',
          from: '0xabcd1234',
          to: '0xefgh5678',
          amount: 100,
          timestamp: '2023-05-15T14:29:30Z'
        },
        {
          id: '0x7a8b9c0d1e2f',
          from: '0xijkl9012',
          to: '0xmnop3456',
          amount: 50,
          timestamp: '2023-05-15T14:30:15Z'
        }
      ]
    }
  };
  
  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (searchType === 'block' && searchTerm in sampleBlocks) {
        setSearchResults(sampleBlocks[searchTerm]);
      } else {
        setSearchResults(null);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>区块链浏览器</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                name="searchType" 
                value="block" 
                checked={searchType === 'block'}
                onChange={() => setSearchType('block')}
                className="h-4 w-4 text-primary-600"
              />
              <span>区块</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                name="searchType" 
                value="transaction" 
                checked={searchType === 'transaction'}
                onChange={() => setSearchType('transaction')}
                className="h-4 w-4 text-primary-600"
              />
              <span>交易</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                name="searchType" 
                value="address" 
                checked={searchType === 'address'}
                onChange={() => setSearchType('address')}
                className="h-4 w-4 text-primary-600"
              />
              <span>地址</span>
            </label>
          </div>
          
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`输入${searchType === 'block' ? '区块高度' : searchType === 'transaction' ? '交易哈希' : '钱包地址'}`}
              className="flex-1 p-2 border rounded"
            />
            <Button 
              variant="primary" 
              onClick={handleSearch}
              isLoading={isLoading}
            >
              搜索
            </Button>
          </div>
        </div>
        
        {searchResults ? (
          <div className="border rounded-md p-4">
            {searchType === 'block' && (
              <BlockDetails block={searchResults as Block} />
            )}
            {/* Add other result types as needed */}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isLoading ? '搜索中...' : searchTerm ? '未找到结果' : '输入搜索条件开始查询'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BlockDetailsProps {
  block: Block;
}

function BlockDetails({ block }: BlockDetailsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">区块 #{block.height}</h3>
      <div className="space-y-2 mb-4">
        <div className="flex">
          <span className="font-medium w-24">哈希:</span>
          <span className="text-primary-600">{block.hash}</span>
        </div>
        <div className="flex">
          <span className="font-medium w-24">时间戳:</span>
          <span>{new Date(block.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex">
          <span className="font-medium w-24">交易数量:</span>
          <span>{block.transactions.length}</span>
        </div>
      </div>
      
      <h4 className="text-md font-semibold mb-2">交易列表</h4>
      <div className="space-y-4">
        {block.transactions.map((tx) => (
          <div key={tx.id} className="border-t pt-2">
            <div className="flex">
              <span className="font-medium w-24">交易ID:</span>
              <span className="text-primary-600">{tx.id}</span>
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
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TagList } from '@/components/front/common/TagList';
import { useKnowledgePlaneStore } from '@/store/knowledgePlaneStore';

export function IOCSearch() {
  const { searchIOC, isLoading } = useKnowledgePlaneStore();
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('请输入搜索关键词');
      return;
    }
    
    setHasSearched(true);
    const result = await searchIOC(keyword);
    setSearchResult(result);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IOC搜索</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="输入IP、域名、URL、Hash等进行搜索..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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
            ) : searchResult && searchResult.found ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{searchResult.data.ioc}</h3>
                    <div className="text-sm text-gray-500">类型: {searchResult.type}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    searchResult.data.malicious 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {searchResult.data.malicious ? '恶意' : '安全'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">首次发现</div>
                    <div>{new Date(searchResult.data.firstSeen).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">最后更新</div>
                    <div>{new Date(searchResult.data.lastSeen).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">置信度</div>
                    <div>{searchResult.data.confidence}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">标签</div>
                    <TagList tags={searchResult.data.tags} size="sm" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">相关IOC</h4>
                  <div className="space-y-2">
                    {searchResult.data.relatedIOCs.map((ioc: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="font-medium">{ioc.ioc}</div>
                          <div className="text-sm text-gray-500">类型: {ioc.type}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {ioc.relation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">未找到结果</h3>
                <p className="text-gray-600 text-center">
                  没有找到与 "{keyword}" 相关的IOC信息，请尝试其他关键词
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

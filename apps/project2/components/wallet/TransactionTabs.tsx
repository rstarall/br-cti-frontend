import React, { useEffect, useRef } from 'react';
import { Tabs, Empty, Spin, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SwapOutlined } from '@ant-design/icons';
import { useWalletStore } from '@/store/walletStore';

export function TransactionTabs() {
  const { transactions, isLoading } = useWalletStore();
  const incomeListRef = useRef<HTMLDivElement>(null);
  const expenseListRef = useRef<HTMLDivElement>(null);
  const allTransactionsListRef = useRef<HTMLDivElement>(null);

  // 按时间降序排序交易记录（最新的排在前面）
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateB - dateA; // 降序排列
  });

  // 按类型过滤交易记录
  const incomeTransactions = sortedTransactions.filter(t => t.transaction_type === 'in');
  const expenseTransactions = sortedTransactions.filter(t => t.transaction_type === 'out');

  // 阻止滚动事件冒泡，防止父容器滚动
  useEffect(() => {
    // 处理滚轮事件
    const handleWheel = (e: WheelEvent) => {
      const target = e.currentTarget as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      // 检查是否已经到达滚动边界
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // 如果在边界处继续滚动，则阻止事件传播
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
      }

      // 始终阻止事件冒泡，确保不会触发父容器的滚动
      e.stopPropagation();
    };

    // 处理触摸开始事件
    let startY = 0;
    let startX = 0;
    let currentTarget: HTMLElement | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        currentTarget = e.currentTarget as HTMLElement;
      }
    };

    // 处理触摸移动事件
    const handleTouchMove = (e: TouchEvent) => {
      if (!currentTarget || e.touches.length !== 1) return;

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = startY - touchY;
      const deltaX = startX - touchX;

      // 如果垂直滚动大于水平滚动，则处理垂直滚动
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        const { scrollTop, scrollHeight, clientHeight } = currentTarget;
        const isScrollingUp = deltaY < 0;
        const isScrollingDown = deltaY > 0;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        // 如果在边界处继续滚动，则阻止默认行为
        if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
          e.preventDefault();
        }
      }

      // 阻止事件冒泡，确保不会触发父容器的滚动
      e.stopPropagation();
    };

    // 处理触摸结束事件
    const handleTouchEnd = (e: TouchEvent) => {
      currentTarget = null;
      e.stopPropagation();
    };

    // 为每个交易列表添加事件监听器
    const refs = [incomeListRef.current, expenseListRef.current, allTransactionsListRef.current];

    refs.forEach(ref => {
      if (ref) {
        // 添加滚轮事件监听器
        ref.addEventListener('wheel', handleWheel, { passive: false });

        // 添加触摸事件监听器
        ref.addEventListener('touchstart', handleTouchStart, { passive: true });
        ref.addEventListener('touchmove', handleTouchMove, { passive: false });
        ref.addEventListener('touchend', handleTouchEnd, { passive: true });

        // 设置CSS属性以防止滚动传播
        ref.style.overscrollBehavior = 'contain';
      }
    });

    // 添加全局触摸事件处理，防止在滚动列表时触发页面滚动
    const preventBodyScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // 检查触摸目标是否在我们的滚动容器内
      if (refs.some(ref => ref && ref.contains(target))) {
        // 阻止文档滚动
        document.body.style.overflow = 'hidden';
      } else {
        // 恢复文档滚动
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('touchstart', preventBodyScroll, { passive: true });

    // 清理函数
    return () => {
      refs.forEach(ref => {
        if (ref) {
          ref.removeEventListener('wheel', handleWheel);
          ref.removeEventListener('touchstart', handleTouchStart);
          ref.removeEventListener('touchmove', handleTouchMove);
          ref.removeEventListener('touchend', handleTouchEnd);
        }
      });

      document.removeEventListener('touchstart', preventBodyScroll);
      document.body.style.overflow = ''; // 恢复文档滚动
    };
  }, []);

  // 不需要排序和过滤控件

  const items = [
    {
      key: 'income',
      label: (
        <span className="flex items-center">
          <ArrowUpOutlined className="mr-1" />
          积分收入
        </span>
      ),
      children: (
        <div
          ref={incomeListRef}
          className="flex flex-col space-y-2  h-[240px] pb-[20px] overflow-y-auto pr-1 cursor-default"
          style={{
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch' as any,
            position: 'relative',
            zIndex: 10
          }}
        >
          {incomeTransactions.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无收入记录"
              className="py-8"
            />
          ) : (
            incomeTransactions.map((transaction) => (
              <IncomeItem key={transaction.transaction_id} transaction={transaction} />
            ))
          )}
        </div>
      ),
    },
    {
      key: 'expense',
      label: (
        <span className="flex items-center">
          <ArrowDownOutlined className="mr-1" />
          积分支出
        </span>
      ),
      children: (
        <div
          ref={expenseListRef}
          className="flex flex-col space-y-2  h-[240px] pb-[20px] overflow-y-auto pr-1 cursor-default"
          style={{
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch' as any,
            position: 'relative',
            zIndex: 10
          }}
        >
          {expenseTransactions.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无支出记录"
              className="py-8"
            />
          ) : (
            expenseTransactions.map((transaction) => (
              <ExpenseItem key={transaction.transaction_id} transaction={transaction} />
            ))
          )}
        </div>
      ),
    },
    {
      key: 'transactions',
      label: (
        <span className="flex items-center">
          <SwapOutlined className="mr-1" />
          交易记录
        </span>
      ),
      children: (
        <div
          ref={allTransactionsListRef}
          className="flex flex-col space-y-2  h-[240px] pb-[20px] overflow-y-auto pr-1 cursor-default"
          style={{
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch' as any,
            position: 'relative',
            zIndex: 10
          }}
        >
          {transactions.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无交易记录"
              className="py-8"
            />
          ) : (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.transaction_id} transaction={transaction} />
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="transaction-tabs-container" style={{ isolation: 'isolate' }}>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" tip="加载交易记录中..." />
        </div>
      ) : (
        <Tabs
          defaultActiveKey="transactions"
          items={items}
          className="w-full"
          tabBarStyle={{ marginBottom: 16 }}
        />
      )}
    </div>
  );
}

// Use the store's Transaction type
interface Transaction {
  transaction_id: string;
  transaction_type: string; // Changed from 'in' | 'out' to string to match store type
  points: number;
  other_party: string;
  info_id: string;
  timestamp: string;
  status: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

function IncomeItem({ transaction }: TransactionItemProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-blue-50 transition-colors rounded-lg mb-2 shadow-sm">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 text-left max-w-[50%]">
          <Tooltip title={`转入账户: ${transaction.other_party}`}>
            <div className="text-gray-800 font-medium truncate">转入账户: {transaction.other_party}</div>
          </Tooltip>
          <Tooltip title={`情报ID: ${transaction.info_id}`}>
            <div className="text-blue-600 text-sm truncate">情报ID: {transaction.info_id}</div>
          </Tooltip>
          <div className="text-gray-400 text-xs mt-1">{transaction.timestamp}</div>
        </div>
      </div>
      <div className="text-green-600 font-bold text-lg whitespace-nowrap">
        +{transaction.points} <span className="text-sm">积分</span>
      </div>
    </div>
  );
}

function ExpenseItem({ transaction }: TransactionItemProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-red-50 transition-colors rounded-lg mb-2 shadow-sm">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 text-left max-w-[50%]">
          <Tooltip title={`转出账户: ${transaction.other_party}`}>
            <div className="text-gray-800 font-medium truncate">转出账户: {transaction.other_party}</div>
          </Tooltip>
          <Tooltip title={`情报ID: ${transaction.info_id}`}>
            <div className="text-blue-600 text-sm truncate">情报ID: {transaction.info_id}</div>
          </Tooltip>
          <div className="text-gray-400 text-xs mt-1">{transaction.timestamp}</div>
        </div>
      </div>
      <div className="text-red-600 font-bold text-lg whitespace-nowrap">
        -{Math.abs(transaction.points)} <span className="text-sm">积分</span>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.transaction_type === 'in';

  return (
    <div className="flex flex-col p-4 border-b hover:bg-gray-50 transition-colors rounded-lg mb-2 shadow-sm">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-3 shadow-inner`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isIncome ? 'text-green-600' : 'text-red-600'}`} viewBox="0 0 20 20" fill="currentColor">
            {isIncome ? (
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            )}
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-gray-800 font-medium">
            {isIncome ? '转入' : '转出'}
          </div>
          <Tooltip title={`对方账户: ${transaction.other_party}`}>
            <div className="text-sm text-gray-700 truncate max-w-[200px]">对方账户: {transaction.other_party}</div>
          </Tooltip>
        </div>
      </div>

      <div className="mt-2">
        <Tooltip title={`交易哈希: ${transaction.transaction_id}`}>
          <div className="text-sm text-blue-600 truncate">交易哈希: {transaction.transaction_id}</div>
        </Tooltip>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="text-gray-400 text-xs">{transaction.timestamp}</div>
        <div className="flex items-center">
         <div className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
            {isIncome ? '+' : '-'}{Math.abs(transaction.points)} <span className="text-sm">积分</span>
          </div>
          <div className={`px-2 py-1 text-xs rounded-full font-medium ml-2 ${
            transaction.status === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {transaction.status === 'success' ? '已完成' : '失败'}
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';

export function Statistics() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 设置滚动监听
    const handleScroll = () => {
      const element = document.getElementById('statistics-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
        setIsVisible(isInViewport);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="statistics-section" className="py-16 bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">平台数据</h2>
          <div className="mt-2 h-1 w-20 bg-white mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem
            value="12,486"
            label="已拦截攻击"
            isVisible={isVisible}
            delay={0}
          />

          <StatItem
            value="24,892"
            label="情报总量"
            isVisible={isVisible}
            delay={200}
          />

          <StatItem
            value="1,248"
            label="已发现风险"
            isVisible={isVisible}
            delay={400}
          />

          <StatItem
            value="128"
            label="防御规则"
            isVisible={isVisible}
            delay={600}
          />
        </div>
      </div>
    </section>
  );
}

interface StatItemProps {
  value: string;
  label: string;
  isVisible: boolean;
  delay: number;
}

function StatItem({ value, label, isVisible, delay }: StatItemProps) {
  return (
    <div
      className={`text-center transition-all duration-1000 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl md:text-5xl font-bold mb-2">{value}</div>
      <div className="text-lg text-primary-100">{label}</div>
    </div>
  );
}

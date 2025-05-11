import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, icon, className = '' }: StatCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center">
          {icon && (
            <div className="mr-4 text-primary-600">
              {icon}
            </div>
          )}
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-500">{title}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

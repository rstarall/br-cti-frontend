'use client';
import Chat from '@/components/Chat';
import { useFixedSiderWidth } from '@/components/Index';

export default function MainPage() {
  const { width } = useFixedSiderWidth();
  return (
    <div className="h-full">
      <Chat siderWidth={width} />
    </div>
  );
}
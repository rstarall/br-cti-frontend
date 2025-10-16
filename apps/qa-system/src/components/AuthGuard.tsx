'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const whiteList: ((path: string) => boolean)[] = [
    (p) => p.startsWith('/auth'),
    (p) => p.startsWith('/_next'),
    (p) => p.startsWith('/api'),
    (p) => p === '/',
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((s) => s.token);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const isWhite = whiteList.some((fn) => fn(pathname));
        if (!token && !isWhite) {
            router.replace('/auth/login');
        }
    }, [token, pathname, router]);

    return <>{children}</>;
}



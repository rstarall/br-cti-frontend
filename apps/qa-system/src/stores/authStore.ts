import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import AuthAPI, { LoginRequestBody, RegisterRequestBody } from '@/api/auth';

export interface AuthState {
    token: string;
    user?: { username: string; email?: string; userId?: string } | null;
    loggingIn: boolean;
    registering: boolean;
    setToken: (token: string) => void;
    clear: () => void;
    login: (payload: LoginRequestBody) => Promise<void>;
    register: (payload: RegisterRequestBody) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: '',
            user: null,
            loggingIn: false,
            registering: false,
            setToken: (token: string) => set({ token }),
            clear: () => set({ token: '', user: null }),
            login: async (payload: LoginRequestBody) => {
                set({ loggingIn: true });
                try {
                    const data = await AuthAPI.login(payload);
                    const token = (data.access_token || (data as any).token || '').toString();
                    const userId = (data as any).user_id_login || (data as any).user_id || undefined;
                    set({ token, user: { username: payload.username, userId }, loggingIn: false });
                } catch (e) {
                    set({ loggingIn: false });
                    throw e;
                }
            },
            register: async (payload: RegisterRequestBody) => {
                set({ registering: true });
                try {
                    await AuthAPI.register(payload);
                } finally {
                    set({ registering: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user }),
            storage: typeof window !== 'undefined' ? {
                getItem: (name): StorageValue<Pick<AuthState, 'token' | 'user'>> | null => {
                    try {
                        const str = localStorage.getItem(name);
                        return str ? JSON.parse(str) : null;
                    } catch {
                        return null;
                    }
                },
                setItem: (name, value: StorageValue<Pick<AuthState, 'token' | 'user'>>) => {
                    try {
                        localStorage.setItem(name, JSON.stringify(value));
                    } catch { }
                },
                removeItem: (name) => {
                    try {
                        localStorage.removeItem(name);
                    } catch { }
                },
            } : undefined,
        }
    )
);

export default useAuthStore;



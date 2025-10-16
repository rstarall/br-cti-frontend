import api from './index';

export interface RegisterRequestBody {
    username: string;
    password: string;
    email?: string;
}

export interface LoginRequestBody {
    username: string;
    password: string;
}

export interface LoginResponseBody {
    access_token?: string;
    token?: string;
    [key: string]: any;
}

export class AuthAPI {
    static async register(body: RegisterRequestBody) {
        const res = await api.post('/auth/register', body);
        return res.data;
    }

    static async login(body: LoginRequestBody): Promise<LoginResponseBody> {
        // FastAPI OAuth2PasswordRequestForm 需要 x-www-form-urlencoded
        const form = new URLSearchParams();
        form.set('username', body.username);
        form.set('password', body.password);
        // 兼容 FastAPI OAuth2PasswordRequestForm 的字段
        form.set('grant_type', 'password');
        form.set('scope', '');
        const res = await api.post('/auth/token', form, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return res.data as LoginResponseBody;
    }
}

export default AuthAPI;



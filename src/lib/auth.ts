import api from './api';
import { User } from './api';
import Cookies from 'js-cookie';

export async function handleTwitterCallback(code: string): Promise<User> {
    try {
        const { data } = await api.get(`/auth/callback?code=${code}`);
        // Store user data in cookie
        Cookies.set('session', JSON.stringify(data), { expires: 7 }); // 7 days
        return data;
    } catch (error) {
        console.error('Error handling Twitter callback:', error);
        throw error;
    }
}

export async function logout(): Promise<void> {
    try {
        await api.post('/auth/logout');
        // Clear auth state
        Cookies.remove('session');
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}

export async function initiateTwitterAuth(): Promise<string> {
    try {
        const { data } = await api.post<{ authUrl: string }>('/auth/initiate');
        return data.authUrl;
    } catch (error) {
        console.error('Error initiating Twitter auth:', error);
        throw error;
    }
} 
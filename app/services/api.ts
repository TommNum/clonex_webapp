import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

// Server-side instance (used in Route Handlers or Server Components)
export const serverApi = axios.create({
    baseURL: process.env.BACKEND_INTERNAL_URL || 'http://wholesome-creation.railway.internal:3001',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Client-side instance (optional, only if client-side calls persist elsewhere)
export const clientApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://wholesome-creation-production.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add request interceptor to log cookies
clientApi.interceptors.request.use((config) => {
    console.log('Request cookies:', document.cookie);
    return config;
});

// Add response interceptor to log headers
clientApi.interceptors.response.use(
    (response) => {
        console.log('Response headers:', response.headers);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

// Timeline API service
export const timelineApi = {
    getTimeline: async (nextToken?: string): Promise<TimelineResponse> => {
        try {
            // Log the exact URL being hit - now using our proxy
            console.log('Making request to proxy:', '/api/proxy/api/timeline');

            const response = await clientApi.get('/api/timeline', {
                params: nextToken ? { next_token: nextToken } : undefined,
                withCredentials: true, // Ensure credentials are included
                headers: {
                    'Accept': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Timeline request failed:', error);
            throw error;
        }
    }
}; 
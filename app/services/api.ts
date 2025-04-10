import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

if (!process.env.BACKEND_INTERNAL_URL) {
    console.error('BACKEND_INTERNAL_URL is not set');
}

// Server-side instance for internal backend calls
export const serverApi = axios.create({
    baseURL: process.env.BACKEND_INTERNAL_URL || 'http://wholesome-creation.railway.internal:3001',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add request interceptor to log requests
serverApi.interceptors.request.use((config) => {
    console.log('Making request to:', config.url);
    console.log('With params:', config.params);
    return config;
});

// Add response interceptor to log responses
serverApi.interceptors.response.use(
    (response) => {
        console.log('Received response:', response.status);
        return response;
    },
    (error) => {
        console.error('Request failed:', error.message);
        return Promise.reject(error);
    }
);

// Timeline API service
export const timelineApi = {
    getTimeline: async (nextToken?: string): Promise<TimelineResponse> => {
        try {
            console.log('Making request to:', '/api/timeline');

            const response = await serverApi.get('/api/timeline', {
                params: nextToken ? { next_token: nextToken } : undefined,
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
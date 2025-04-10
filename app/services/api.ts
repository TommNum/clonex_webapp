import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

if (!process.env.BACKEND_INTERNAL_URL) {
    console.error('BACKEND_INTERNAL_URL is not set');
}

// Create a server-side instance
export const serverApi = axios.create({
    baseURL: process.env.BACKEND_INTERNAL_URL || 'http://wholesome-creation.railway.internal:3001',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to log requests
serverApi.interceptors.request.use((config) => {
    console.log('Making request to:', config.url);
    console.log('With params:', config.params);
    return config;
});

// Add response interceptor for error handling
serverApi.interceptors.response.use(
    response => response,
    error => {
        console.error('Request failed:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
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

// Test function to verify basic routing
export async function testBackendConnection() {
    try {
        console.log('Testing backend connection...');
        const response = await serverApi.get('/test');
        console.log('Backend test response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Backend test failed:', error);
        throw error;
    }
} 
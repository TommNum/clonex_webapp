import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

// Server-side instance for internal backend calls
export const serverApi = axios.create({
    baseURL: process.env.BACKEND_INTERNAL_URL || 'http://wholesome-creation.railway.internal:3001',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

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
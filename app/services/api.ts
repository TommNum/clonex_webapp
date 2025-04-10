import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'https://wholesome-creation-production.up.railway.app',
    withCredentials: true, // Important for cross-domain cookies/authentication
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Timeline API service
export const timelineApi = {
    getTimeline: async (nextToken?: string): Promise<TimelineResponse> => {
        try {
            // Log the exact URL being hit
            console.log('Making request to:', 'https://wholesome-creation-production.up.railway.app/api/timeline');

            const response = await api.get('/api/timeline', {
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
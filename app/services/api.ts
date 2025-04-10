import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

// Create axios instance with default config
const api = axios.create({
    // Use our local API proxy instead of calling Railway directly
    baseURL: '/api/proxy',
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
            // Log the exact URL being hit - now using our proxy
            console.log('Making request to proxy:', '/api/proxy/api/timeline');

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
import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true // Required for cookies
});

// Timeline API service
export const timelineApi = {
    getTimeline: async (nextToken?: string): Promise<TimelineResponse> => {
        const params = new URLSearchParams();
        if (nextToken) {
            params.append('next_token', nextToken);
        }

        // Note: This endpoint is rate limited to 100 requests per 15 minutes
        const response = await api.get<TimelineResponse>(
            `/api/timeline?${params.toString()}`
        );
        return response.data;
    }
}; 
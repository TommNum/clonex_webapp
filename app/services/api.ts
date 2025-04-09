import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

// Create axios instance with default config
const api = axios.create({
    withCredentials: true // Required for cookies
});

// Timeline API service
export const timelineApi = {
    getTimeline: async (nextToken?: string): Promise<TimelineResponse> => {
        const params = new URLSearchParams();
        if (nextToken) {
            params.append('next_token', nextToken);
        }

        const response = await api.get<TimelineResponse>(`/api/timeline?${params.toString()}`);
        return response.data;
    }
}; 
import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true // Required for cookies
});

export const timelineApi = {
    getTimeline: async (nextToken?: string): Promise<TimelineResponse> => {
        const params = new URLSearchParams();
        if (nextToken) {
            params.append('next_token', nextToken);
        }

        const response = await api.get<TimelineResponse>(
            `/api/timeline?${params.toString()}`
        );
        return response.data;
    }
}; 
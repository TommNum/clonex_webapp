import axios from 'axios';
import { TimelineResponse } from '../types/timeline';

const api = axios.create({
    baseURL: 'wholesome-creation.railway.internal',
    withCredentials: true, // Required for cookies
    // Force IPv6 resolution
    httpAgent: new (require('http').Agent)({ family: 6 }),
    httpsAgent: new (require('https').Agent)({ family: 6 })
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
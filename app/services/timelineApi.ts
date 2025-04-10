import { clientApi } from './api';
import { TimelineResponse } from '../types/timeline';

export const timelineApi = {
    getTimeline: async (nextToken?: string): Promise<TimelineResponse> => {
        try {
            const url = nextToken ? `/api/timeline?nextToken=${nextToken}` : '/api/timeline';
            console.log('Making request to:', url);

            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Timeline request failed:', error);
            throw error;
        }
    }
}; 
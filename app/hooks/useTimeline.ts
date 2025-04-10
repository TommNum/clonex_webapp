import { useState, useCallback } from 'react';
import { TimelinePost, TimelineResponse } from '../types/timeline';
import { timelineApi } from '../services/timelineApi';

export const useTimeline = () => {
    const [posts, setPosts] = useState<TimelinePost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchTimeline = useCallback(async (refresh = false) => {
        try {
            console.log('=== Timeline Hook ===');
            console.log('Environment:', process.env.NODE_ENV);
            console.log('Refresh:', refresh);
            console.log('Next token:', nextToken);
            console.log('Session cookie present:', document.cookie.includes('session='));

            const response = await timelineApi.getTimeline(nextToken || undefined);

            if (refresh) {
                setPosts(response.posts);
            } else {
                setPosts(prev => [...prev, ...response.posts]);
            }

            setNextToken(response.nextToken || null);
            setHasMore(!!response.nextToken);
            setError(null);
        } catch (error) {
            console.error('Timeline error:', error);
            setError('Failed to load timeline');
        } finally {
            setLoading(false);
        }
    }, [nextToken]);

    return {
        posts,
        loading,
        error,
        hasMore,
        fetchTimeline,
        setError
    };
}; 
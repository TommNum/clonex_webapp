import { useState, useCallback, useEffect } from 'react';
import { TimelinePost, TimelineResponse } from '../types/timeline';
import { timelineApi } from '../services/api';

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

            const response = await timelineApi.getTimeline(nextToken || undefined);

            if (refresh) {
                setPosts(response.data);
            } else {
                setPosts(prev => [...prev, ...response.data]);
            }

            setNextToken(response.meta?.next_token || null);
            setHasMore(!!response.meta?.next_token);
            setError(null);
        } catch (error) {
            console.error('Timeline error:', error);
            setError('Failed to load timeline');
        } finally {
            setLoading(false);
        }
    }, [nextToken]);

    const refresh = useCallback(() => {
        setNextToken(null);
        setLoading(true);
        fetchTimeline(true);
    }, [fetchTimeline]);

    const loadMore = useCallback(() => {
        if (nextToken && !loading) {
            setLoading(true);
            fetchTimeline(false);
        }
    }, [nextToken, loading, fetchTimeline]);

    // Initial fetch
    useEffect(() => {
        fetchTimeline(true);
    }, [fetchTimeline]);

    return {
        posts,
        loading,
        error,
        hasMore,
        refresh,
        loadMore,
        setError
    };
}; 
import { useState, useCallback, useEffect } from 'react';
import { TimelinePost, TimelineResponse } from '../types/timeline';
import { useAuth } from '@/contexts/AuthContext';

export const useTimeline = () => {
    const [posts, setPosts] = useState<TimelinePost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const fetchTimeline = useCallback(async (refresh = false) => {
        try {
            console.log('=== Timeline Hook ===');
            console.log('Environment:', process.env.NODE_ENV);
            console.log('Refresh:', refresh);
            console.log('Next token:', nextToken);

            const url = new URL('/api/timeline', window.location.origin);
            if (nextToken && !refresh) {
                url.searchParams.set('nextToken', nextToken);
            }

            const response = await fetch(url.toString(), {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Timeline response:', data);

            if (refresh) {
                setPosts(data.data);
            } else {
                setPosts(prev => [...prev, ...data.data]);
            }

            setNextToken(data.meta?.next_token || null);
            setHasMore(!!data.meta?.next_token);
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
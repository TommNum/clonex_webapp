import { useState, useCallback, useEffect } from 'react';
import { TimelinePost } from '../types/timeline';
import { timelineApi } from '../services/api';
import axios from 'axios';

export function useTimeline() {
    const [posts, setPosts] = useState<TimelinePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextToken, setNextToken] = useState<string | undefined>();
    const [hasMore, setHasMore] = useState(true);

    const fetchTimeline = useCallback(async (refresh = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await timelineApi.getTimeline(refresh ? undefined : nextToken);

            setPosts(prev => refresh ? response.data : [...prev, ...response.data]);
            setNextToken(response.meta?.next_token);
            setHasMore(!!response.meta?.next_token);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                // Handle unauthorized - redirect to login
                window.location.href = '/auth/login';
                return;
            }
            setError('Failed to fetch timeline');
        } finally {
            setLoading(false);
        }
    }, [nextToken]);

    // Initial fetch
    useEffect(() => {
        fetchTimeline();
    }, []);

    return {
        posts,
        loading,
        error,
        hasMore,
        refresh: () => fetchTimeline(true),
        loadMore: () => fetchTimeline(false)
    };
} 
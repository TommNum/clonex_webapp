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

            // Log session information
            console.log('=== Timeline Request ===');
            console.log('Session cookie present:', document.cookie.includes('connect.sid'));

            const response = await timelineApi.getTimeline(refresh ? undefined : nextToken);

            setPosts(prev => refresh ? response.data : [...prev, ...response.data]);
            setNextToken(response.meta?.next_token);
            setHasMore(!!response.meta?.next_token);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                    window.location.href = '/auth/login';
                    return;
                } else if (err.response?.status === 404) {
                    setError('Timeline endpoint not found. Please check your session.');
                    return;
                }
                console.error('Timeline error details:', {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                    headers: err.response?.headers
                });
            }
            setError('Failed to fetch timeline. Please try again.');
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
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

            console.log('=== Timeline API Request ===');
            console.log('Environment:', process.env.NODE_ENV);
            console.log('Backend URL:', process.env.NEXT_PUBLIC_API_URL);
            console.log('Request URL:', `/api/timeline${nextToken ? `?next_token=${nextToken}` : ''}`);
            console.log('Full Backend URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/timeline${nextToken ? `?next_token=${nextToken}` : ''}`);
            console.log('Query params:', { nextToken });

            const response = await timelineApi.getTimeline(refresh ? undefined : nextToken);

            setPosts(prev => refresh ? response.data : [...prev, ...response.data]);
            setNextToken(response.meta?.next_token);
            setHasMore(!!response.meta?.next_token);
        } catch (err) {
            console.log('=== Timeline API Error ===');
            if (axios.isAxiosError(err)) {
                console.log('Error URL:', err.config?.url);
                console.log('Error Method:', err.config?.method);
                console.log('Error Headers:', err.config?.headers);
                console.log('Error Status:', err.response?.status);
                console.log('Error Status Text:', err.response?.statusText);
                console.log('Error Data:', err.response?.data);
                console.log('Error Headers:', err.response?.headers);

                if (err.response?.status === 401) {
                    // Handle unauthorized - redirect to login
                    window.location.href = '/auth/login';
                    return;
                } else if (err.response?.status === 404) {
                    // Handle 404 specifically
                    setError('Timeline endpoint not found. Please check your session.');
                    return;
                }
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
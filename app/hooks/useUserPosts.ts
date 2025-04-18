import { useState, useCallback } from 'react';
import { TimelinePost, TimelineResponse } from '../types/timeline';

export function useUserPosts() {
    const [posts, setPosts] = useState<TimelinePost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (nextToken?: string) => {
        setLoading(true);
        setError(null);

        try {
            const url = new URL('/api/posts', window.location.origin);
            if (nextToken) {
                url.searchParams.set('nextToken', nextToken);
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.statusText}`);
            }

            const data: TimelineResponse = await response.json();

            if (nextToken) {
                setPosts(prev => [...prev, ...(data.data || [])]);
            } else {
                setPosts(data.data || []);
            }

            setHasMore(!!data.meta?.next_token);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const lastPost = posts[posts.length - 1];
            if (lastPost) {
                fetchPosts(lastPost.id);
            }
        }
    }, [loading, hasMore, posts, fetchPosts]);

    const refresh = useCallback(() => {
        setPosts([]);
        setHasMore(true);
        fetchPosts();
    }, [fetchPosts]);

    return {
        posts,
        loading,
        error,
        hasMore,
        loadMore,
        refresh
    };
} 
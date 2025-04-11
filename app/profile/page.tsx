'use client';

import { useUserPosts } from '@/app/hooks/useUserPosts';
import { Post } from '@/app/components/Post';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { useCallback, useEffect, useRef } from 'react';

export default function ProfilePage() {
    const { posts, loading, error, hasMore, loadMore, refresh } = useUserPosts();
    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadMore]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Your Posts</h1>

            <div className="space-y-4">
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        ref={index === posts.length - 1 ? lastPostElementRef : undefined}
                    >
                        <Post post={post} />
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center my-4">
                    <LoadingSpinner />
                </div>
            )}

            {!loading && posts.length === 0 && (
                <div className="text-center text-gray-500">
                    No posts found
                </div>
            )}
        </div>
    );
} 
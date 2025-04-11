'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAnalysis } from '@/app/hooks/useAnalysis';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { createAnalysis, loading, error } = useAnalysis();
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
            setStatus('error');
            return;
        }

        const handleAuth = async () => {
            try {
                // First, complete the OAuth flow
                const response = await fetch('/api/auth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, state }),
                });

                if (!response.ok) {
                    throw new Error('Failed to complete authentication');
                }

                // Then, create the user analysis
                await createAnalysis();

                setStatus('success');
                router.push('/profile');
            } catch (err) {
                console.error('Auth callback error:', err);
                setStatus('error');
            }
        };

        handleAuth();
    }, [searchParams, router, createAnalysis]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Completing authentication...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
                    <p>{error || 'Failed to complete authentication'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return null;
} 
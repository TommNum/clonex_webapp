'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleTwitterCallback } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('OAuth error:', error);
            router.push('/?error=auth_failed');
            return;
        }

        if (!code) {
            console.error('No code received');
            router.push('/?error=no_code');
            return;
        }

        const handleCallback = async () => {
            try {
                const user = await handleTwitterCallback(code);
                setUser(user);
                router.push('/dashboard'); // Redirect to dashboard after successful auth
            } catch (error) {
                console.error('Error handling callback:', error);
                router.push('/?error=callback_failed');
            }
        };

        handleCallback();
    }, [searchParams, router, setUser]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Connecting to Twitter...</h1>
                <p className="text-gray-600">Please wait while we complete the authentication process.</p>
            </div>
        </div>
    );
} 
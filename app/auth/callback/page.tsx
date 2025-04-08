'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

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

        // Get the code_verifier from localStorage
        const codeVerifier = localStorage.getItem('code_verifier');
        if (!codeVerifier) {
            console.error('No code verifier found');
            router.push('/?error=no_verifier');
            return;
        }

        // Create and submit the form to exchange the code for tokens
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/auth/callback';

        const codeInput = document.createElement('input');
        codeInput.type = 'hidden';
        codeInput.name = 'code';
        codeInput.value = code;

        const verifierInput = document.createElement('input');
        verifierInput.type = 'hidden';
        verifierInput.name = 'code_verifier';
        verifierInput.value = codeVerifier;

        form.appendChild(codeInput);
        form.appendChild(verifierInput);
        document.body.appendChild(form);
        form.submit();

        // Clean up the code_verifier from localStorage
        localStorage.removeItem('code_verifier');
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Connecting to X...</h1>
                <p className="text-gray-600">Please wait while we complete the authentication process.</p>
            </div>
        </div>
    );
} 
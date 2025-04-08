'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            router.push('/?error=no_code');
            return;
        }

        const codeVerifier = localStorage.getItem('code_verifier');
        if (!codeVerifier) {
            router.push('/?error=no_verifier');
            return;
        }

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

        localStorage.removeItem('code_verifier');
    }, [searchParams, router]);

    return <div>Connecting...</div>;
} 
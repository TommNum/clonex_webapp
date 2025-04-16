'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Cancel() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard after 3 seconds
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 font-syncopate">Payment Cancelled</h1>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <p className="text-lg font-cormorant">You have cancelled the checkout process. You'll be redirected to your dashboard shortly.</p>
                </div>
            </div>
        </div>
    );
} 
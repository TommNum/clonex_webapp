'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            console.log('Checkout session ID:', sessionId);
            // Redirect to dashboard after 3 seconds
            const timer = setTimeout(() => {
                router.push('/dashboard');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [sessionId, router]);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 font-syncopate">Payment Successful!</h1>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <p className="text-lg font-cormorant">Thank you for your purchase. You'll be redirected to your dashboard shortly.</p>
                </div>
            </div>
        </div>
    );
}

export default function Success() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <p className="text-lg font-cormorant">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
} 
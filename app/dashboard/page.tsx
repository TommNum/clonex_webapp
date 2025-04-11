"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { Timeline } from "../components/Timeline"

export default function Dashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleTestAnalysis = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/analysis/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to test analysis: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Analysis test response:', data);
            setSuccess(true);
        } catch (err) {
            console.error('Error testing analysis:', err);
            setError(err instanceof Error ? err.message : 'Failed to test analysis');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!session) {
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 font-syncopate">Dashboard</h1>

                <div className="space-y-8">
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <h2 className="text-2xl font-semibold mb-4 font-cormorant">Welcome to your Dashboard</h2>
                        <p className="text-lg font-cormorant">You are now connected to X.</p>
                    </div>
                    <Timeline />
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Session Info</h2>
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleTestAnalysis}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <LoadingSpinner className="w-4 h-4 mr-2" />
                                Testing Analysis...
                            </span>
                        ) : (
                            'Test Analysis Endpoint'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                        Analysis test successful! Check the console for details.
                    </div>
                )}
            </div>
        </div>
    )
} 
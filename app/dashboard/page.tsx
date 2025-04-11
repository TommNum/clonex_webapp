"use client"

import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext"
import { Timeline } from "../components/Timeline"
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function Dashboard() {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleTestAnalysis = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://wholesome-creation.railway.internal:3001/api/analysis/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.twitterToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.twitterId
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create analysis: ${response.statusText}`);
            }

            const analysis = await response.json();
            console.log('Analysis created:', analysis);
            setSuccess(true);
        } catch (err) {
            console.error('Error creating analysis:', err);
            setError(err instanceof Error ? err.message : 'Failed to create analysis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 font-syncopate">Dashboard</h1>

                {isAuthenticated ? (
                    <div className="space-y-8">
                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold mb-4 font-cormorant">Welcome to your Dashboard</h2>
                            <p className="text-lg font-cormorant">You are now connected to X.</p>
                        </div>

                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                            <button
                                onClick={handleTestAnalysis}
                                disabled={loading}
                                className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <LoadingSpinner />
                                        Creating Analysis...
                                    </span>
                                ) : (
                                    'Test Analysis Creation'
                                )}
                            </button>

                            {error && (
                                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                    Analysis created successfully! Check the console for details.
                                </div>
                            )}
                        </div>

                        <Timeline />
                    </div>
                ) : (
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <h2 className="text-2xl font-semibold mb-4 font-cormorant">Not Authenticated</h2>
                        <p className="text-lg font-cormorant">Please connect your X account to access the dashboard.</p>
                    </div>
                )}
            </div>
        </div>
    )
} 
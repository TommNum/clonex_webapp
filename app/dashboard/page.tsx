"use client"

import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext"
import { Timeline } from "../components/Timeline"
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Dashboard() {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [generatedTweets, setGeneratedTweets] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    const handleTestAnalysis = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/analysis/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    const handleGenerateTweets = async () => {
        setIsGenerating(true);
        setError(null);
        setGeneratedTweets([]);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate tweets');
            }

            const data = await response.json();
            setGeneratedTweets(data.generated_tweets);
        } catch (err) {
            console.error('Error generating tweets:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate tweets');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            setError('Please log in to proceed with checkout');
            return;
        }

        setIsCheckoutLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            const { error } = await stripe!.redirectToCheckout({ sessionId });
            if (error) {
                throw new Error(error.message);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'Failed to initiate checkout');
        } finally {
            setIsCheckoutLoading(false);
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

                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm space-y-4">
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

                            <button
                                onClick={handleGenerateTweets}
                                disabled={isGenerating}
                                className={`px-4 py-2 rounded-md text-white ${isGenerating ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'}`}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center">
                                        <LoadingSpinner />
                                        Generating Tweets...
                                    </span>
                                ) : (
                                    'Generate Tweets'
                                )}
                            </button>

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckoutLoading}
                                className={`px-4 py-2 rounded-md text-white ${isCheckoutLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {isCheckoutLoading ? (
                                    <span className="flex items-center">
                                        <LoadingSpinner />
                                        Processing...
                                    </span>
                                ) : (
                                    'Upgrade to Premium'
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

                            {generatedTweets.length > 0 && (
                                <div className="mt-4 space-y-4">
                                    <h3 className="text-xl font-semibold font-cormorant">Generated Tweets</h3>
                                    {generatedTweets.map((tweet, index) => (
                                        <div key={index} className="bg-white/5 p-4 rounded-lg">
                                            <p className="font-cormorant">{tweet}</p>
                                        </div>
                                    ))}
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
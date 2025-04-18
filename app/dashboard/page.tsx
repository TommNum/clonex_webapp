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
    const [currentTweetIndex, setCurrentTweetIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [tweetText, setTweetText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);
    const [postSuccess, setPostSuccess] = useState(false);

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
            // Extract just the tweet text from the generated tweets
            const tweetTexts = data.generated_tweets.map((tweet: any) => tweet.tweet_text || tweet);
            setGeneratedTweets(tweetTexts);
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
            console.log('Initiating checkout...');
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    successUrl: `${window.location.origin}/success`,
                    cancelUrl: `${window.location.origin}/cancel`,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Checkout error response:', errorData);
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const data = await response.json();
            console.log('Checkout session created:', data);

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe failed to initialize');
            }

            const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
            if (error) {
                console.error('Stripe redirect error:', error);
                throw new Error(error.message);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'Failed to initiate checkout');
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handlePostTweet = async () => {
        if (!tweetText.trim()) {
            setPostError('Please enter some text for your tweet');
            return;
        }

        setIsPosting(true);
        setPostError(null);
        setPostSuccess(false);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: tweetText.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to post tweet');
            }

            const data = await response.json();
            console.log('Tweet posted successfully:', data);
            setPostSuccess(true);
            setTweetText(''); // Clear the input after successful post
        } catch (err) {
            console.error('Error posting tweet:', err);
            setPostError(err instanceof Error ? err.message : 'Failed to post tweet');
        } finally {
            setIsPosting(false);
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
                            {/* Tweet Input Form */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold font-cormorant">Create a Tweet</h3>
                                <textarea
                                    value={tweetText}
                                    onChange={(e) => setTweetText(e.target.value)}
                                    placeholder="What's happening?"
                                    className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    maxLength={280}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white/50">
                                        {tweetText.length}/280
                                    </span>
                                    <button
                                        onClick={handlePostTweet}
                                        disabled={isPosting || !tweetText.trim()}
                                        className={`px-6 py-2 rounded-md text-white font-medium ${isPosting || !tweetText.trim()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                    >
                                        {isPosting ? (
                                            <span className="flex items-center">
                                                <LoadingSpinner />
                                                Posting...
                                            </span>
                                        ) : (
                                            'Post Tweet'
                                        )}
                                    </button>
                                </div>
                                {postError && (
                                    <div className="mt-2 text-red-500 text-sm">
                                        {postError}
                                    </div>
                                )}
                                {postSuccess && (
                                    <div className="mt-2 text-green-500 text-sm">
                                        Tweet posted successfully!
                                    </div>
                                )}
                            </div>

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
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <p className="font-cormorant">{generatedTweets[currentTweetIndex]}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setCurrentTweetIndex((prev) => (prev > 0 ? prev - 1 : generatedTweets.length - 1))}
                                            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-white">
                                            {currentTweetIndex + 1} / {generatedTweets.length}
                                        </span>
                                        <button
                                            onClick={() => setCurrentTweetIndex((prev) => (prev < generatedTweets.length - 1 ? prev + 1 : 0))}
                                            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                                        >
                                            Next
                                        </button>
                                    </div>
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
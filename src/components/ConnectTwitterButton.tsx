'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { initiateTwitterAuth } from '@/lib/auth';
import { Twitter } from 'lucide-react';

export default function ConnectTwitterButton() {
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();

    async function handleConnectClick() {
        try {
            setLoading(true);
            const authUrl = await initiateTwitterAuth();
            window.location.href = authUrl;
        } catch (error) {
            console.error('Failed to connect Twitter:', error);
            // You might want to show a toast notification here
            alert('Failed to connect with Twitter. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleConnectClick}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Twitter className="w-5 h-5" />
            {loading ? 'Connecting...' : 'Connect Twitter'}
        </button>
    );
} 
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/api';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const checkSession = async () => {
            try {
                const session = Cookies.get('session');
                if (session) {
                    // You might want to validate the session with your backend
                    // For now, we'll just set the user from the session
                    const userData = JSON.parse(session);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const value = {
        user,
        loading,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 
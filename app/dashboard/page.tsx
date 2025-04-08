"use client"

import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth()

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

                {isAuthenticated && user ? (
                    <div className="bg-white/10 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.username}!</h2>
                        <p className="text-lg">You are successfully connected to Twitter.</p>
                    </div>
                ) : (
                    <div className="bg-white/10 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Not Authenticated</h2>
                        <p className="text-lg">Please connect your Twitter account to access the dashboard.</p>
                    </div>
                )}
            </div>
        </div>
    )
} 
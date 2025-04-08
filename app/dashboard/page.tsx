"use client"

import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>

                {isAuthenticated ? (
                    <div className="rounded-lg bg-gray-800 p-6">
                        <h2 className="mb-4 text-2xl font-semibold">Welcome to your Dashboard</h2>
                        <p className="text-gray-300">
                            You are now connected to X. Here you can manage your settings and preferences.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg bg-gray-800 p-6">
                        <h2 className="mb-4 text-2xl font-semibold">Not authenticated</h2>
                        <p className="text-gray-300">
                            Please connect your X account to see the dashboard.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
} 
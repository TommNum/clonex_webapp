"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Timeline } from "../components/Timeline"

export default function Dashboard() {
    const { isAuthenticated } = useAuth()

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
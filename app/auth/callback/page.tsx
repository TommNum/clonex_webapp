"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function CallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()

    useEffect(() => {
        const code = searchParams.get("code")
        const state = searchParams.get("state")

        if (!code) {
            console.error("No code provided")
            router.push("/?error=no_code")
            return
        }

        // The token exchange is handled by the API route
        // We just need to redirect to the dashboard
        router.push("/dashboard")
    }, [searchParams, router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-2xl font-bold">Connecting to X...</h1>
                <p className="text-gray-400">Please wait while we complete the connection.</p>
            </div>
        </div>
    )
} 
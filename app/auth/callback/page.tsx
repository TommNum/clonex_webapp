"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

function CallbackContent() {
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

export default function CallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold">Loading...</h1>
                        <p className="text-gray-400">Please wait while we load the page.</p>
                    </div>
                </div>
            }
        >
            <CallbackContent />
        </Suspense>
    )
} 
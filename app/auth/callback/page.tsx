"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const { handleCallback } = useAuth()

    useEffect(() => {
        async function handleOAuthCallback() {
            try {
                // Make sure we have the code
                if (!code || !state) {
                    console.error("Missing code or state")
                    router.push("/?error=missing_params")
                    return
                }

                // Exchange code for token via our backend
                await handleCallback(code, state)

                // Redirect to dashboard on success
                router.push("/dashboard")
            } catch (error) {
                console.error("Error handling callback:", error)
                router.push("/?error=auth_failed")
            }
        }

        if (code) {
            handleOAuthCallback()
        }
    }, [code, state, router, handleCallback])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Connecting your account...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    )
} 
"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const { login } = useAuth()

    useEffect(() => {
        async function handleOAuthCallback() {
            try {
                // Make sure we have the code
                if (!code || !state) {
                    console.error("Missing code or state")
                    router.push("/?error=missing_params")
                    return
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL
                if (!apiUrl) {
                    console.error("NEXT_PUBLIC_API_URL is not defined")
                    router.push("/?error=config_error")
                    return
                }

                // Exchange code for token via our backend
                const response = await fetch(`${apiUrl}/auth/callback?code=${code}&state=${state}`)
                if (!response.ok) {
                    throw new Error("Failed to exchange code for token")
                }

                // Complete the login process
                await login()

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
    }, [code, state, router, login])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Connecting your account...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    )
}

export default function AuthCallback() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    )
} 
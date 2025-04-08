"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    useEffect(() => {
        async function handleOAuthCallback() {
            try {
                // Make sure we have the code
                if (!code || !state) {
                    console.error("Missing code or state")
                    router.push("/?error=missing_params")
                    return
                }

                // Get the code verifier from localStorage
                const codeVerifier = localStorage.getItem('code_verifier')
                if (!codeVerifier) {
                    console.error("No code verifier found")
                    router.push("/?error=no_verifier")
                    return
                }

                console.log("Starting token exchange...")
                // Exchange code for token through our server
                const response = await fetch(`/api/auth/callback?code=${code}&state=${state}&code_verifier=${codeVerifier}`)
                console.log("Token exchange response status:", response.status)

                if (!response.ok) {
                    const error = await response.text()
                    console.error("Token exchange failed:", error)
                    throw new Error("Failed to exchange code for token")
                }

                const data = await response.json()
                console.log("Token exchange response data:", data)

                // Store the token in localStorage
                if (data.access_token) {
                    console.log("Setting access token in localStorage")
                    localStorage.setItem('twitter_access_token', data.access_token)
                    console.log("Current localStorage:", {
                        access_token: localStorage.getItem('twitter_access_token'),
                        code_verifier: localStorage.getItem('code_verifier')
                    })
                } else {
                    console.error("No access token in response:", data)
                    throw new Error("No access token received")
                }

                // Clean up the code verifier
                localStorage.removeItem('code_verifier')

                // Redirect to dashboard
                console.log("Redirecting to dashboard...")
                router.push("/dashboard")
            } catch (error) {
                console.error("Error handling callback:", error)
                router.push("/?error=auth_failed")
            }
        }

        if (code) {
            handleOAuthCallback()
        }
    }, [code, state, router])

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
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

                // Get the code verifier from cookies
                const codeVerifier = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('code_verifier='))
                    ?.split('=')[1]

                if (!codeVerifier) {
                    console.error("No code verifier found")
                    router.push("/?error=no_verifier")
                    return
                }

                // Exchange code for token
                const response = await fetch("https://api.twitter.com/2/oauth2/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Basic ${Buffer.from(
                            `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
                        ).toString("base64")}`,
                    },
                    body: new URLSearchParams({
                        code,
                        grant_type: "authorization_code",
                        client_id: process.env.TWITTER_CLIENT_ID!,
                        redirect_uri: process.env.TWITTER_REDIRECT_URI!,
                        code_verifier: codeVerifier,
                    }),
                })

                if (!response.ok) {
                    const error = await response.text()
                    console.error("Token exchange failed:", error)
                    throw new Error("Failed to exchange code for token")
                }

                const data = await response.json()

                // Store the token
                if (data.access_token) {
                    document.cookie = `twitter_access_token=${data.access_token}; path=/; secure`
                }

                // Redirect to dashboard
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
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
                console.log("Starting OAuth callback flow")
                console.log("URL params:", { code, state })

                // Make sure we have the code
                if (!code || !state) {
                    console.error("Missing code or state:", { code, state })
                    router.push("/?error=missing_params")
                    return
                }

                console.log("Exchanging code for token...")
                // Exchange code for token
                const response = await fetch(`/api/auth/callback?code=${code}&state=${state}`, {
                    redirect: 'manual' // Don't follow redirects automatically
                })
                console.log("Token exchange response status:", response.status)

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error("Token exchange failed:", errorText)
                    throw new Error("Failed to exchange code for token")
                }

                // Get the cookie from the response headers
                const cookieHeader = response.headers.get('Set-Cookie')
                console.log("Received Set-Cookie header:", cookieHeader)

                if (cookieHeader) {
                    // The cookie is already set by the browser, we just need to redirect
                    console.log("Cookie set by server, redirecting to dashboard...")
                    router.push("/dashboard")
                } else {
                    console.error("No Set-Cookie header in response")
                    router.push("/?error=no_token")
                }
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
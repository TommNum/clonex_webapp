import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    // Get the base URL from environment or use the request URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url

    if (!code) {
        return NextResponse.redirect(new URL("/?error=no_code", baseUrl))
    }

    // Get the code verifier from cookies
    const cookieStore = await cookies()
    const codeVerifier = cookieStore.get("code_verifier")?.value
    if (!codeVerifier) {
        return NextResponse.redirect(new URL("/?error=no_verifier", baseUrl))
    }

    // Check for required environment variables
    if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_REDIRECT_URI) {
        console.error("Missing required environment variables:", {
            hasClientId: !!process.env.TWITTER_CLIENT_ID,
            hasRedirectUri: !!process.env.TWITTER_REDIRECT_URI
        })
        return NextResponse.redirect(new URL("/?error=config_error", baseUrl))
    }

    try {
        console.log("Exchanging code for token...")
        const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
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
                client_id: process.env.TWITTER_CLIENT_ID,
                redirect_uri: process.env.TWITTER_REDIRECT_URI,
                code_verifier: codeVerifier,
            }),
        })

        const data = await tokenResponse.json()
        console.log("Twitter response:", data)

        if (!tokenResponse.ok) {
            console.error("Token exchange failed:", {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                data
            })
            throw new Error(data.error_description || "Failed to get access token")
        }

        // Create response with cookie
        const response = NextResponse.redirect(new URL("/dashboard", baseUrl))

        // Clear the code verifier cookie
        response.cookies.delete("code_verifier")

        // Set the access token cookie
        response.cookies.set({
            name: "twitter_access_token",
            value: data.access_token,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })

        return response
    } catch (error) {
        console.error("OAuth callback error:", error)
        return NextResponse.redirect(new URL("/?error=auth_failed", baseUrl))
    }
} 
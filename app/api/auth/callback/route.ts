import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code) {
        return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    // Get the code verifier from cookies
    const cookieStore = cookies()
    const codeVerifier = cookieStore.get("code_verifier")?.value
    if (!codeVerifier) {
        return NextResponse.json({ error: "No code verifier found" }, { status: 400 })
    }

    try {
        // Exchange code for token
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
                client_id: process.env.TWITTER_CLIENT_ID!,
                redirect_uri: process.env.TWITTER_REDIRECT_URI!,
                code_verifier: codeVerifier,
            }),
        })

        const data = await tokenResponse.json()

        if (!tokenResponse.ok) {
            console.error("Token exchange failed:", data)
            return NextResponse.json({ error: data.error_description || "Failed to get access token" }, { status: tokenResponse.status })
        }

        // Return the access token
        return NextResponse.json({ access_token: data.access_token })
    } catch (error) {
        console.error("OAuth callback error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
} 
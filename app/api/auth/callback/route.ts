import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code) {
        return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    try {
        // Exchange code for token with Twitter
        const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
                ).toString("base64")}`,
            },
            body: new URLSearchParams({
                code,
                grant_type: "authorization_code",
                redirect_uri: process.env.TWITTER_REDIRECT_URI!,
                code_verifier: "challenge", // In production, use proper PKCE
            }),
        })

        if (!tokenResponse.ok) {
            const error = await tokenResponse.json()
            console.error("Twitter token exchange failed:", error)
            return NextResponse.json(
                { error: "Failed to exchange code for token" },
                { status: 400 }
            )
        }

        const data = await tokenResponse.json()

        // Return the access token to the client
        return NextResponse.json({
            access_token: data.access_token,
        })
    } catch (error) {
        console.error("Error in callback handler:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
} 
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const code = formData.get("code")
        const codeVerifier = formData.get("code_verifier")

        if (!code || !codeVerifier) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        }

        const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: code.toString(),
                grant_type: "authorization_code",
                client_id: process.env.TWITTER_CLIENT_ID!,
                redirect_uri: process.env.TWITTER_REDIRECT_URI!,
                code_verifier: codeVerifier.toString(),
            }),
        })

        if (!tokenResponse.ok) {
            return NextResponse.json({ error: "Token exchange failed" }, { status: 400 })
        }

        const { access_token } = await tokenResponse.json()
        return NextResponse.json({ access_token })
    } catch (error) {
        console.error("Token exchange error:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
} 
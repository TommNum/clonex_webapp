import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code) {
        return NextResponse.redirect("/?error=missing_code")
    }

    // Get code_verifier from cookie
    const codeVerifier = request.headers.get("cookie")?.split(";")
        .find(c => c.trim().startsWith("code_verifier="))
        ?.split("=")[1]

    if (!codeVerifier) {
        return NextResponse.redirect("/?error=missing_verifier")
    }

    try {
        // Exchange code for token
        const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
                redirect_uri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI!,
                code_verifier: codeVerifier,
            }),
        })

        if (!tokenResponse.ok) {
            const error = await tokenResponse.text()
            console.error("Token exchange failed:", error)
            return NextResponse.redirect("/?error=token_exchange_failed")
        }

        const { access_token } = await tokenResponse.json()

        // Create response with token in cookie
        const response = NextResponse.redirect("/dashboard")
        response.headers.set(
            "Set-Cookie",
            `twitter_access_token=${access_token}; Path=/; SameSite=Lax; Secure`
        )

        return response
    } catch (error) {
        console.error("Error handling callback:", error)
        return NextResponse.redirect("/?error=server_error")
    }
} 
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get("code")
        const state = searchParams.get("state")

        console.log("Callback received - code:", code, "state:", state)

        if (!code) {
            console.error("Missing code parameter")
            return NextResponse.redirect(new URL("/?error=missing_code", request.url))
        }

        // Get code_verifier from cookie
        const cookies = request.headers.get("cookie")
        console.log("Cookies received:", cookies)

        const codeVerifier = cookies?.split(";")
            .find(c => c.trim().startsWith("code_verifier="))
            ?.split("=")[1]

        console.log("Code verifier found:", !!codeVerifier)

        if (!codeVerifier) {
            console.error("Missing code verifier")
            return NextResponse.redirect(new URL("/?error=missing_verifier", request.url))
        }

        // Exchange code for token
        console.log("Exchanging code for token...")
        const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`
            },
            body: new URLSearchParams({
                code,
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
                redirect_uri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI!,
                code_verifier: codeVerifier,
            }),
        })

        console.log("Token response status:", tokenResponse.status)

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text()
            console.error("Token exchange failed:", errorText)
            return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url))
        }

        const tokenData = await tokenResponse.json()
        console.log("Token exchange successful")

        const { access_token } = tokenData

        // Create response with token in cookie
        const response = NextResponse.redirect(new URL("/dashboard", request.url))
        response.headers.set(
            "Set-Cookie",
            `twitter_access_token=${access_token}; Path=/; SameSite=Lax; Secure`
        )

        return response
    } catch (error) {
        console.error("Error in callback handler:", error)
        return NextResponse.redirect(new URL("/?error=server_error", request.url))
    }
} 
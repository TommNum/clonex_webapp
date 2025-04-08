import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const code = formData.get("code")
        const codeVerifier = formData.get("code_verifier")

        if (!code || !codeVerifier) {
            return NextResponse.redirect("/?error=missing_params")
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
            return NextResponse.redirect("/?error=token_exchange_failed")
        }

        const { access_token } = await tokenResponse.json()
        const response = NextResponse.redirect("/dashboard")

        response.cookies.set({
            name: "twitter_access_token",
            value: access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })

        return response
    } catch (error) {
        return NextResponse.redirect("/?error=server_error")
    }
} 
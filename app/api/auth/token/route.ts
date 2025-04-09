import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const code = formData.get("code")
        const codeVerifier = formData.get("code_verifier")
        const refreshToken = formData.get("refresh_token")
        const grantType = refreshToken ? "refresh_token" : "authorization_code"

        if (!refreshToken && (!code || !codeVerifier)) {
            console.error("Missing parameters:", { code: !!code, codeVerifier: !!codeVerifier })
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        }

        const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: grantType,
                client_id: process.env.TWITTER_CLIENT_ID!,
                redirect_uri: process.env.TWITTER_REDIRECT_URI!,
                ...(refreshToken 
                    ? { refresh_token: refreshToken.toString() }
                    : { 
                        code: code!.toString(),
                        code_verifier: codeVerifier!.toString()
                    })
            }),
        })

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json()
            console.error("Twitter token exchange failed:", {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                error: errorData
            })
            return NextResponse.json({ 
                error: errorData.error_description || "Token exchange failed" 
            }, { status: tokenResponse.status })
        }

        const tokenData = await tokenResponse.json()
        const response = NextResponse.json(tokenData)

        // Set cookies for both access and refresh tokens
        response.cookies.set({
            name: "twitter_access_token",
            value: tokenData.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: tokenData.expires_in
        })

        if (tokenData.refresh_token) {
            response.cookies.set({
                name: "twitter_refresh_token",
                value: tokenData.refresh_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            })
        }

        return response
    } catch (error) {
        console.error("Token exchange error:", error)
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Server error" 
        }, { status: 500 })
    }
} 
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
    // Generate PKCE code verifier and challenge
    const codeVerifier = crypto.randomBytes(32).toString("base64url")
    const codeChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url")

    // Store code verifier in a cookie
    const response = NextResponse.redirect(
        `https://twitter.com/i/oauth2/authorize?${new URLSearchParams({
            response_type: "code",
            client_id: process.env.TWITTER_CLIENT_ID!,
            redirect_uri: "https://clonexwebapp-production.up.railway.app/auth/callback",
            scope: "tweet.read users.read offline.access",
            state: "state",
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
        })}`
    )

    // Set the code verifier cookie
    response.cookies.set({
        name: "code_verifier",
        value: codeVerifier,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })

    return response
} 
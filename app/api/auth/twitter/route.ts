import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
    const clientId = process.env.TWITTER_CLIENT_ID
    const redirectUri = process.env.TWITTER_REDIRECT_URI
    const state = Math.random().toString(36).substring(7)

    // Generate PKCE code verifier and challenge
    const codeVerifier = crypto.randomBytes(32).toString("base64url")
    const codeChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url")

    const authUrl = new URL("https://twitter.com/i/oauth2/authorize")
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("client_id", clientId!)
    authUrl.searchParams.append("redirect_uri", redirectUri!)
    authUrl.searchParams.append("scope", "tweet.read users.read offline.access")
    authUrl.searchParams.append("state", state)
    authUrl.searchParams.append("code_challenge_method", "S256")
    authUrl.searchParams.append("code_challenge", codeChallenge)

    // Store code verifier in a cookie
    const response = NextResponse.redirect(authUrl.toString())

    // Set the code verifier cookie
    response.cookies.set({
        name: "code_verifier",
        value: codeVerifier,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })

    return response
} 
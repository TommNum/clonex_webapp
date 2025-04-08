import { NextResponse } from "next/server"

export async function GET() {
    const clientId = process.env.TWITTER_CLIENT_ID
    const redirectUri = process.env.TWITTER_REDIRECT_URI
    const state = Math.random().toString(36).substring(7)

    const authUrl = new URL("https://twitter.com/i/oauth2/authorize")
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("client_id", clientId!)
    authUrl.searchParams.append("redirect_uri", redirectUri!)
    authUrl.searchParams.append("scope", "tweet.read users.read offline.access")
    authUrl.searchParams.append("state", state)
    authUrl.searchParams.append("code_challenge_method", "S256")
    authUrl.searchParams.append("code_challenge", "challenge") // In production, use PKCE

    return NextResponse.redirect(authUrl.toString())
} 
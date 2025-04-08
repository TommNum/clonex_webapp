import { NextResponse } from "next/server"

export async function GET() {
    const generateRandomString = (length: number) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let text = ''
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return text
    }

    const generateCodeChallenge = async (codeVerifier: string) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(codeVerifier)
        const digest = await crypto.subtle.digest('SHA-256', data)
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    }

    const codeVerifier = generateRandomString(128)
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateRandomString(16)

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: process.env.TWITTER_REDIRECT_URI!,
        scope: 'tweet.read users.read offline.access',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    })

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`

    // Create response with Set-Cookie header
    const response = NextResponse.redirect(authUrl)
    response.headers.set(
        'Set-Cookie',
        `code_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Lax; Path=/`
    )

    return response
} 
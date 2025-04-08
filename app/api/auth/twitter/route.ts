import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
    // Generate PKCE code verifier and challenge
    const codeVerifier = crypto.randomBytes(32).toString("base64url")
    const codeChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url")

    // Store code verifier in localStorage via a script
    const script = `
        <script>
            localStorage.setItem('code_verifier', '${codeVerifier}');
            window.location.href = 'https://twitter.com/i/oauth2/authorize?${new URLSearchParams({
        response_type: "code",
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: "https://clonexwebapp-production.up.railway.app/auth/callback",
        scope: "tweet.read users.read offline.access",
        state: "state",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    })}';
        </script>
    `

    return new Response(script, {
        headers: {
            'Content-Type': 'text/html',
        },
    })
} 
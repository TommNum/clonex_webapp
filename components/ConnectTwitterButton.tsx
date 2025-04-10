"use client"

import { useAuth } from "@/contexts/AuthContext"
import GlassButton from "./GlassButton"

export default function ConnectTwitterButton() {
    const { isAuthenticated, logout } = useAuth()

    const handleConnect = () => {
        // Generate PKCE challenge
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
            const digest = await window.crypto.subtle.digest('SHA-256', data)
            return btoa(String.fromCharCode(...new Uint8Array(digest)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '')
        }

        const codeVerifier = generateRandomString(128)
        localStorage.setItem('code_verifier', codeVerifier)
        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            const state = generateRandomString(16)
            const params = new URLSearchParams({
                response_type: 'code',
                client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
                redirect_uri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI!,
                scope: 'tweet.read users.read offline.access',
                state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256',
            })

            const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`
            window.location.href = authUrl
        })
    }

    return (
        <GlassButton
            onClick={isAuthenticated ? logout : handleConnect}
            className="w-full bg-gradient-to-b from-purple-500/40 to-purple-500/10"
        >
            {isAuthenticated ? "Disconnect X" : "Connect X"}
        </GlassButton>
    )
} 
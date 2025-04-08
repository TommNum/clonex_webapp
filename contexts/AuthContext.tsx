"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('twitter_access_token')
        console.log("Auth check - token found:", !!token, "token:", token)
        setIsAuthenticated(!!token)
    }, [])

    const login = () => {
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

    const logout = () => {
        localStorage.removeItem('twitter_access_token')
        setIsAuthenticated(false)
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
} 
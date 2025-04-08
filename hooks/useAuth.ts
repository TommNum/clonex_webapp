import { useState, useCallback } from "react"
import axios from "axios"

interface User {
    id: string
    username: string
    profileImageUrl?: string
}

interface AuthResponse {
    user: User
    accessToken: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    const handleCallback = useCallback(async (code: string, state: string) => {
        try {
            setLoading(true)

            // Call our backend to exchange the code for tokens
            const response = await axios.get<AuthResponse>(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
                {
                    params: { code, state },
                    withCredentials: true // Important for cookies
                }
            )

            setUser(response.data.user)
            return response.data
        } catch (error) {
            console.error("Error in handleCallback:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [])

    const connectTwitter = useCallback(async () => {
        try {
            setLoading(true)

            // Get the auth URL from our backend
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/initiate`,
                {},
                { withCredentials: true }
            )

            // Redirect to Twitter's auth page
            window.location.href = response.data.authUrl
        } catch (error) {
            console.error("Error initiating Twitter auth:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
                {},
                { withCredentials: true }
            )
            setUser(null)
        } catch (error) {
            console.error("Error logging out:", error)
            throw error
        }
    }, [])

    return {
        user,
        loading,
        handleCallback,
        connectTwitter,
        logout
    }
} 
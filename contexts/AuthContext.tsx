"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return undefined
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check for token in cookies on mount
        const checkAuth = () => {
            const token = getCookie("twitter_access_token")
            console.log("Auth check - token found:", !!token, "token:", token, "all cookies:", document.cookie)
            if (token) {
                setIsAuthenticated(true)
            }
        }

        // Check immediately
        checkAuth()

        // Also check after a short delay to ensure cookie is available
        const timeoutId = setTimeout(checkAuth, 1000)

        return () => clearTimeout(timeoutId)
    }, [])

    const login = () => {
        router.push("/api/auth/twitter")
    }

    const logout = () => {
        document.cookie = "twitter_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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
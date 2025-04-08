"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check for token in cookies on mount
        const token = Cookies.get("twitter_access_token")
        console.log("Auth check - token found:", !!token)
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    const login = () => {
        router.push("/api/auth/twitter")
    }

    const logout = () => {
        Cookies.remove("twitter_access_token")
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
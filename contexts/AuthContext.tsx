"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
    isAuthenticated: boolean
    user: any | null
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<any | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Check if user is already authenticated
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/me")
                if (response.ok) {
                    const data = await response.json()
                    setIsAuthenticated(true)
                    setUser(data)
                }
            } catch (error) {
                console.error("Auth check failed:", error)
            }
        }

        checkAuth()
    }, [])

    const login = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL is not defined")
            return
        }
        window.location.href = `${apiUrl}/auth/twitter`
    }

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            setIsAuthenticated(false)
            setUser(null)
            router.push("/")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
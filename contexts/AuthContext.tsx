"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
    id: string
    username: string
    email: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data)
                setError(null)
            } else {
                setUser(null)
            }
        } catch (err) {
            console.error('Auth check failed:', err)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (username: string, password: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Login failed')
            }

            await checkAuth()
            router.push('/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            setLoading(true)
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
            setUser(null)
            router.push('/login')
        } catch (err) {
            console.error('Logout failed:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            error,
            login,
            logout,
            checkAuth
        }}>
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
"use client"

import { useAuth } from "@/contexts/AuthContext"
import GlassButton from "./GlassButton"

export default function ConnectTwitterButton() {
    const { isAuthenticated, login, logout } = useAuth()

    return (
        <GlassButton
            onClick={isAuthenticated ? logout : login}
            className="w-full bg-gradient-to-b from-purple-500/40 to-purple-500/10"
        >
            {isAuthenticated ? "Disconnect X" : "Connect X"}
        </GlassButton>
    )
} 
"use client"

import { useAuth } from "@/hooks/useAuth"
import GlassButton from "./GlassButton"

export default function ConnectTwitterButton() {
    const { user, connectTwitter, logout } = useAuth()

    return (
        <GlassButton
            onClick={user ? logout : connectTwitter}
            className="w-full bg-gradient-to-b from-purple-500/40 to-purple-500/10"
        >
            {user ? "Disconnect X" : "Connect X"}
        </GlassButton>
    )
} 
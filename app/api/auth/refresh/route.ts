import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const cookie = request.headers.get("cookie")
        const refreshToken = cookie?.split(";").find((c: string) => c.trim().startsWith("twitter_refresh_token="))?.split("=")[1]

        if (!refreshToken) {
            return NextResponse.json({ error: "No refresh token found" }, { status: 401 })
        }

        const formData = new FormData()
        formData.append("refresh_token", refreshToken)

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/token`, {
            method: "POST",
            body: formData
        })

        if (!response.ok) {
            const errorData = await response.json()
            return NextResponse.json({ error: errorData.error || "Token refresh failed" }, { status: response.status })
        }

        return response
    } catch (error) {
        console.error("Token refresh error:", error)
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Server error" 
        }, { status: 500 })
    }
} 
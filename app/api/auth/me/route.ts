import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const cookie = request.headers.get("cookie")
    const accessToken = cookie?.split(";").find((c: string) => c.trim().startsWith("twitter_access_token="))?.split("=")[1]

    if (!accessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
        const response = await fetch("https://api.twitter.com/2/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching user data:", error)
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }
} 
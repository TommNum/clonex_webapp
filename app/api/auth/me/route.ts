import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('twitter_access_token')?.value
    const refreshToken = cookieStore.get('twitter_refresh_token')?.value
    const twitterId = cookieStore.get('twitter_id')?.value

    if (!accessToken || !refreshToken || !twitterId) {
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
        return NextResponse.json({
            ...data,
            twitterId,
            twitterToken: accessToken,
            twitterRefreshToken: refreshToken
        })
    } catch (error) {
        console.error("Error fetching user data:", error)
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }
} 
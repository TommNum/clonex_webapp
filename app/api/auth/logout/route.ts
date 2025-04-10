import { NextResponse } from "next/server"
import { headers } from 'next/headers'

export async function POST() {
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const redirectUrl = `${protocol}://${host}/`

    const response = NextResponse.redirect(redirectUrl)

    // Clear session cookie
    response.cookies.set({
        name: "session",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    })

    // Clear access token
    response.cookies.set({
        name: "twitter_access_token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    })

    // Clear refresh token
    response.cookies.set({
        name: "twitter_refresh_token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    })

    return response
} 
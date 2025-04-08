import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.redirect("/")
    response.cookies.set({
        name: "twitter_access_token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    })

    return response
} 
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const code = formData.get("code")
        const codeVerifier = formData.get("code_verifier")

        if (!code || !codeVerifier) {
            console.error("Missing params:", { code: !!code, codeVerifier: !!codeVerifier })
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=missing_params`)
        }

        console.log("Attempting token exchange with:", {
            code: code.toString().substring(0, 10) + "...",
            codeVerifier: codeVerifier.toString().substring(0, 10) + "...",
            redirectUri: process.env.TWITTER_REDIRECT_URI
        })

        const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: code.toString(),
                grant_type: "authorization_code",
                client_id: process.env.TWITTER_CLIENT_ID!,
                redirect_uri: process.env.TWITTER_REDIRECT_URI!,
                code_verifier: codeVerifier.toString(),
            }),
        })

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text()
            console.error("Token exchange failed:", {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                error: errorText
            })
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=token_exchange_failed`)
        }

        const { access_token } = await tokenResponse.json()
        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`)

        response.cookies.set({
            name: "twitter_access_token",
            value: access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })

        return response
    } catch (error) {
        console.error("Server error during token exchange:", error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=server_error`)
    }
}

// Add GET handler to handle the initial OAuth callback
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=no_code`)
    }

    // Return a simple HTML page that submits the form with the code
    return new Response(`
        <!DOCTYPE html>
        <html>
            <body>
                <script>
                    const codeVerifier = localStorage.getItem('code_verifier');
                    if (!codeVerifier) {
                        window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL}/?error=no_verifier';
                    } else {
                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = '/auth/callback';
                        
                        const codeInput = document.createElement('input');
                        codeInput.type = 'hidden';
                        codeInput.name = 'code';
                        codeInput.value = '${code}';
                        
                        const verifierInput = document.createElement('input');
                        verifierInput.type = 'hidden';
                        verifierInput.name = 'code_verifier';
                        verifierInput.value = codeVerifier;
                        
                        form.appendChild(codeInput);
                        form.appendChild(verifierInput);
                        document.body.appendChild(form);
                        
                        localStorage.removeItem('code_verifier');
                        form.submit();
                    }
                </script>
                <p>Completing authentication...</p>
            </body>
        </html>
    `, {
        headers: {
            'Content-Type': 'text/html',
        },
    })
} 
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const code = formData.get("code")
        const codeVerifier = formData.get("code_verifier")

        if (!code || !codeVerifier) {
            return NextResponse.redirect(new URL("/?error=missing_params", request.url))
        }

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
            return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url))
        }

        const { access_token } = await tokenResponse.json()
        const response = NextResponse.redirect(new URL("/dashboard", request.url))

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
        return NextResponse.redirect(new URL("/?error=server_error", request.url))
    }
}

// Add GET handler to handle the initial OAuth callback
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
        return NextResponse.redirect(new URL("/?error=no_code", request.url))
    }

    // Return a simple HTML page that submits the form with the code
    return new Response(`
        <!DOCTYPE html>
        <html>
            <body>
                <script>
                    const codeVerifier = localStorage.getItem('code_verifier');
                    if (!codeVerifier) {
                        window.location.href = '/?error=no_verifier';
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
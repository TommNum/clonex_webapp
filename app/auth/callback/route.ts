import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=no_code`)
    }

    // Return HTML that will get the code_verifier from localStorage and do the token exchange
    return new Response(`
        <!DOCTYPE html>
        <html>
            <body>
                <script>
                    (async function() {
                        try {
                            const codeVerifier = localStorage.getItem('code_verifier');
                            if (!codeVerifier) {
                                window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL}/?error=no_verifier';
                                return;
                            }

                            const tokenResponse = await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: new URLSearchParams({
                                    code: '${code}',
                                    code_verifier: codeVerifier,
                                }),
                            });

                            if (!tokenResponse.ok) {
                                throw new Error('Token exchange failed');
                            }

                            const { access_token } = await tokenResponse.json();
                            
                            // Store the token in a cookie
                            document.cookie = \`twitter_access_token=\${access_token}; path=/; secure; samesite=lax\`;
                            localStorage.removeItem('code_verifier');
                            
                            // Redirect to dashboard
                            window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL}/dashboard';
                        } catch (error) {
                            console.error('Error:', error);
                            window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL}/?error=token_exchange_failed';
                        }
                    })();
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
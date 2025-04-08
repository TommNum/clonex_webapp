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

                            const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: new URLSearchParams({
                                    code: '${code}',
                                    grant_type: 'authorization_code',
                                    client_id: '${process.env.TWITTER_CLIENT_ID}',
                                    redirect_uri: '${process.env.TWITTER_REDIRECT_URI}',
                                    code_verifier: codeVerifier,
                                }),
                            });

                            if (!tokenResponse.ok) {
                                throw new Error('Token exchange failed');
                            }

                            const { access_token } = await tokenResponse.json();
                            
                            // Store the token and redirect
                            localStorage.setItem('twitter_access_token', access_token);
                            localStorage.removeItem('code_verifier');
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
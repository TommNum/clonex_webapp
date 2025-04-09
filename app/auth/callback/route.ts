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
            <head>
                <title>Authenticating...</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background: black;
                        color: white;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    }
                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        text-align: center;
                        padding: 2rem;
                    }
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top-color: white;
                        animation: spin 1s ease-in-out infinite;
                        margin-bottom: 1rem;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="loading-container">
                    <div class="spinner"></div>
                    <h1>Completing authentication...</h1>
                    <p>Please wait while we connect your account.</p>
                </div>
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
                                const errorData = await tokenResponse.json();
                                throw new Error(errorData.error || 'Token exchange failed');
                            }

                            const { access_token } = await tokenResponse.json();
                            
                            // Store the token in a cookie
                            document.cookie = \`twitter_access_token=\${access_token}; path=/; secure; samesite=lax\`;
                            localStorage.removeItem('code_verifier');
                            
                            // Redirect to dashboard
                            window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL}/dashboard';
                        } catch (error) {
                            console.error('Error:', error);
                            window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL}/?error=' + encodeURIComponent(error.message || 'token_exchange_failed');
                        }
                    })();
                </script>
            </body>
        </html>
    `, {
        headers: {
            'Content-Type': 'text/html',
        },
    })
} 
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    console.log("Callback received - code:", code, "state:", state)

    if (!code) {
      console.error("Missing code parameter")
      return NextResponse.redirect(new URL("/?error=missing_code", process.env.NEXT_PUBLIC_BASE_URL))
    }

    // Create a script to read code_verifier from localStorage and submit the form
    const script = `
          <script>
            const codeVerifier = localStorage.getItem('code_verifier');
            if (!codeVerifier) {
              window.location.href = '/?error=missing_verifier';
            } else {
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = '/api/auth/callback';
              
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
              form.submit();
            }
          </script>
        `

    return new Response(script, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error("Error in callback handler:", error)
    return NextResponse.redirect(new URL("/?error=server_error", process.env.NEXT_PUBLIC_BASE_URL))
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const code = formData.get("code")
    const codeVerifier = formData.get("code_verifier")

    if (!code || !codeVerifier) {
      return NextResponse.redirect(new URL("/?error=missing_params", process.env.NEXT_PUBLIC_BASE_URL))
    }

    // Exchange code for token
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
      console.error("Token exchange failed:", errorText)
      return NextResponse.redirect(new URL("/?error=token_exchange_failed", process.env.NEXT_PUBLIC_BASE_URL))
    }

    const { access_token, refresh_token } = await tokenResponse.json()

    // Create response with tokens in cookies
    const response = NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL))

    // Set access token cookie
    response.cookies.set({
      name: "twitter_access_token",
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    // Set refresh token cookie if available
    if (refresh_token) {
      response.cookies.set({
        name: "twitter_refresh_token",
        value: refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("Error in token exchange:", error)
    return NextResponse.redirect(new URL("/?error=server_error", process.env.NEXT_PUBLIC_BASE_URL))
  }
} 
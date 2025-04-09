import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || ''
    
    // Only run this middleware for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const response = NextResponse.next()
        
        // Set CORS headers
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set('Access-Control-Allow-Origin', origin || '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        
        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 200,
                headers: response.headers,
            })
        }
        
        return response
    }
    
    return NextResponse.next()
}

// Configure the middleware to run only for API routes
export const config = {
    matcher: '/api/:path*',
} 
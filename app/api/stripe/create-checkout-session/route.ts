import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        // Validate environment variables
        if (!process.env.BACKEND_INTERNAL_URL) {
            throw new Error('BACKEND_INTERNAL_URL is not set');
        }

        if (!process.env.STRIPE_PRICE_ID) {
            throw new Error('STRIPE_PRICE_ID is not set');
        }

        // Get Twitter ID from cookies
        const cookieStore = cookies();
        const twitterId = cookieStore.get('twitter_id')?.value;
        const twitterToken = cookieStore.get('twitter_access_token')?.value;

        if (!twitterId || !twitterToken) {
            return NextResponse.json({ error: 'No active session' }, { status: 401 });
        }

        // Parse and validate request body
        let body;
        try {
            body = await req.json();
            console.log('Received request body:', body);
        } catch (e) {
            console.error('Failed to parse request body:', e);
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!body.successUrl || !body.cancelUrl) {
            return NextResponse.json(
                { error: 'successUrl and cancelUrl are required' },
                { status: 400 }
            );
        }

        // Prepare the request to the backend
        const backendRequest = {
            twitterUserId: twitterId,
            priceId: process.env.STRIPE_PRICE_ID,
            successUrl: body.successUrl,
            cancelUrl: body.cancelUrl,
        };

        console.log('Sending request to backend:', backendRequest);

        // Forward request to Express backend over private network
        const response = await axios.post(
            `${process.env.BACKEND_INTERNAL_URL}/api/stripe/create-checkout-session`,
            backendRequest,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${twitterToken}`
                },
            }
        );

        console.log('Backend response:', response.data);

        if (!response.data || !response.data.sessionId) {
            throw new Error('Invalid response from backend: missing sessionId');
        }

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error in create-checkout-session:', error);

        if (error.response) {
            console.error('Backend response error:', error.response.data);
            return NextResponse.json(
                { error: error.response.data.error || 'Backend error' },
                { status: error.response.status }
            );
        }

        if (error.message.includes('is not set')) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
} 
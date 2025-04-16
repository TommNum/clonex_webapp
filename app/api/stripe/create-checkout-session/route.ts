import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Forward request to Express backend over private network
        const response = await axios.post(
            `${process.env.BACKEND_INTERNAL_URL}/api/stripe/create-checkout-session`,
            {
                ...body,
                priceId: process.env.STRIPE_PRICE_ID, // Price ID from environment variables
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error calling Express API:', error.message);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
} 
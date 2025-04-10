import { NextResponse } from 'next/server';
import { serverApi } from '@/app/services/api';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const nextToken = searchParams.get('nextToken') || undefined;

    // Get all cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    console.log('=== Timeline API Debug ===');
    console.log('All cookies:', allCookies);

    // Get Twitter credentials directly from cookies
    const twitterId = cookieStore.get('twitter_id')?.value;
    const twitterToken = cookieStore.get('twitter_access_token')?.value;

    console.log('Twitter credentials:', {
        twitterId: twitterId ? 'present' : 'missing',
        twitterToken: twitterToken ? 'present' : 'missing'
    });

    if (!twitterId || !twitterToken) {
        console.log('Missing Twitter credentials:', { twitterId, twitterToken });
        return NextResponse.json(
            { error: 'Twitter credentials not found' },
            { status: 401 }
        );
    }

    try {
        console.log('=== Timeline API Request ===');
        console.log('Next token:', nextToken);
        console.log('Backend URL:', process.env.BACKEND_INTERNAL_URL);
        console.log('Full request URL:', `${process.env.BACKEND_INTERNAL_URL}/twitter/user/${twitterId}/timeline`);

        const response = await serverApi.get(`/twitter/user/${twitterId}/timeline`, {
            params: nextToken ? { next_token: nextToken } : undefined,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${twitterToken}`
            }
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Timeline fetch error:', error);
        if (error instanceof AxiosError && error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        }
        return NextResponse.json(
            { error: 'Failed to fetch timeline' },
            { status: 500 }
        );
    }
} 
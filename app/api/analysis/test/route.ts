import { NextResponse } from 'next/server';
import { serverApi } from '@/app/services/api';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';

export async function POST() {
    // Get all cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    console.log('=== Analysis Test API Debug ===');
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
        console.log('=== Analysis Test API Request ===');
        console.log('Backend URL:', process.env.BACKEND_INTERNAL_URL);
        console.log('Full request URL:', `${process.env.BACKEND_INTERNAL_URL}/api/analysis/create`);

        // Log the exact token being sent (without the Bearer prefix for security)
        console.log('Token being sent:', twitterToken.substring(0, 10) + '...');

        const response = await serverApi.post('/api/analysis/create', {
            user_id: twitterId
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${twitterToken}`,
                'X-Twitter-User-Id': twitterId
            }
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Analysis test error:', error);
        if (error instanceof AxiosError && error.response) {
            const authHeader = error.config?.headers?.['Authorization'];
            const maskedAuth = typeof authHeader === 'string' ?
                'Bearer ' + authHeader.split(' ')[1].substring(0, 10) + '...' :
                undefined;

            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
                request: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: {
                        ...error.config?.headers,
                        Authorization: maskedAuth,
                        'X-Twitter-User-Id': error.config?.headers?.['X-Twitter-User-Id']
                    },
                    data: error.config?.data
                }
            });
        }
        return NextResponse.json(
            { error: 'Failed to test analysis' },
            { status: 500 }
        );
    }
} 
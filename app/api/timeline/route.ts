import { NextResponse } from 'next/server';
import { serverApi } from '@/app/services/api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const nextToken = searchParams.get('nextToken') || undefined;

    try {
        console.log('=== Timeline Route Handler ===');
        console.log('Next token:', nextToken);
        console.log('Backend URL:', process.env.BACKEND_INTERNAL_URL);

        const response = await serverApi.get('/api/timeline', {
            params: { next_token: nextToken },
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Timeline fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch timeline' },
            { status: 500 }
        );
    }
} 
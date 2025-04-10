import { NextResponse } from 'next/server';
import serverApi from '@/app/services/api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const nextToken = searchParams.get('nextToken') || undefined;

    try {
        console.log('=== Timeline API Route ===');
        console.log('Next token:', nextToken);

        const response = await serverApi.get('/api/timeline', {
            params: nextToken ? { next_token: nextToken } : undefined,
            headers: {
                'Accept': 'application/json'
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Timeline fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch timeline' },
            { status: 500 }
        );
    }
} 
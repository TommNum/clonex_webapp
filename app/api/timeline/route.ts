import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://wholesome-creation-production.up.railway.app';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const nextToken = searchParams.get('next_token');

        const response = await axios.get(`${BACKEND_URL}/api/timeline`, {
            params: { next_token: nextToken },
            withCredentials: true
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching timeline:', error);
        return NextResponse.json(
            { error: 'Failed to fetch timeline' },
            { status: 500 }
        );
    }
} 
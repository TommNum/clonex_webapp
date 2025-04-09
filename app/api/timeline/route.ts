import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://wholesome-creation-production.up.railway.app';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const nextToken = searchParams.get('next_token');

        const url = `${BACKEND_URL}/api/timeline`;
        console.log('=== Timeline API Request ===');
        console.log('Request URL:', request.url);
        console.log('Backend URL:', url);
        console.log('Query params:', { nextToken });

        const response = await axios.get(url, {
            params: { next_token: nextToken },
            withCredentials: true
        });

        console.log('=== Timeline API Response ===');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Data:', response.data);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('=== Timeline API Error ===');
        if (axios.isAxiosError(error)) {
            console.error('Error URL:', error.config?.url);
            console.error('Error Method:', error.config?.method);
            console.error('Error Headers:', error.config?.headers);
            console.error('Error Status:', error.response?.status);
            console.error('Error Status Text:', error.response?.statusText);
            console.error('Error Data:', error.response?.data);
            console.error('Error Headers:', error.response?.headers);
        } else {
            console.error('Unknown error:', error);
        }
        return NextResponse.json(
            { error: 'Failed to fetch timeline' },
            { status: 500 }
        );
    }
} 
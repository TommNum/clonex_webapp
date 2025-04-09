import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://wholesome-creation-production.up.railway.app';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const nextToken = searchParams.get('next_token');

        // Get cookies from the incoming request
        const cookies = request.headers.get('cookie');

        const url = `${BACKEND_URL}/api/timeline`;
        console.log('=== Timeline API Request ===');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Backend URL:', BACKEND_URL);
        console.log('Request URL:', request.url);
        console.log('Full Backend URL:', url);
        console.log('Query params:', { nextToken });
        console.log('Cookies:', cookies);
        console.log('Request Headers:', {
            origin: request.headers.get('origin'),
            referer: request.headers.get('referer'),
            host: request.headers.get('host')
        });

        const response = await axios.get(url, {
            params: { next_token: nextToken },
            withCredentials: true,
            headers: {
                Cookie: cookies || '',
                'Content-Type': 'application/json',
                'Origin': 'https://clonexwebapp-production.up.railway.app'
            }
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
            console.error('Error Config:', {
                baseURL: error.config?.baseURL,
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            });
        } else {
            console.error('Unknown error:', error);
        }
        return NextResponse.json(
            { error: 'Failed to fetch timeline' },
            { status: 500 }
        );
    }
} 
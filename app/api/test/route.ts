import { NextResponse } from 'next/server';
import { testBackendConnection } from '@/app/services/api';

export async function GET() {
    try {
        const response = await testBackendConnection();
        return NextResponse.json(response);
    } catch (error) {
        console.error('Test route error:', error);
        return NextResponse.json(
            { error: 'Failed to test backend connection' },
            { status: 500 }
        );
    }
} 
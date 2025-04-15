import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { user_id } = await req.json();

        if (!user_id) {
            return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
        }

        // Make request to the backend service
        const response = await fetch(`${process.env.BACKEND_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ user_id })
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error: error.message || 'Failed to generate tweets' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error generating tweets:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 
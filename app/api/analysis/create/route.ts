import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();

    const twitterId = cookieStore.get('twitter_id')?.value;
    const twitterToken = cookieStore.get('twitter_access_token')?.value;

    if (!twitterId || !twitterToken) {
        return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    try {
        const response = await fetch('http://wholesome-creation.railway.internal:3001/api/analysis/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${twitterToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: twitterId
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create analysis: ${response.statusText}`);
        }

        const analysis = await response.json();
        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Error creating analysis:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create analysis' },
            { status: 500 }
        );
    }
} 
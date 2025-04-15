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
        const response = await fetch('http://wholesome-creation.railway.internal:3001/api/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${twitterToken}`,
                'Content-Type': 'application/json',
                'X-Twitter-User-Id': twitterId
            },
            body: JSON.stringify({
                user_id: twitterId
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to generate tweets: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error generating tweets:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate tweets' },
            { status: 500 }
        );
    }
} 
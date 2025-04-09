import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const session = await getSession({ req });
        
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Return the user information from the session
        res.status(200).json({
            user: session.user,
            expires: session.expires
        });
    } catch (error) {
        console.error('Session error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} 
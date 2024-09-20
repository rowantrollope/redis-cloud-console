import type { Handle } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { connectRedisClient, redisClient } from './lib/redisClient';

export const handle: Handle = async ({ event, resolve }) => {
    let userId = event.cookies.get('user_id');

    if (!userId) {
        userId = uuidv4();
        event.cookies.set('user_id', userId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
    }
    console.log("userId", userId)
    // Make userId available in locals
    event.locals.userId = userId;

    if (!redisClient.isOpen) {
        await connectRedisClient()
    }

    return resolve(event);
};

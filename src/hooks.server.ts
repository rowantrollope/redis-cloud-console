import type { Handle } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { connectRedisClient, redisClient } from './lib/redisClient';

export const handle: Handle = async ({ event, resolve }) => {
    let userId = event.cookies.get('user_id');

    if (!userId) {
        userId = uuidv4();

        // Determine if the original request was over HTTPS
        const protocolHeader = event.request.headers.get('x-forwarded-proto');
        const isSecureConnection = protocolHeader
            ? protocolHeader.includes('https')
            : event.url.protocol === 'https:';

        event.cookies.set('user_id', userId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: isSecureConnection,
        });
    }
    console.log("userId", userId);

    // Make userId available in locals
    event.locals.userId = userId;

    if (!redisClient.isOpen) {
        await connectRedisClient();
    }

    return resolve(event);
};

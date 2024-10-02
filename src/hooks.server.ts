import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { connectRedisClient, redisClient } from '$lib/redisClient';
import crypto from 'crypto';

export const handle: Handle = async ({ event, resolve }) => {
    let userId = event.cookies.get('user_id');

    if (!userId) {
        userId = crypto.randomUUID();
        event.cookies.set('user_id', userId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: event.url.protocol === 'https:',
        });
    }

    // Make userId available in locals
    event.locals.userId = userId;

    // Retrieve access token from cookies
    const cookies = parse(event.request.headers.get('cookie') || '');
    const accessToken = cookies.access_token;
    if (accessToken) {
        event.locals.accessToken = accessToken;
    } 

    if (!redisClient.isOpen) {
        await connectRedisClient();
    }

    return resolve(event);
};

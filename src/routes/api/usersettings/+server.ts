import type { RequestHandler } from './$types';
import { redisClient } from '$lib/redisClient'; 

// Function to get user ID from the request
function getUserId(request: Request): string | null {
    const cookies = request.headers.get('cookie');
    if (!cookies) return null;
    
    const userIdMatch = cookies.split(';')
        .find(cookie => cookie.trim().startsWith('user_id='));
    
    if (!userIdMatch) return null;
    
    return userIdMatch.split('=')[1].trim();
}

export const GET: RequestHandler = async ({ request }) => {
    const userId = getUserId(request);
    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const settingsKey = `user:${userId}:settings`;
    const settings = await redisClient.json.get(settingsKey);

    if (settings) {
        console.log("/api/usersettings GET", settings)
        return new Response(JSON.stringify(settings), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        return new Response('Not Found', { status: 404 });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    const userId = getUserId(request);
    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const settingsKey = `user:${userId}:settings`;
    const body = await request.text();

    try {
        const data = JSON.parse(body); // Validate JSON
        console.log("/api/usersettings PUT", data)
        await redisClient.json.set(settingsKey, "$", data);
        return new Response('Settings updated', { status: 200 });
    } catch (error) {
        return new Response('Invalid JSON', { status: 400 });
    }
};

